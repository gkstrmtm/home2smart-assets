/* Deferred JavaScript - Non-critical scripts loaded after idle */

/* Loader build (lazy) */
(function(){
  const SRC="https://storage.googleapis.com/msgsndr/7Drmpw623JAkrfDKPdjG/media/68e164b2554f6a7ab7e50837.svg";
  const overlay=document.getElementById('h2sLoader');
  const tray=document.getElementById('h2sSlices');
  let built=false;
  function build(){
    if(built) return; built=true;
    const COUNT=8; tray.innerHTML="";
    for(let i=0;i<COUNT;i++){
      const w=100/COUNT, s=document.createElement('div'); s.className='h2s-slice';
      s.style.left=(i*w)+'%'; s.style.width=w+'%'; s.style.setProperty('--i',i);
      const img=document.createElement('img'); img.alt='Home2Smart'; img.src=SRC; img.style.width=(COUNT*100)+'%'; img.style.left=(-i*100)+'%';
      s.appendChild(img); tray.appendChild(s);
    }
  }
  window.showLoader=()=>{ build(); overlay.style.display='grid'; overlay.classList.remove('out') };
  window.hideLoader=()=>{ overlay.classList.add('out'); overlay.addEventListener('transitionend',()=>{overlay.style.display='none';overlay.classList.remove('out')},{once:true}) };
})();

document.documentElement.style.scrollBehavior='smooth';

/* Intersection Observer for reveal animations */
if (!('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal-up,.reveal-right,.reveal-scale,.reveal-card').forEach(el => {
    el.classList.add('in');
  });
} else {
  document.addEventListener('DOMContentLoaded', function(){
    const idle = window.requestIdleCallback || function(cb){ return setTimeout(cb,300) };
    idle(function(){
      const targets=[...document.querySelectorAll('.reveal-up,.reveal-right,.reveal-scale,.reveal-card')];
      const groups=[document.querySelector('.hero-grid'),document.querySelector('.blurbs'),document.querySelector('.contact-wrap')].filter(Boolean);
      groups.forEach(g=>{
        const kids=[...g.querySelectorAll('.reveal-up,.reveal-right,.reveal-scale,.reveal-card')];
        kids.forEach((k,i)=>k.setAttribute('data-delay',String(i*90)));
      });
      const io=new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            const el=entry.target;
            const delay=Number(el.getAttribute('data-delay')||0);
            setTimeout(()=>el.classList.add('in'),delay);
            io.unobserve(el);
          }
        });
      },{threshold:.14});
      targets.forEach(el=>io.observe(el));
    });
  });
}

/* Button press effect */
(function(){
  const btns=[...document.querySelectorAll('.btn')];
  const css=document.createElement('style');
  css.textContent=`.btn.is-pressed{transform:translateY(-2px)!important;box-shadow:var(--elev-1)!important}`;
  document.head.appendChild(css);
  btns.forEach(b=>{
    b.addEventListener('mousedown',()=>b.classList.add('is-pressed'));
    b.addEventListener('mouseup',()=>b.classList.remove('is-pressed'));
    b.addEventListener('mouseleave',()=>b.classList.remove('is-pressed'));
    b.addEventListener('touchstart',()=>b.classList.add('is-pressed'),{passive:true});
    b.addEventListener('touchend',()=>b.classList.remove('is-pressed'));
  });
})();

