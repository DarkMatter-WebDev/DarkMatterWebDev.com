param(
    [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

$rootPath = (Resolve-Path $Root).Path
$issues = New-Object System.Collections.Generic.List[object]

function Add-Issue {
    param(
        [string]$Type,
        [string]$File,
        [int]$Line = 0,
        [string]$Message
    )

    $relative = if ($File) { Get-RelativePath $File } else { "" }

    $issues.Add([pscustomobject]@{
        Type = $Type
        File = $relative
        Line = $Line
        Message = $Message
    })
}

function Get-RelativePath {
    param([string]$Path)

    try {
        $full = (Resolve-Path -LiteralPath $Path).Path
        if ($full.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
            return $full.Substring($rootPath.Length).TrimStart("\", "/")
        }
        return $full
    } catch {
        return $Path
    }
}

function Get-LineNumber {
    param(
        [string]$Text,
        [int]$Index
    )

    if ($Index -le 0) {
        return 1
    }

    return (($Text.Substring(0, $Index) -split "`n").Count)
}

function Resolve-SitePath {
    param(
        [string]$FromFile,
        [string]$Url
    )

    $clean = ($Url -split "#", 2)[0]
    $clean = ($clean -split "\?", 2)[0]

    if ([string]::IsNullOrWhiteSpace($clean)) {
        return $null
    }

    $decoded = [System.Uri]::UnescapeDataString($clean)

    if ($decoded.StartsWith("/")) {
        return Join-Path $rootPath ($decoded.TrimStart("/") -replace "/", [System.IO.Path]::DirectorySeparatorChar)
    }

    return Join-Path (Split-Path $FromFile -Parent) ($decoded -replace "/", [System.IO.Path]::DirectorySeparatorChar)
}

function Test-SkipUrl {
    param([string]$Url)

    if ([string]::IsNullOrWhiteSpace($Url)) { return $true }
    if ($Url.StartsWith("#")) { return $true }
    if ($Url -match "^(https?:|mailto:|tel:|sms:|javascript:|data:|blob:)") { return $true }
    if ($Url -match "^\{\{") { return $true }

    return $false
}

function Read-TextFile {
    param([string]$Path)
    return Get-Content -Raw -Encoding UTF8 -LiteralPath $Path
}

$htmlFiles = Get-ChildItem -Path $rootPath -Recurse -File -Filter "*.html" |
    Where-Object { $_.FullName -notmatch "\\to-do\\" }

$pageHtmlFiles = $htmlFiles | Where-Object {
    (Get-RelativePath $_.FullName) -notmatch "^assets[\\/]"
}

$siteTextFiles = Get-ChildItem -Path $rootPath -Recurse -File |
    Where-Object {
        $_.Extension -in @(".html", ".css", ".js", ".toml") -and
        $_.FullName -notmatch "\\to-do\\"
    }

$allTextFiles = Get-ChildItem -Path $rootPath -Recurse -File |
    Where-Object {
        $_.Extension -in @(".html", ".css", ".js", ".toml", ".md", ".txt", ".json") -and
        $_.FullName -notmatch "\\to-do\\"
    }

Write-Host "Validating static site at $rootPath"

# 1. Old public email should never come back.
$oldEmail = "darkmatterwebservices@gmail.com"
foreach ($file in $allTextFiles) {
    $content = Read-TextFile $file.FullName
    $matches = [regex]::Matches($content, [regex]::Escape($oldEmail), "IgnoreCase")
    foreach ($match in $matches) {
        Add-Issue "old-email" $file.FullName (Get-LineNumber $content $match.Index) "Old email address found: $oldEmail"
    }
}

# 2. Mojibake markers in deployable site files.
$mojibakeTokens = @(
    [string][char]0x00C3,
    [string][char]0x00C2,
    [string][char]0xFFFD,
    (([string][char]0x00E2) + ([string][char]0x20AC)),
    (([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x2122)),
    (([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x0153)),
    (([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x009D)),
    (([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x201C)),
    (([string][char]0x00E2) + ([string][char]0x20AC) + ([string][char]0x201D)),
    (([string][char]0x00E2) + ([string][char]0x201E) + ([string][char]0x00A2))
)
$mojibakePattern = ($mojibakeTokens | ForEach-Object { [regex]::Escape($_) }) -join "|"

foreach ($file in $siteTextFiles) {
    $content = Read-TextFile $file.FullName
    $matches = [regex]::Matches($content, $mojibakePattern)
    foreach ($match in $matches) {
        Add-Issue "mojibake" $file.FullName (Get-LineNumber $content $match.Index) "Possible character encoding artifact near '$($match.Value)'"
    }
}

# 3. Internal href/src/action targets should exist.
$attrPattern = '(href|src|action)\s*=\s*([''"])(.*?)\2'
foreach ($file in $pageHtmlFiles) {
    $content = Read-TextFile $file.FullName
    $matches = [regex]::Matches($content, $attrPattern, "IgnoreCase")

    foreach ($match in $matches) {
        $attr = $match.Groups[1].Value.ToLowerInvariant()
        $url = $match.Groups[3].Value.Trim()

        if (Test-SkipUrl $url) {
            continue
        }

        # Netlify forms commonly post to the site root.
        if ($attr -eq "action" -and ($url -eq "/" -or $url -eq ".")) {
            continue
        }

        $target = Resolve-SitePath $file.FullName $url
        if (-not $target) {
            continue
        }

        $exists = Test-Path -LiteralPath $target
        if (-not $exists -and (Test-Path -LiteralPath ($target + ".html"))) {
            $exists = $true
        }
        if (-not $exists -and (Test-Path -LiteralPath (Join-Path $target "index.html"))) {
            $exists = $true
        }

        if (-not $exists) {
            Add-Issue "broken-link" $file.FullName (Get-LineNumber $content $match.Index) "Missing internal $attr target: $url"
        }
    }
}

# 4. Same-page hash links should point to an id/name on the page.
foreach ($file in $pageHtmlFiles) {
    $content = Read-TextFile $file.FullName
    $ids = New-Object "System.Collections.Generic.HashSet[string]"

    foreach ($idMatch in [regex]::Matches($content, '\s(?:id|name)\s*=\s*([''"])(.*?)\1', "IgnoreCase")) {
        [void]$ids.Add($idMatch.Groups[2].Value)
    }

    foreach ($hrefMatch in [regex]::Matches($content, 'href\s*=\s*([''"])(#[^''"]+)\1', "IgnoreCase")) {
        $hash = $hrefMatch.Groups[2].Value.Substring(1)
        if ($hash -and -not $ids.Contains($hash)) {
            Add-Issue "missing-anchor" $file.FullName (Get-LineNumber $content $hrefMatch.Index) "Missing same-page anchor target: #$hash"
        }
    }
}

# 5. English/Spanish page mirrors should stay paired.
$rootHtml = $pageHtmlFiles | Where-Object {
    $relative = Get-RelativePath $_.FullName
    $relative -notmatch "^es[\\/]"
}

foreach ($file in $rootHtml) {
    $relative = Get-RelativePath $file.FullName
    if ($relative -match "^Sean's Google Ads Services[\\/]") {
        continue
    }
    $spanish = Join-Path $rootPath (Join-Path "es" $relative)
    if (-not (Test-Path -LiteralPath $spanish)) {
        Add-Issue "missing-es-pair" $file.FullName 0 "Missing Spanish mirror: es/$($relative -replace '\\', '/')"
    }
}

$spanishHtml = $pageHtmlFiles | Where-Object {
    (Get-RelativePath $_.FullName) -match "^es[\\/]"
}

foreach ($file in $spanishHtml) {
    $relative = Get-RelativePath $file.FullName
    $englishRelative = $relative -replace "^es[\\/]", ""
    $english = Join-Path $rootPath $englishRelative
    if (-not (Test-Path -LiteralPath $english)) {
        Add-Issue "missing-en-pair" $file.FullName 0 "Missing English mirror: $($englishRelative -replace '\\', '/')"
    }
}

# 6. Any visible current email mention should normally be clickable.
$currentEmail = "darkmatterwebsites@gmail.com"
foreach ($file in $pageHtmlFiles) {
    $content = Read-TextFile $file.FullName
    $matches = [regex]::Matches($content, [regex]::Escape($currentEmail), "IgnoreCase")
    foreach ($match in $matches) {
        $anchorStart = $content.LastIndexOf("<a", $match.Index, [System.StringComparison]::OrdinalIgnoreCase)
        $anchorEnd = $content.IndexOf("</a>", $match.Index, [System.StringComparison]::OrdinalIgnoreCase)
        $context = ""
        if ($anchorStart -ge 0 -and $anchorEnd -gt $match.Index) {
            $context = $content.Substring($anchorStart, ($anchorEnd + 4 - $anchorStart))
        }
        if ($context -notmatch "mailto:darkmatterwebsites@gmail\.com") {
            Add-Issue "email-not-mailto" $file.FullName (Get-LineNumber $content $match.Index) "Email appears without nearby mailto link."
        }
    }
}

if ($issues.Count -eq 0) {
    Write-Host "Validation passed. No issues found." -ForegroundColor Green
    exit 0
}

Write-Host ""
Write-Host "Validation found $($issues.Count) issue(s):" -ForegroundColor Yellow

$issues |
    Sort-Object Type, File, Line |
    Format-Table Type, File, Line, Message -AutoSize -Wrap

exit 1
