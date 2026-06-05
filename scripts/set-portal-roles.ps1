# Sets Supabase Auth app_metadata.portal_role (and legacy app_metadata.role) for portal privileged users.
# Requires SUPABASE_SERVICE_ROLE_KEY in the environment (never commit this key).
#
# Usage:
#   $env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\set-portal-roles.ps1

$ErrorActionPreference = "Stop"

$envFile = Join-Path (Split-Path $PSScriptRoot -Parent) ".env.local"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)$') {
      $name = $matches[1].Trim()
      $value = $matches[2].Trim().Trim('"')
      Set-Item -Path "Env:$name" -Value $value
    }
  }
}

$projectUrl = if ($env:SUPABASE_URL) { $env:SUPABASE_URL.TrimEnd('/') } else { "https://evzluixourmsefwdsieu.supabase.co" }
$serviceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY

if ([string]::IsNullOrWhiteSpace($serviceRoleKey)) {
  Write-Error "Missing SUPABASE_SERVICE_ROLE_KEY. Set it in your shell, then run this script again."
}

$roleAssignments = @(
  @{ Email = "rcman12589@aol.com"; Role = "super_admin" },
  @{ Email = "scochrane495@gmail.com"; Role = "sean_ads_admin" }
)

$headers = @{
  apikey        = $serviceRoleKey
  Authorization = "Bearer $serviceRoleKey"
  "Content-Type" = "application/json"
}

function Get-AuthUserByEmail {
  param([string]$Email)

  $encodedEmail = [System.Uri]::EscapeDataString($Email)
  $uri = "$projectUrl/auth/v1/admin/users?email=$encodedEmail"
  $response = Invoke-RestMethod -Method Get -Uri $uri -Headers $headers

  if ($response.users -and $response.users.Count -gt 0) {
    return $response.users[0]
  }

  return $null
}

function Set-AuthUserRole {
  param(
    [string]$UserId,
    [hashtable]$ExistingAppMetadata,
    [string]$Role
  )

  $appMetadata = @{}
  if ($ExistingAppMetadata) {
    foreach ($key in $ExistingAppMetadata.Keys) {
      $appMetadata[$key] = $ExistingAppMetadata[$key]
    }
  }
  $appMetadata["portal_role"] = $Role
  $appMetadata["role"] = $Role

  $body = @{
    app_metadata = $appMetadata
  } | ConvertTo-Json -Depth 5

  $uri = "$projectUrl/auth/v1/admin/users/$UserId"
  Invoke-RestMethod -Method Put -Uri $uri -Headers $headers -Body $body | Out-Null
}

Write-Host "Setting portal roles in Supabase Auth..." -ForegroundColor Cyan

foreach ($assignment in $roleAssignments) {
  $email = $assignment.Email
  $role = $assignment.Role

  $user = Get-AuthUserByEmail -Email $email
  if (-not $user) {
    Write-Warning "No Auth user found for $email. Create the account first, then rerun this script."
    continue
  }

  $existing = @{}
  if ($user.app_metadata) {
    $user.app_metadata.PSObject.Properties | ForEach-Object {
      $existing[$_.Name] = $_.Value
    }
  }

  Set-AuthUserRole -UserId $user.id -ExistingAppMetadata $existing -Role $role
  Write-Host "Updated $email -> app_metadata.portal_role = $role" -ForegroundColor Green
}

Write-Host "Done." -ForegroundColor Cyan