/* Card tilt effect (desktop only) */
(function(){
  const idle = window.requestIdleCallback || function(cb){ return setTimeout(cb,300) };
  idle(function(){
    const cards=[...document.querySelectorAll('.blurb')];
    const clamp=(v,min,max)=>Math.min(Math.max(v,min),max);
    cards.forEach(card=>{
      let raf=0, current={rx:0, ry:0, tz:0};
      const bounds=()=>card.getBoundingClientRect();
      function onMove(e){
        const r=bounds(), cx=r.left+r.width/2, cy=r.top+r.height/2;
        const px=(e.clientX-cx)/(r.width/2), py=(e.clientY-cy)/(r.height/2);
        const max=7; current.ry=clamp(px*max,-max,max); current.rx=clamp(-py*max,-max,max); current.tz=-6;
        if(!raf) raf=requestAnimationFrame(()=>{raf=0; card.style.transform=`perspective(900px) rotateX(${current.rx}deg) rotateY(${current.ry}deg) translateY(${current.tz}px)`});
      }
      function onLeave(){ current.ry=0; current.rx=0; current.tz=0;
        if(!raf) raf=requestAnimationFrame(()=>{raf=0; card.style.transform=`perspective(900px) rotateX(0) rotateY(0) translateY(0)`});
      }
      card.addEventListener('mousemove',onMove);
      card.addEventListener('mouseleave',onLeave);
      card.addEventListener('touchstart',()=>card.style.transform='translateY(-6px)',{passive:true});
      card.addEventListener('touchend',()=>card.style.transform='',{passive:true});
    });
  });
})();

/* Rotating word flipper - FIXED: pagehide instead of beforeunload */
(function(){
  if (window.__flipInit) return; window.__flipInit = true;
  const el = document.getElementById('flipWord');
  if (!el) return;
  const words = ["smart","connected","secure","safe"];
  let i = 0, ticking = false;
  function next(){
    if (ticking) return; ticking = true;
    el.classList.remove('flip-in'); el.classList.add('flip-out');
    const outDone = (ev)=>{
      if (ev.animationName !== 'flipOut') return;
      el.removeEventListener('animationend', outDone);
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove('flip-out'); el.classList.add('flip-in');
      const inDone = (ev2)=>{
        if (ev2.animationName !== 'flipIn') return;
        el.removeEventListener('animationend', inDone);
        ticking = false;
      };
      el.addEventListener('animationend', inDone, { once:true });
    };
    el.addEventListener('animationend', outDone, { once:true });
  }
  requestAnimationFrame(()=> el.classList.add('flip-in'));
  const interval = setInterval(next, 1800);
  window.addEventListener('pagehide', ()=>clearInterval(interval)); // FIXED: changed from beforeunload
})();

/* Hero animation trigger */
document.addEventListener('DOMContentLoaded', () => {
  const base = document.getElementById('houseBase');
  const door = document.getElementById('houseDoor');
  if (!base || !door) return;
  requestAnimationFrame(() => {
    base.classList.add('in');
    door.classList.add('in');
    base.addEventListener('transitionend', () => {
      door.classList.add('loop');
    }, { once:true });
  });
});

