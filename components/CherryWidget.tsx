"use client";

import Script from "next/script";
import { useEffect } from "react";

const MONTSERRAT_HREF =
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap";

export function CherryWidget() {
  useEffect(() => {
    if (document.querySelector(`link[href="${MONTSERRAT_HREF}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = MONTSERRAT_HREF;
    document.head.appendChild(link);
  }, []);

  const initScript = `
    (function (w, d, s, o, f, js, fjs) {
      w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments); };
      (js = d.createElement(s)), (fjs = d.getElementsByTagName(s)[0]);
      js.id = o;
      js.src = f;
      js.async = 1;
      fjs.parentNode.insertBefore(js, fjs);
    })(window, document, "script", "_hw", "https://files.withcherry.com/widgets/widget.js");
    _hw("init", {
      debug: false,
      variables: {
        slug: 'hellogorgeous',
        name: 'HELLO GORGEOUS PC',
        images: [26],
        customLogo: '',
        defaultPurchaseAmount: 750,
        customImage: '',
        imageCategory: 'medspa',
        language: 'en',
      },
      styles: {
        primaryColor: '#7a6f9b',
        secondaryColor: '#7a6f9b10',
        fontFamily: 'Montserrat',
        headerFontFamily: 'Montserrat',
      }
    }, ['hero','calculator','howitworks','faq']);
  `;

  return (
    <>
      <Script
        id="cherry-widget-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: initScript }}
      />
      <div id="all">
        <div id="hero" />
        <div id="calculator" />
        <div id="howitworks" />
        <div id="testimony" />
        <div id="faq" />
      </div>
    </>
  );
}
