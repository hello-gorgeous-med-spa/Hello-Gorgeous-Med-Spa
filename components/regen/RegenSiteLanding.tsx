"use client";

import Link from "next/link";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────
   RE GEN RX — Direct transfer from Claude prototype
   All CSS and HTML structure matches the original exactly.
───────────────────────────────────────────────────────────── */

export function RegenSiteLanding() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <>
      {/* Embedded CSS from prototype */}
      <style jsx global>{`
        :root {
          --hg-pink: #FF2D8E;
          --hg-pink-deep: #E6007E;
          --hg-pink-soft: #FFF5F9;
          --hg-pink-mid: #FCE7F3;
          --hg-pink-light: #FFB8DC;
          --hg-gold-soft: #FFD86B;
          --hg-success: #16a34a;
          --border-hairline: rgba(0, 0, 0, 0.1);
          --font-display: Georgia, 'Times New Roman', serif;
          --font-body: system-ui, -apple-system, sans-serif;
          --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .rgx { font-family: var(--font-body); color:#000; }
        .rgx a { text-decoration:none; color:inherit; }
        .rgx-util { background:#000; color:#fff; border-bottom:1px solid rgba(255,255,255,.1); }
        .rgx-util-in { max-width:1280px; margin:0 auto; display:flex; align-items:center; justify-content:center; gap:20px; padding:9px 24px; font-size:11.5px; letter-spacing:.12em; text-transform:uppercase; font-weight:600; color:rgba(255,255,255,.82); flex-wrap:wrap; }
        .rgx-util .u { display:inline-flex; align-items:center; gap:8px; }
        .rgx-nav { position:sticky; top:0; z-index:40; background:#000; color:#fff; }
        .rgx-nav-in { max-width:1280px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; padding:12px 24px; gap:24px; }
        .rgx-logo { height:46px; width:auto; display:block; }
        .rgx-links { display:flex; gap:8px; align-items:center; }
        .rgx-links a { background:none; border:none; color:#fff; font-size:15px; font-weight:500; cursor:pointer; padding:6px 12px; letter-spacing:.01em; opacity:.92; transition:color .2s,opacity .2s; display:inline-flex; align-items:center; }
        .rgx-links a:not(:first-child)::before { content:""; width:5px; height:5px; border-radius:50%; background:var(--hg-pink); opacity:.85; display:inline-block; margin-right:20px; }
        .rgx-links a:hover { color:var(--hg-pink); opacity:1; }
        .rgx-icons { display:flex; gap:16px; align-items:center; }
        .rgx-login { display:inline-flex; align-items:center; gap:7px; border:1px solid rgba(255,255,255,.4); color:#fff; background:none; border-radius:24px; padding:9px 18px; font-size:14px; font-weight:600; cursor:pointer; transition:all .2s; white-space:nowrap; }
        .rgx-login:hover { border-color:var(--hg-pink); color:var(--hg-pink); }
        .rgx-burger { display:none; background:none; border:none; color:#fff; cursor:pointer; padding:4px; }
        .rgx-hero { position:relative; background:#0c0b0c; color:#fff; overflow:hidden; min-height:600px; display:flex; align-items:center; }
        .rgx-hero-img { position:absolute; inset:0 0 0 40%; background:#0c0b0c right center / cover no-repeat; animation: rgx-kenburns 24s ease-in-out infinite alternate; transform-origin:center; }
        .rgx-hero-img::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,#0c0b0c 2%,rgba(12,11,12,.55) 26%,rgba(12,11,12,0) 58%); }
        .rgx-hero-in { position:relative; z-index:2; max-width:1280px; margin:0 auto; padding:90px 24px; width:100%; }
        .rgx-hero h1 { color:#fff; font-family:var(--font-display); font-size:clamp(2.6rem,5.4vw,4.6rem); line-height:1.0; max-width:13ch; margin:0; font-weight:700; animation: rgx-fadeup .9s var(--ease-out) both; }
        .rgx-hero h1 .dot { color:var(--hg-pink); display:inline-block; transform-origin:center; animation: rgx-dotpulse 2.6s ease-in-out infinite; }
        .rgx-hero .rule { width:120px; height:3px; background:var(--hg-pink); margin:26px 0 30px; animation: rgx-fadeup .9s .12s var(--ease-out) both; }
        @keyframes rgx-kenburns { from { transform:scale(1) translateX(0); } to { transform:scale(1.13) translateX(-2%); } }
        @keyframes rgx-fadeup { from { opacity:0; transform:translateY(26px); } to { opacity:1; transform:translateY(0); } }
        @keyframes rgx-dotpulse { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.7); opacity:.55; } }
        .rgx-floatcard { background:#fff; color:#000; border-radius:18px; box-shadow:0 24px 60px rgba(0,0,0,.4); padding:18px; max-width:440px; display:flex; gap:16px; align-items:center; margin-top:34px; animation: rgx-fadeup 1s .42s var(--ease-out) both; }
        .rgx-floatcard .thumb { width:96px; height:96px; border-radius:12px; flex:none; overflow:hidden; background:#fff; padding:6px; }
        .rgx-floatcard .thumb img { width:100%; height:100%; object-fit:contain; }
        .rgx-pop { display:inline-flex; align-items:center; gap:5px; background:var(--hg-gold-soft); color:#7a5b00; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; padding:4px 9px; border-radius:20px; }
        .rgx-trust { background:#000; color:#fff; }
        .rgx-trust-in { max-width:1280px; margin:0 auto; padding:30px 24px; display:flex; flex-wrap:wrap; gap:18px 48px; align-items:center; justify-content:center; }
        .rgx-trust .item { display:flex; align-items:center; gap:10px; font-size:15px; }
        .rgx-trust .n { font-family:var(--font-display); font-weight:700; color:var(--hg-pink); font-size:22px; }
        .section-white { background:#fff; }
        .section-black { background:#000; color:#fff; }
        .section-pink { background:linear-gradient(135deg, var(--hg-pink) 0%, var(--hg-pink-deep) 100%); color:#fff; }
        .section-padding { padding:70px 24px; }
        .hg-eyebrow { font-size:11px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:rgba(0,0,0,.5); margin:0; }
        .section-black .hg-eyebrow { color:rgba(255,255,255,.5); }
        .accent { color:var(--hg-pink); }
        .rgx-catgrid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; max-width:1280px; margin:0 auto; }
        .rgx-tile { display:flex; align-items:center; gap:18px; padding:22px 24px; border-radius:16px; text-align:left; transition:transform .2s, box-shadow .2s; min-height:118px; text-decoration:none; color:#000; }
        .rgx-tile:hover { transform:translateY(-3px); box-shadow:0 16px 36px rgba(0,0,0,.10); }
        .rgx-tile .ico { width:62px; height:62px; border-radius:13px; flex:none; background:rgba(255,255,255,.7); display:flex; align-items:center; justify-content:center; font-size:26px; }
        .rgx-tile .ttl { font-family:var(--font-display); font-weight:700; font-size:20px; line-height:1.15; margin:0 0 3px; }
        .rgx-tile .tag { font-size:13px; color:rgba(0,0,0,.6); margin:0; }
        .rgx-tile .arrow { margin-left:auto; width:38px; height:38px; border-radius:50%; background:#000; color:#fff; display:flex; align-items:center; justify-content:center; flex:none; transition:background .2s; }
        .rgx-tile:hover .arrow { background:var(--hg-pink); }
        .rgx-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:34px; max-width:1100px; margin:0 auto; }
        .rgx-step .num { width:46px; height:46px; border-radius:50%; background:var(--hg-pink); color:#fff; font-family:var(--font-display); font-weight:700; font-size:20px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
        .rgx-faq { max-width:820px; margin:0 auto; }
        .rgx-faq-item { border-bottom:1px solid var(--border-hairline); }
        .rgx-faq-q { cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:16px; padding:22px 4px; font-family:var(--font-display); font-size:19px; font-weight:600; background:none; border:none; width:100%; text-align:left; }
        .rgx-faq-q::after { content:"+"; color:var(--hg-pink); font-size:26px; font-weight:400; transition:transform .3s; }
        .rgx-faq-q.open::after { transform:rotate(45deg); }
        .rgx-faq .ans { padding:0 4px 22px; font-size:16px; line-height:1.7; color:rgba(0,0,0,.72); margin:0; max-width:70ch; }
        .rgx-foot { background:#000; color:#fff; }
        .rgx-foot-in { max-width:1280px; margin:0 auto; padding:64px 24px 36px; }
        .rgx-foot-cols { display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:40px; }
        .rgx-foot h4 { font-size:13px; text-transform:uppercase; letter-spacing:.08em; opacity:.6; margin:0 0 16px; }
        .rgx-foot ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:11px; }
        .rgx-foot a { color:rgba(255,255,255,.85); font-size:15px; }
        .rgx-foot a:hover { color:var(--hg-pink); }
        .rgx-disc { margin-top:40px; padding-top:24px; border-top:1px solid rgba(255,255,255,.12); font-size:12px; line-height:1.7; color:rgba(255,255,255,.5); max-width:1000px; }
        .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:14px 28px; border-radius:30px; font-weight:600; font-size:15px; cursor:pointer; transition:transform .25s var(--ease-out), box-shadow .25s var(--ease-out); border:none; text-decoration:none; }
        .btn:hover { transform:translateY(-2px); }
        .btn-primary { background:var(--hg-pink); color:#fff; }
        .btn-primary:hover { background:var(--hg-pink-deep); box-shadow:0 8px 24px rgba(255,45,142,.35); }
        .btn-white { background:#fff; color:var(--hg-pink); }
        .btn-white:hover { box-shadow:0 8px 24px rgba(0,0,0,.2); }
        .btn-secondary { background:transparent; color:#fff; border:2px solid rgba(255,255,255,.4); }
        .btn-secondary:hover { border-color:#fff; }
        .btn-outline { background:#fff; color:#000; border:2px solid rgba(0,0,0,.2); }
        .btn-outline:hover { border-color:#000; }
        .btn-cta { padding:16px 32px; font-size:16px; }
        .rgx-btn-dark { flex:1; background:#000; color:#fff; border:none; border-radius:24px; padding:11px 8px; font-weight:600; font-size:14px; cursor:pointer; transition:background .2s; text-align:center; text-decoration:none; display:block; }
        .rgx-btn-dark:hover { background:var(--hg-pink); }
        .rgx-btn-ghost { flex:1; background:#fff; color:#000; border:1px solid rgba(0,0,0,.25); border-radius:24px; padding:11px 8px; font-weight:600; font-size:14px; cursor:pointer; transition:all .2s; text-align:center; text-decoration:none; display:block; }
        .rgx-btn-ghost:hover { border-color:#000; }
        @media (max-width:980px){
          .rgx-catgrid { grid-template-columns:1fr 1fr; }
          .rgx-steps { grid-template-columns:1fr; gap:24px; }
          .rgx-foot-cols { grid-template-columns:1fr 1fr; gap:32px; }
          .rgx-hero-img { inset:0 0 0 34%; }
        }
        @media (max-width:680px){
          .rgx-links { display:none; }
          .rgx-login span { display:none; }
          .rgx-burger { display:inline-flex; }
          .rgx-catgrid { grid-template-columns:1fr; }
          .rgx-hero-img { display:none; }
          .rgx-hero { background:linear-gradient(160deg,#1a1216,#3a2730); }
          .rgx-foot-cols { grid-template-columns:1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rgx-hero-img, .rgx-hero h1, .rgx-hero .rule, .rgx-floatcard, .rgx-hero h1 .dot { animation:none !important; }
        }
      `}</style>

      <div className="rgx">
        {/* ============ UTILITY BAR ============ */}
        <div className="rgx-util">
          <div className="rgx-util-in">
            <span className="u">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
              US-based licensed pharmacies
            </span>
            <span className="u">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Transparent pricing, no hidden fees
            </span>
            <span className="u">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
              Board-certified providers
            </span>
          </div>
        </div>

        {/* ============ NAV ============ */}
        <nav className="rgx-nav">
          <div className="rgx-nav-in">
            <Link href="/rx">
              <img className="rgx-logo" src="/images/regen/regen-logo-white.png" alt="RE GEN by Hello Gorgeous Med Spa" />
            </Link>
            <div className="rgx-links">
              <Link href="/rx/weight-loss">Weight Loss</Link>
              <Link href="/rx/wellness">Daily Wellness</Link>
              <Link href="/rx/sexual-health">Sexual Health</Link>
              <Link href="/rx/hormones">Hormones</Link>
              <Link href="/labs">Labs</Link>
            </div>
            <div className="rgx-icons">
              <Link href="/rx/start" className="rgx-login">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Login</span>
              </Link>
              <button className="rgx-burger" aria-label="Menu">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
            </div>
          </div>
        </nav>

        {/* ============ HERO ============ */}
        <section className="rgx-hero">
          <div className="rgx-hero-img" style={{backgroundImage: 'url(/images/regen/hero-photo.jpg)'}}></div>
          <div className="rgx-hero-in">
            <h1>We're simplifying your path to wellness<span className="dot">.</span></h1>
            <div className="rule"></div>
            <Link href="#treatments" className="btn btn-primary btn-cta">Find your treatment</Link>
            <div className="rgx-floatcard">
              <div className="thumb">
                <img src="/images/regen/prod-tirzepatide.jpg" alt="Compounded Tirzepatide" />
              </div>
              <div style={{flex:1}}>
                <span className="rgx-pop">★ Most Popular</span>
                <p style={{fontFamily:'var(--font-body)',fontSize:'11px',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'rgba(0,0,0,.5)',margin:'9px 0 2px'}}>Weight Loss</p>
                <p style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'20px',margin:'0 0 12px',lineHeight:1.1}}>Compounded Tirzepatide <span style={{fontSize:'12px',fontStyle:'italic',color:'rgba(0,0,0,.4)'}}>Rx</span></p>
                <div style={{display:'flex',gap:'8px'}}>
                  <Link href="/rx/weight-loss" className="rgx-btn-ghost">Learn more</Link>
                  <Link href="/rx/start" className="rgx-btn-dark">Get started</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ TRUST BAR ============ */}
        <section className="rgx-trust">
          <div className="rgx-trust-in">
            <div className="item"><span className="n">4.4★</span> 117 Google reviews</div>
            <div className="item"><span className="n">5.0★</span> 1,931 Fresha reviews</div>
            <div className="item"><span className="n">#1</span> Best Med Spa in Oswego</div>
            <div className="item"><span className="n">NP</span> Nurse-practitioner directed</div>
          </div>
        </section>

        {/* ============ SHOP BY GOAL ============ */}
        <section id="treatments" className="section-white section-padding">
          <div style={{maxWidth:'1280px',margin:'0 auto 40px',padding:'0 24px'}}>
            <p className="hg-eyebrow">Shop by goal</p>
            <h2 style={{margin:'12px 0 0',maxWidth:'18ch',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'32px'}}>Prescription treatments for your <span className="accent">health goals</span></h2>
          </div>
          <div className="rgx-catgrid" style={{padding:'0 24px'}}>
            <Link href="/rx/weight-loss" className="rgx-tile" style={{background:'#FFF8F0'}}>
              <span className="ico">⚖️</span>
              <span><span className="ttl">Weight Loss</span><span className="tag">GLP-1 & metabolic</span></span>
              <span className="arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            </Link>
            <Link href="/labs" className="rgx-tile" style={{background:'#F0F8FF'}}>
              <span className="ico">🧪</span>
              <span><span className="ttl">Labs</span><span className="tag">Advanced lab testing</span></span>
              <span className="arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            </Link>
            <Link href="/rx/wellness" className="rgx-tile" style={{background:'#F8FFF0'}}>
              <span className="ico">✦</span>
              <span><span className="ttl">Daily Wellness</span><span className="tag">Longevity, NAD+ & peptides</span></span>
              <span className="arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            </Link>
            <Link href="/rx/vitamins" className="rgx-tile" style={{background:'#FFF0F8'}}>
              <span className="ico">💉</span>
              <span><span className="ttl">Vitamin Injections</span><span className="tag">At-home wellness shots</span></span>
              <span className="arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            </Link>
            <Link href="/rx/sexual-health" className="rgx-tile" style={{background:'#FFF0F0'}}>
              <span className="ico">❤️</span>
              <span><span className="ttl">Sexual Health</span><span className="tag">ED, libido & intimacy</span></span>
              <span className="arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            </Link>
            <Link href="/rx/hormones" className="rgx-tile" style={{background:'#F0FFF8'}}>
              <span className="ico">⚕️</span>
              <span><span className="ttl">Hormones</span><span className="tag">TRT, HCG & bioidentical HRT</span></span>
              <span className="arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            </Link>
            <Link href="/rx/hair-skin" className="rgx-tile" style={{background:'#FFF8FF'}}>
              <span className="ico">✨</span>
              <span><span className="ttl">Hair + Skin</span><span className="tag">Regrowth & Rx dermatology</span></span>
              <span className="arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            </Link>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className="section-white" style={{padding:'20px 24px 90px'}}>
          <div style={{textAlign:'center',maxWidth:'720px',margin:'0 auto 48px'}}>
            <p className="hg-eyebrow">How it works</p>
            <h2 style={{margin:'12px 0 0',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'32px'}}>Care that's <span className="accent">100% online</span></h2>
          </div>
          <div className="rgx-steps">
            <div className="rgx-step"><div className="num">1</div><h3 style={{margin:'0 0 8px',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'20px'}}>Complete a free consult</h3><p style={{color:'rgba(0,0,0,.7)',margin:0,fontSize:'15px',lineHeight:1.6}}>Share your history and goals in minutes. We screen you like a medical practice — because we are one.</p></div>
            <div className="rgx-step"><div className="num">2</div><h3 style={{margin:'0 0 8px',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'20px'}}>A provider reviews</h3><p style={{color:'rgba(0,0,0,.7)',margin:0,fontSize:'15px',lineHeight:1.6}}>Our nurse-practitioner-directed team reviews your intake and, if appropriate, prescribes a personalized plan.</p></div>
            <div className="rgx-step"><div className="num">3</div><h3 style={{margin:'0 0 8px',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'20px'}}>Delivered to your door</h3><p style={{color:'rgba(0,0,0,.7)',margin:0,fontSize:'15px',lineHeight:1.6}}>Your compounded medication ships discreetly from a licensed pharmacy. Flat $30 shipping on every order.</p></div>
          </div>
        </section>

        {/* ============ WHY RE GEN ============ */}
        <section className="section-black section-padding">
          <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'56px',alignItems:'center'}}>
            <div>
              <p className="hg-eyebrow">Why RE GEN</p>
              <h2 style={{color:'#fff',margin:'12px 0 18px',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'32px'}}>Real providers. <span style={{color:'var(--hg-pink)'}}>Real medicine.</span></h2>
              <p style={{color:'rgba(255,255,255,.8)',fontSize:'18px',margin:'0 0 24px',lineHeight:1.6}}>RE GEN is the medical-prescription arm of Hello Gorgeous Med Spa — the #1 best med spa in Oswego. Founders Dani & Ryan, a female + male provider team, are on site weekly. Every plan is directed by a full-authority nurse practitioner.</p>
              <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                <div style={{display:'flex',gap:'12px'}}><span style={{color:'var(--hg-pink)'}}>✦</span><span><b>NP-directed care</b><br/><span style={{color:'rgba(255,255,255,.65)',fontSize:'15px'}}>Licensed clinicians review every order</span></span></div>
                <div style={{display:'flex',gap:'12px'}}><span style={{color:'var(--hg-pink)'}}>✦</span><span><b>US-based compounding pharmacies</b><br/><span style={{color:'rgba(255,255,255,.65)',fontSize:'15px'}}>503A/503B partners, shipped nationwide</span></span></div>
                <div style={{display:'flex',gap:'12px'}}><span style={{color:'var(--hg-pink)'}}>✦</span><span><b>Transparent pricing</b><br/><span style={{color:'rgba(255,255,255,.65)',fontSize:'15px'}}>No hidden fees — flat $30 shipping</span></span></div>
              </div>
              <Link href="tel:6306366193" className="btn btn-primary btn-cta" style={{marginTop:'28px'}}>Call (630) 636-6193</Link>
            </div>
            <div style={{borderRadius:'18px',overflow:'hidden',background:'#0c0b0c'}}>
              <img src="/images/regen/banner-wellness.jpg" alt="RE GEN — done surviving, ready to thrive" style={{width:'100%',display:'block'}} />
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="section-white section-padding">
          <div style={{textAlign:'center',marginBottom:'36px'}}><p className="hg-eyebrow">Common questions</p><h2 style={{margin:'12px 0 0',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'32px'}}>Good to <span className="accent">know</span></h2></div>
          <div className="rgx-faq">
            {[
              {q:"Is this legitimate medical care?", a:"Yes. RE GEN is the prescription arm of Hello Gorgeous Med Spa, a nurse-practitioner-directed medical practice. A licensed provider reviews your intake before anything is prescribed."},
              {q:"What does shipping cost?", a:"A flat $30 ships your order discreetly to your door, anywhere we serve. Pricing for each medication is shown on its treatment page."},
              {q:"Are compounded medications FDA-approved?", a:"Compounded medications are prepared by a licensed pharmacy for an individual patient and are not FDA-approved products. Your provider will review whether a compounded option is appropriate for you."},
              {q:"Do I need to come in to the clinic?", a:"Most treatments can be started 100% online. Some therapies may require labs or an in-person visit in Oswego, IL — your provider will let you know."},
            ].map((item, i) => (
              <div key={i} className="rgx-faq-item">
                <button className={`rgx-faq-q ${faqOpen === i ? 'open' : ''}`} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>{item.q}</button>
                {faqOpen === i && <p className="ans">{item.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="section-pink" style={{padding:'80px 24px',textAlign:'center'}}>
          <div style={{maxWidth:'720px',margin:'0 auto'}}>
            <h2 style={{color:'#fff',margin:0,fontFamily:'var(--font-display)',fontWeight:700,fontSize:'32px'}}>Ready to start feeling gorgeous?</h2>
            <p style={{color:'rgba(255,255,255,.92)',fontSize:'18px',margin:'14px 0 28px'}}>Take the free intake — a provider will review and reach out, often same day.</p>
            <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link href="/rx/start" className="btn btn-white btn-cta">Get started</Link>
              <Link href="tel:6306366193" className="btn btn-secondary">Call (630) 636-6193</Link>
            </div>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="rgx-foot">
          <div className="rgx-foot-in">
            <div className="rgx-foot-cols">
              <div>
                <img src="/images/regen/regen-logo-white.png" alt="RE GEN" style={{height:'40px',marginBottom:'16px'}} />
                <p style={{fontSize:'15px',color:'rgba(255,255,255,.7)',lineHeight:1.6}}>74 W. Washington Street<br/>Oswego, IL 60543<br/>(630) 636-6193</p>
              </div>
              <div>
                <h4>Treatments</h4>
                <ul>
                  <li><Link href="/rx/weight-loss">Weight Loss</Link></li>
                  <li><Link href="/labs">Labs</Link></li>
                  <li><Link href="/rx/wellness">Daily Wellness</Link></li>
                  <li><Link href="/rx/vitamins">Vitamin Injections</Link></li>
                  <li><Link href="/rx/sexual-health">Sexual Health</Link></li>
                  <li><Link href="/rx/hormones">Hormones</Link></li>
                  <li><Link href="/rx/hair-skin">Hair + Skin</Link></li>
                </ul>
              </div>
              <div>
                <h4>Company</h4>
                <ul>
                  <li><Link href="/rx">RX Home</Link></li>
                  <li><Link href="/rx/start">Get started</Link></li>
                  <li><Link href="/">Hello Gorgeous Med Spa</Link></li>
                </ul>
              </div>
              <div>
                <h4>Get started</h4>
                <ul>
                  <li><Link href="/rx/start">Free intake</Link></li>
                  <li><Link href="tel:6306366193">Call us</Link></li>
                  <li><Link href="/book">Book on Fresha</Link></li>
                </ul>
              </div>
            </div>
            <p className="rgx-disc">RE GEN by Hello Gorgeous Med Spa. Information on this site is for general educational purposes and is not medical advice. Prescription products require evaluation by a licensed provider, who determines whether treatment is appropriate. Some products are compounded by a licensed pharmacy and are not FDA-approved. Individual results vary. Patient information is treated as protected health information. © 2026 Hello Gorgeous Med Spa.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