/* SEO meta injection */
(function(){
  try{
    const d=document, head=d.head||d.getElementsByTagName('head')[0];
    function add(tag, attrs, text){ const el=d.createElement(tag); if(attrs){ for(const k in attrs){ if(attrs[k]!==undefined && attrs[k]!==null) el.setAttribute(k, attrs[k]) } } if(text){ el.textContent=text } head.appendChild(el); return el }
    function meta(name, content){ return add('meta',{name,content}) }
    function mprop(property, content){ return add('meta',{property,content}) }
    function link(rel, href, extras){ return add('link', Object.assign({rel, href}, extras||{})) }

    add('title', null, 'Home2Smart | TV mounting, smart home installs, security setup in NC and SC');
    meta('description','Professional TV mounting, smart lock and lighting setup, Wi Fi tuning, cameras and home security configuration. Serving North Carolina and South Carolina.');
    meta('robots','index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1');
    meta('googlebot','index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1');
    meta('viewport','width=device-width, initial-scale=1');
    meta('referrer','strict-origin-when-cross-origin');
    meta('content-language','en-us');
    meta('geo.region','US-NC, US-SC');

    const canonicalHref='https://home2smart.com/home';
    link('canonical', canonicalHref);
    link('alternate', canonicalHref, {hreflang:'en'});
    link('alternate', canonicalHref, {hreflang:'x-default'});

    link('preconnect','https://cdn.jsdelivr.net',{crossorigin:''});
    link('dns-prefetch','https://cdn.jsdelivr.net');
    link('dns-prefetch','https://connect.facebook.net');
    link('prefetch','https://home2smart.com/tvmount');
    link('prefetch','https://home2smart.com/smart');
    link('prefetch','https://home2smart.com/security');
    link('prefetch','https://home2smart.com/shop');

    mprop('og:type','website');
    mprop('og:site_name','Home2Smart');
    mprop('og:title','Home2Smart | TV mounting, smart home, security');
    mprop('og:description','TV mounting and smart home installs done right. Cameras, locks, lighting, hubs and Wi Fi tuned for real life.');
    mprop('og:url', canonicalHref);
    mprop('og:image','https://storage.googleapis.com/msgsndr/7Drmpw623JAkrfDKPdjG/media/68e1c02d4430d3e311fef68c.png');
    mprop('og:locale','en_US');

    meta('twitter:card','summary_large_image');
    meta('twitter:title','Home2Smart | TV mounting, smart home, security');
    meta('twitter:description','TV mounting and smart home installs across NC and SC. Cameras, locks, lighting and Wi Fi tuned for your home.');
    meta('twitter:image','https://storage.googleapis.com/msgsndr/7Drmpw623JAkrfDKPdjG/media/68e1c02d4430d3e311fef68c.png');

    link('sitemap','https://home2smart.com/sitemap.xml');

    const graph = [
      {
        "@type":["Organization","HomeAndConstructionBusiness"],
        "@id":"https://home2smart.com/#org",
        "name":"Home2Smart",
        "url":"https://home2smart.com/",
        "logo":{"@type":"ImageObject","url":"https://storage.googleapis.com/msgsndr/7Drmpw623JAkrfDKPdjG/media/68da0ce6f00445991d64a63f.png"},
        "email":"mailto:contact@home2smart.com","telephone":"+1-704-555-0188",
        "areaServed":[{"@type":"AdministrativeArea","name":"North Carolina"},{"@type":"AdministrativeArea","name":"South Carolina"}],
        "contactPoint":[{"@type":"ContactPoint","contactType":"customer service","telephone":"+1-704-555-0188","email":"contact@home2smart.com","areaServed":["US-NC","US-SC"],"availableLanguage":["en"]}],
        "priceRange":"$$"
      },
      {"@type":"WebSite","@id":"https://home2smart.com/#website","url":"https://home2smart.com/","name":"Home2Smart","publisher":{"@id":"https://home2smart.com/#org"},"inLanguage":"en-US"},
      {"@type":"CollectionPage","@id":"https://home2smart.com/home#webpage","url":"https://home2smart.com/home","name":"Home2Smart home","about":{"@id":"https://home2smart.com/#org"},"isPartOf":{"@id":"https://home2smart.com/#website"},"inLanguage":"en-US","primaryImageOfPage":{"@type":"ImageObject","url":"https://storage.googleapis.com/msgsndr/7Drmpw623JAkrfDKPdjG/media/68e1c02d4430d3e311fef68c.png"}},
      {"@type":"BreadcrumbList","@id":"https://home2smart.com/home#breadcrumbs","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://home2smart.com/home"},{"@type":"ListItem","position":2,"name":"Shop","item":"https://home2smart.com/shop"}]},
      {"@type":"SiteNavigationElement","@id":"https://home2smart.com/#nav","name":["TV","Smart","Security","Shop","Contact"],"url":["https://home2smart.com/tvmount","https://home2smart.com/smart","https://home2smart.com/security","https://home2smart.com/shop","#contact"]},
      {"@type":"WebPage","@id":"https://home2smart.com/contact#webpage","url":"https://home2smart.com/home#contact","name":"Contact Home2Smart","isPartOf":{"@id":"https://home2smart.com/#website"},"about":{"@id":"https://home2smart.com/#org"}}
    ];
    add('script',{type:'application/ld+json'}, JSON.stringify({"@context":"https://schema.org","@graph":graph}));
  }catch(err){ console.warn('SEO inject error', err) }
})();
