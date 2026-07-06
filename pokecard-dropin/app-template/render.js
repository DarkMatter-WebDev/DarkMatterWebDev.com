/* ============================================================
   render.js — reads window.SITE_CONFIG and fills every section.
   Runs before landing.js (which owns all animation/motion), so by
   the time animations boot, the real content is already in the DOM.
   ============================================================ */
(function(){
  "use strict";
  /* When the Node backend (server/server.js) is running, /api/config
     holds the live, admin-editable content — prefer it. On pure static
     hosting (no backend) this request fails silently and the page falls
     back to the bundled siteConfig.js defaults. Synchronous by design:
     it's a same-origin local read that must resolve before the rest of
     this script (and landing.js's split-text/physics setup) runs. */
  (function loadLiveConfig(){
    try{
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/api/config", false);
      xhr.send(null);
      if(xhr.status===200){
        var remote = JSON.parse(xhr.responseText);
        if(remote && remote.business) window.SITE_CONFIG = remote;
      }
    }catch(e){ /* no backend running — use siteConfig.js defaults */ }
  })();

  var C = window.SITE_CONFIG;
  if(!C) return;

  function $(id){ return document.getElementById(id); }
  function set(id, html){ var el=$(id); if(el) el.innerHTML=html; }
  function esc(s){ return String(s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

  /* ---------- head / meta ---------- */
  document.title = C.seo.title;
  var md=document.getElementById("metaDesc"); if(md) md.setAttribute("content", C.seo.description);
  document.documentElement.style.setProperty("--indigo", C.business.accent.indigo);
  document.documentElement.style.setProperty("--cyan", C.business.accent.cyan);
  document.documentElement.style.setProperty("--magenta", C.business.accent.magenta);
  document.documentElement.style.setProperty("--accent", C.business.accent.indigo);

  /* ---------- nav ---------- */
  var brandLetter = (C.business.shortName || C.business.name).charAt(0);
  var brandRest = (C.business.shortName || C.business.name).slice(1);
  set("navBrandText", '<span class="one">'+esc(brandLetter)+'</span>'+esc(brandRest));
  set("footerBrandText", '<span class="one">'+esc(brandLetter)+'</span>'+esc(brandRest));
  set("navLinks", C.nav.links.map(function(l){ return '<a href="'+esc(l.href)+'">'+esc(l.label)+'</a>'; }).join(""));
  var navCta=$("navCta"); if(navCta){ navCta.href=C.nav.ctaHref; navCta.innerHTML="<span>"+esc(C.nav.ctaLabel)+"</span>"; }

  /* ---------- hero ---------- */
  set("heroEyebrow", esc(C.hero.eyebrow));
  var h1 = $("heroHeadline");
  if(h1){
    h1.setAttribute("aria-label", C.hero.headline + C.hero.headlineAccent + C.hero.headlineEnd);
    h1.innerHTML = esc(C.hero.headline) + '<span class="grad">'+esc(C.hero.headlineAccent)+'</span>' + esc(C.hero.headlineEnd);
  }
  set("heroSub", C.hero.subheadline.replace(/<b>(.*?)<\/b>/g,"<b>$1</b>"));
  var hp=$("heroPrimaryCta"); if(hp){ hp.href=C.hero.primaryCtaHref; hp.innerHTML="<span>"+esc(C.hero.primaryCta)+"</span>"; }
  var hs=$("heroSecondaryCta"); if(hs){ hs.href=C.hero.secondaryCtaHref; hs.innerHTML="<span>"+esc(C.hero.secondaryCta)+"</span>"; }
  var dotClasses=["i","","m"];
  set("heroTags", C.hero.tags.map(function(t,i){ return '<span><i class="dot '+(dotClasses[i%3])+'"></i> '+esc(t)+'</span>'; }).join(""));

  var hud=C.hero.hud;
  function hud1(key,label,v){ set(key+"k", esc(label)); }
  set("hudTLk", esc(hud.topLeft.label)); var tlv=$("hudTLv"); if(tlv) tlv.setAttribute("data-count", hud.topLeft.value);
  set("hudMLk", esc(hud.midLeft.label)); var mlv=$("hudMLv"); if(mlv){ mlv.setAttribute("data-count", hud.midLeft.value); if(hud.midLeft.pad) mlv.setAttribute("data-pad", hud.midLeft.pad); }
  set("hudBLk", esc(hud.bottomLeft.label)); var blv=$("hudBLv"); if(blv) blv.setAttribute("data-count", hud.bottomLeft.value);
  set("hudTRk", esc(hud.topRight.label)); set("hudTRv", esc(hud.topRight.value));
  set("hudMRk", esc(hud.midRight.label)); set("hudMRv", esc(hud.midRight.value));
  set("hudBRk", esc(hud.bottomRight.label)); set("hudBRv", esc(hud.bottomRight.value));

  var dc=C.hero.demoCard;
  set("pmapTitle", esc(dc.title));
  set("pmapTyped", esc(dc.typedPrompt));
  set("pmapStatus", esc(dc.status));
  set("pmapCount", esc(dc.docLabel));
  set("pmCopy", esc(dc.copyLabel));
  set("pmDl", esc(dc.downloadLabel));
  set("pmapFull", esc(dc.readMoreLabel));

  /* ---------- marquee ---------- */
  (function(){ var t=$("marq"); if(!t) return; var html=C.marquee.map(function(x){ return "<span>"+esc(x)+"</span>"; }).join(""); t.innerHTML=html+html; })();

  /* ---------- demo (live generation) ---------- */
  set("demoEyebrow", esc(C.demo.eyebrow));
  var dh=$("demoHeadline"); if(dh){ dh.innerHTML = esc(C.demo.headline)+'<span class="grad">'+esc(C.demo.headlineAccent)+'</span>'; }
  set("demoDescription", esc(C.demo.description));
  set("genIdea", esc(C.demo.idea));
  set("promptLabel", "Service estimate");
  set("footTip", "this is exactly how your estimate will look");

  /* ---------- pipeline ---------- */
  set("pipelineEyebrow", esc(C.pipeline.eyebrow));
  var ph=$("pipelineHeadline"); if(ph){ ph.innerHTML = esc(C.pipeline.headline)+'<span class="grad">'+esc(C.pipeline.headlineAccent)+'</span>'; }
  (function(){
    var stage=$("pipelineStage"); if(!stage) return;
    var steps=C.pipeline.steps;
    stage.innerHTML = steps.map(function(s,i){
      var right;
      if(i===0){
        right = '<div class="sv" aria-hidden="true"><div class="sv-bar"><i></i><i></i><i></i><span>'+esc(s.demoLabel)+'</span></div>'
          + '<div class="sv-input"><span class="chev">&gt;</span> '+esc(s.demoPrompt)+'<span class="caret2"></span></div>'
          + '<div class="sv-ex">'+(s.demoExamples||[]).map(function(x){ return "<span>"+esc(x)+"</span>"; }).join("")+'</div></div>';
      } else if(i===1){
        right = '<div class="sv" aria-hidden="true"><div class="sv-bar"><i></i><i></i><i></i><span>'+esc(s.demoLabel)+'</span></div>'
          + (s.demoRows||[]).map(function(r){ return '<div class="sv-row"><b>'+esc(r.k)+'</b><span>'+esc(r.v)+'</span></div>'; }).join('') + '</div>';
      } else {
        right = '<div class="sv" aria-hidden="true"><div class="sv-label">'+esc(s.demoLabel)+'</div>'
          + '<div class="sv-agents">'+(s.demoAgents||[]).map(function(a){ return "<span>"+esc(a)+"</span>"; }).join("")+'</div>'
          + '<ul class="sv-check">'+(s.demoChecks||[]).map(function(c){ return "<li>"+esc(c)+"</li>"; }).join("")+'</ul>'
          + '<div class="sv-stamp">scheduled · on time</div></div>';
      }
      return '<article class="step'+(i===0?" on":"")+'"><div class="step-grid">'
        + '<div class="step-l"><div class="n">'+esc(s.n)+'</div><div class="step-big" aria-hidden="true">'+esc(String(i+1).padStart(2,"0"))+'</div>'
        + '<h3>'+esc(s.title)+'</h3><p>'+esc(s.text)+'</p><div class="step-meta">'+esc(s.meta)+'</div></div>'
        + '<div class="step-r">'+right+'</div></div></article>';
    }).join("");
  })();

  /* ---------- dissect ---------- */
  set("dissectEyebrow", esc(C.dissect.eyebrow));
  var dsh=$("dissectHeadline"); if(dsh){ dsh.innerHTML = esc(C.dissect.headline)+'<span class="grad">'+esc(C.dissect.headlineAccent)+'</span>'; }
  set("dissectDescription", esc(C.dissect.description));
  set("dissectFileLabel", C.dissect.fileLabel.replace(/\/(.*)$/, function(m,rest){ return "/ <b>"+esc(rest)+"</b>"; }));
  set("dissectRows", C.dissect.rows.map(function(r){
    return '<span class="drow"><span class="dhl"></span><code>'+esc(r.text)+'</code><span class="dtag">'+esc(r.tag)+'</span></span>';
  }).join(""));

  /* ---------- services ---------- */
  var ICONS = {
    wrench: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3-3z"/></svg>',
    install: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 21h8"/></svg>',
    check: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 6L9 17l-5-5"/></svg>'
  };
  set("servicesEyebrow", esc(C.services.eyebrow));
  var sh=$("servicesHeadline"); if(sh){ sh.innerHTML = esc(C.services.headline)+'<span class="grad">'+esc(C.services.headlineAccent)+'</span>'+esc(C.services.headlineEnd); }
  set("servicesDescription", esc(C.services.description));
  set("servicesGrid", C.services.cards.map(function(c){
    return '<article class="tcard reveal" data-tilt data-cursor="'+esc(c.title)+'"><div class="ic" aria-hidden="true">'+(ICONS[c.icon]||ICONS.check)+'</div>'
      + '<h3>'+esc(c.title)+'</h3><p>'+esc(c.description)+'</p>'
      + '<div class="chips">'+c.chips.map(function(x){ return '<span class="chip">'+esc(x)+'</span>'; }).join("")+'</div></article>';
  }).join(""));
  set("tagCloudHeadline", esc(C.services.tagCloudHeadline));
  set("tagCloudSub", esc(C.services.tagCloudSub));
  (function(){
    var host=$("phys"); if(!host) return;
    var classes=["c","i","m",""];
    host.innerHTML = C.services.tagCloud.map(function(x,i){ return '<span class="pchip '+classes[i%4]+'">'+esc(x)+'</span>'; }).join("");
  })();

  /* ---------- showcase ---------- */
  (function(){
    var track=$("showcaseTrack"); if(!track) return;
    var intro='<div class="hintro"><p class="eyebrow">'+esc(C.showcase.eyebrow)+'</p><h2 data-split>'+esc(C.showcase.headline)+'<span class="grad">'+esc(C.showcase.headlineAccent)+'</span>'+esc(C.showcase.headlineEnd)+'</h2><p>'+esc(C.showcase.description)+'</p></div>';
    var cards=C.showcase.items.map(function(it){
      return '<article class="scard" data-cursor="view"><div class="sh"><div class="stag">'+esc(it.tag)+'</div><h3>'+esc(it.title)+'</h3><p class="sln">'+esc(it.summary)+'</p></div>'
        + '<div class="sprev" aria-hidden="true"><span class="c"># job</span>\n'+esc(it.stack)+'\n'+esc(it.detail)+'\n<span class="o">✓</span> '+esc(it.result)+'</div><span class="sg"></span></article>';
    }).join("");
    track.innerHTML = intro + cards;
  })();

  /* ---------- value prop ---------- */
  set("valueEyebrow", esc(C.valueProp.eyebrow));
  var vh=$("valueHeadline"); if(vh){ vh.innerHTML = esc(C.valueProp.headline)+'<span class="grad">'+esc(C.valueProp.headlineAccent)+'</span>'+esc(C.valueProp.headlineEnd); }
  set("valueBody", C.valueProp.body);

  /* ---------- testimonials ---------- */
  set("testimonialsEyebrow", esc(C.testimonials.eyebrow));
  var tsh=$("testimonialsHeadline"); if(tsh){ tsh.innerHTML = esc(C.testimonials.headline)+'<span class="grad">'+esc(C.testimonials.headlineAccent)+'</span>'; }
  set("testimonialsGrid", C.testimonials.items.map(function(t){
    return '<article class="tscard reveal"><p class="tsquote">'+esc(t.quote)+'</p><div class="tsname">'+esc(t.name)+'</div><div class="tsdetail">'+esc(t.detail)+'</div></article>';
  }).join(""));

  /* ---------- faq ---------- */
  set("faqEyebrow", esc(C.faq.eyebrow));
  var fh=$("faqHeadline"); if(fh){ fh.innerHTML = esc(C.faq.headline)+'<span class="grad">'+esc(C.faq.headlineAccent)+'</span>'; }
  set("faqList", C.faq.items.map(function(f){
    return '<details class="faqitem reveal"><summary>'+esc(f.q)+'</summary><div class="faqbody">'+esc(f.a)+'</div></details>';
  }).join(""));

  /* ---------- pricing ---------- */
  set("pricingEyebrow", esc(C.pricing.eyebrow));
  var prh=$("pricingHeadline"); if(prh){ prh.innerHTML = esc(C.pricing.headline)+'<span class="grad">'+esc(C.pricing.headlineAccent)+'</span>'+esc(C.pricing.headlineEnd); }
  set("pricingDescription", C.pricing.description);
  set("pricingGrid", C.pricing.tiers.map(function(t){
    var btnClass = t.featured ? "btn-primary" : "btn-ghost";
    return '<article class="pcard'+(t.featured?" feat":"")+' reveal">'
      + (t.badge ? '<span class="pbadge">'+esc(t.badge)+'</span>' : "")
      + '<div class="ptier">'+esc(t.tier)+'</div><div class="pprice">'+esc(t.price)+'<small>'+esc(t.priceSuffix)+'</small></div>'
      + '<p class="psub">'+esc(t.subtitle)+'</p>'
      + '<ul class="pf">'+t.features.map(function(f){ return "<li>"+esc(f)+"</li>"; }).join("")+'</ul>'
      + '<a class="btn '+btnClass+'" href="'+esc(t.ctaHref)+'" data-magnetic data-cursor="start"><span>'+esc(t.ctaLabel)+'</span></a></article>';
  }).join(""));

  /* ---------- cta ---------- */
  set("ctaHeadline", esc(C.cta.headline));
  set("ctaBody", esc(C.cta.body));
  var cp=$("ctaPrimary"); if(cp){ cp.href=C.cta.primaryCtaHref; cp.innerHTML="<span>"+esc(C.cta.primaryCta)+"</span>"; }
  var cs=$("ctaSecondary"); if(cs){ cs.href=C.cta.secondaryCtaHref; cs.innerHTML="<span>"+esc(C.cta.secondaryCta)+"</span>"; }

  /* ---------- footer ---------- */
  set("footerLinks", C.footer.links.map(function(l){ return '<a href="'+esc(l.href)+'">'+esc(l.label)+'</a>'; }).join(""));
  set("footerCopyright", esc(C.footer.copyright));

  /* ---------- section dots (nav) ---------- */
  (function(){
    var dots=$("sectionDots"); if(!dots) return;
    var order=[
      ["hero","Intro"], ["generate","See it in action"], ["pipeline","How it works"], ["dissect","The estimate, dissected"],
      ["services","Services"], ["showcase","Showcase"], ["value","Why it pays off"], ["testimonials","Testimonials"],
      ["faq","FAQ"], ["pricing","Pricing"], ["cta","Get started"]
    ];
    dots.innerHTML = order.map(function(o){ return '<button data-dot="'+o[0]+'" aria-label="'+esc(o[1])+'"></button>'; }).join("");
  })();

  /* ---------- signed-in nav swap (Login -> My Account / Admin) ----------
     Async and best-effort: never blocks the initial render, just patches
     the "Login" link once we know whether a session cookie is present. */
  (function(){
    fetch("/api/auth/me").then(function(r){ return r.ok ? r.json() : null; }).then(function(data){
      if(!data) return;
      var dest = data.user.role === "admin" ? "/admin" : "/account";
      var label = data.user.role === "admin" ? "Admin" : "My Account";
      document.querySelectorAll('a[href="/login"]').forEach(function(a){ a.textContent = label; a.href = dest; });
    }).catch(function(){});
  })();
})();
