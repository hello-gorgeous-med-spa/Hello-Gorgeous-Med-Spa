"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Paths where we must not load GTM/GA4 or fire conversion events */
function isNoTrackPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/login")
  );
}

/**
 * Pushes a conversion event to dataLayer (for GTM) and gtag (for GA4).
 * Events: phone_click, email_click, sms_click, book_now_click, form_submit
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: eventName,
    ...params,
  });
  if ((window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
}

/** Delegated click tracking for phone, email, book, and form submit. Only active when not on no-track paths. */
function useTrackConversions(disabled: boolean) {
  useEffect(() => {
    if (disabled) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href]");
      if (!anchor) return;
      const href = (anchor as HTMLAnchorElement).getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        trackEvent("phone_click", { link_url: href });
      } else if (href.startsWith("mailto:")) {
        trackEvent("email_click", { link_url: href });
      } else if (href.startsWith("sms:") || href.includes("sms") || target.closest("[data-sms-click]")) {
        trackEvent("sms_click", { link_url: href });
      } else if (href.includes("book") || anchor.closest("[data-book-now]")) {
        trackEvent("book_now_click", { link_url: href });
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [disabled]);
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const noTrack = isNoTrackPath(pathname ?? null);
  useTrackConversions(noTrack);

  if (noTrack || (!GTM_ID && !GA4_MEASUREMENT_ID && !META_PIXEL_ID)) return null;

  return (
    <>
      {/* Meta Pixel */}
      {META_PIXEL_ID && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
              `.trim(),
            }}
          />
          <noscript>
            <img 
              height="1" 
              width="1" 
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
      {GTM_ID && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
              `.trim(),
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}
      {GA4_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_MEASUREMENT_ID}');
              `.trim(),
            }}
          />
        </>
      )}
    </>
  );
}
