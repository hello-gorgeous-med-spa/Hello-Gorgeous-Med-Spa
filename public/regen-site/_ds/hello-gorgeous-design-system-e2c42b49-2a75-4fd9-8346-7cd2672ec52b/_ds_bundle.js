/* @ds-bundle: {"format":3,"namespace":"HelloGorgeousDesignSystem_e2c42b","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"StarRating","sourcePath":"components/core/StarRating.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Accordion","sourcePath":"components/marketing/Accordion.jsx"},{"name":"PricingCard","sourcePath":"components/marketing/PricingCard.jsx"},{"name":"SectionHeader","sourcePath":"components/marketing/SectionHeader.jsx"},{"name":"ServiceCard","sourcePath":"components/marketing/ServiceCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"da3083cad5f3","components/core/Button.jsx":"b77ff01636c8","components/core/Card.jsx":"de4cb9ccc83b","components/core/StarRating.jsx":"0566179c9302","components/forms/Checkbox.jsx":"019a29e944d7","components/forms/Input.jsx":"ab608cddc37c","components/marketing/Accordion.jsx":"8055a7de7fb3","components/marketing/PricingCard.jsx":"f298c1f0745c","components/marketing/SectionHeader.jsx":"ff440e77bf25","components/marketing/ServiceCard.jsx":"0669a4cfdf30","ui_kits/admin/Sidebar.jsx":"a06b05a289b9","ui_kits/admin/Views.jsx":"34403e489921","ui_kits/client-app/Screens.jsx":"36770a159000","ui_kits/marketing/Chrome.jsx":"485a62c34276","ui_kits/marketing/Sections.jsx":"b3f106d29c82"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.HelloGorgeousDesignSystem_e2c42b = window.HelloGorgeousDesignSystem_e2c42b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Hello Gorgeous badge / pill. Used for nav tags (NEW, MENU), award
 * chips, and category labels. Defaults to the deep-pink filled pill.
 */
function Badge({
  children,
  tone = "pink",
  style = {},
  ...rest
}) {
  const tones = {
    pink: {
      background: "var(--hg-pink-deep)",
      color: "#fff"
    },
    black: {
      background: "#000",
      color: "#fff"
    },
    outline: {
      background: "transparent",
      color: "#000",
      border: "1.5px solid #000"
    },
    gold: {
      background: "rgba(255,215,0,0.12)",
      color: "#9a7400",
      border: "1px solid rgba(255,215,0,0.5)"
    },
    blue: {
      background: "var(--tri-blue)",
      color: "#fff"
    },
    amber: {
      background: "linear-gradient(to right,#f59e0b,#f97316)",
      color: "#fff"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "4px 10px",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-body)",
      fontSize: "9px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      lineHeight: 1.4,
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Hello Gorgeous primary button.
 * Brand law: white / black / hot pink only. Hover lifts -2px.
 * `cta` makes it uppercase with wide tracking (the premium marketing style).
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  cta = false,
  href,
  fullWidth = false,
  disabled = false,
  iconRight = null,
  onClick,
  style = {},
  ...rest
}) {
  const palettes = {
    primary: {
      background: "var(--hg-pink)",
      color: "#fff",
      border: "none"
    },
    secondary: {
      background: "#000",
      color: "#fff",
      border: "2px solid #000"
    },
    outline: {
      background: "transparent",
      color: "#000",
      border: "2px solid #000"
    },
    white: {
      background: "#fff",
      color: "#000",
      border: "none"
    },
    gradient: {
      background: "linear-gradient(to right, var(--tri-pink), var(--tri-pink-deep))",
      color: "#fff",
      border: "none"
    }
  };
  const sizes = {
    sm: {
      padding: "10px 20px",
      fontSize: "13px",
      minHeight: "40px"
    },
    md: {
      padding: "16px 36px",
      fontSize: "16px",
      minHeight: "48px"
    },
    lg: {
      padding: "20px 44px",
      fontSize: "18px",
      minHeight: "56px"
    }
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: fullWidth ? "100%" : "auto",
    borderRadius: "var(--radius-sm)",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    textDecoration: "none",
    transition: "all var(--dur-base) var(--ease-out)",
    textTransform: cta ? "uppercase" : "none",
    letterSpacing: cta ? "var(--ls-widest)" : "normal",
    ...sizes[size],
    ...palettes[variant],
    ...style
  };
  const hover = e => {
    if (disabled) return;
    e.currentTarget.style.transform = "translateY(-2px)";
    if (variant === "primary") {
      e.currentTarget.style.background = "#000";
      e.currentTarget.style.color = "var(--hg-pink)";
    } else if (variant === "outline") {
      e.currentTarget.style.background = "var(--hg-pink)";
      e.currentTarget.style.color = "#fff";
      e.currentTarget.style.borderColor = "var(--hg-pink)";
    } else if (variant === "secondary") {
      e.currentTarget.style.background = "#fff";
      e.currentTarget.style.color = "#000";
    } else if (variant === "gradient") {
      e.currentTarget.style.filter = "brightness(1.1)";
    }
    e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
  };
  const leave = e => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.background = palettes[variant].background;
    e.currentTarget.style.color = palettes[variant].color;
    e.currentTarget.style.filter = "none";
    e.currentTarget.style.boxShadow = "none";
    if (variant === "outline") e.currentTarget.style.borderColor = "#000";
  };
  const Tag = href ? "a" : "button";
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    style: base,
    onClick: onClick,
    disabled: Tag === "button" ? disabled : undefined,
    onMouseEnter: hover,
    onMouseLeave: leave
  }, rest), children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Hello Gorgeous card. Two looks:
 *  - "outline" (default): 2px black border, hover → pink border + lift.
 *  - "soft": hairline border + soft shadow (calmer surfaces / app).
 */
function Card({
  children,
  variant = "outline",
  interactive = true,
  style = {},
  ...rest
}) {
  const base = {
    background: "#fff",
    color: "#000",
    borderRadius: "var(--radius-lg)",
    padding: "var(--card-pad)",
    transition: "all var(--dur-base) var(--ease-out)",
    ...(variant === "outline" ? {
      border: "2px solid #000"
    } : {
      border: "1px solid var(--border-hairline)",
      boxShadow: "var(--shadow-card)"
    }),
    ...style
  };
  const hover = e => {
    if (!interactive) return;
    e.currentTarget.style.transform = "translateY(-4px)";
    if (variant === "outline") e.currentTarget.style.borderColor = "var(--hg-pink)";
    e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
  };
  const leave = e => {
    if (!interactive) return;
    e.currentTarget.style.transform = "translateY(0)";
    if (variant === "outline") e.currentTarget.style.borderColor = "#000";
    e.currentTarget.style.boxShadow = variant === "soft" ? "var(--shadow-card)" : "none";
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: base,
    onMouseEnter: hover,
    onMouseLeave: leave
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/StarRating.jsx
try { (() => {
/** Inline 5-star rating row (deep-pink stars), used in footer + review cards. */
function StarRating({
  rating = 5,
  count,
  size = 16,
  label,
  style = {}
}) {
  const full = Math.round(rating);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: "2px"
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("svg", {
    key: i,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: i < full ? "var(--hg-pink-deep)" : "none",
    stroke: "var(--hg-pink-deep)",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M11.48 3.5a.56.56 0 011.04 0l2.12 5.11a.56.56 0 00.48.35l5.52.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 00-.18.56l1.28 5.38a.56.56 0 01-.84.61l-4.72-2.88a.56.56 0 00-.59 0l-4.72 2.88a.56.56 0 01-.84-.61l1.28-5.38a.56.56 0 00-.18-.56l-4.2-3.6a.56.56 0 01.32-.99l5.52-.44a.56.56 0 00.48-.35L11.48 3.5z"
  })))), (label || count != null) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "14px",
      fontWeight: 600
    }
  }, rating.toFixed(1), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      opacity: 0.7
    }
  }, " \xB7 ", count, " reviews"), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      opacity: 0.7
    }
  }, " ", label)));
}
Object.assign(__ds_scope, { StarRating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StarRating.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Hello Gorgeous checkbox with label. Pink when checked. */
function Checkbox({
  label,
  checked,
  onChange,
  id,
  style = {},
  ...rest
}) {
  const cbId = id || (label ? "cb-" + label.toLowerCase().replace(/\s+/g, "-") : undefined);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: cbId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      fontSize: "15px",
      color: "#000",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "20px",
      height: "20px",
      flexShrink: 0,
      borderRadius: "5px",
      border: `2px solid ${checked ? "var(--hg-pink)" : "#000"}`,
      background: checked ? "var(--hg-pink)" : "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all var(--dur-fast)"
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  }))), /*#__PURE__*/React.createElement("input", _extends({
    id: cbId,
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Hello Gorgeous text input with label. Black border, pink focus ring. */
function Input({
  label,
  hint,
  error,
  id,
  style = {},
  ...rest
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: "block",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "13px",
      fontWeight: 600,
      marginBottom: "6px",
      color: "#000"
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    style: {
      width: "100%",
      padding: "12px 14px",
      fontSize: "16px",
      fontFamily: "var(--font-body)",
      color: "#000",
      background: "#fff",
      border: `1.5px solid ${error ? "var(--hg-error)" : "#000"}`,
      borderRadius: "var(--radius-sm)",
      outline: "none",
      transition: "box-shadow var(--dur-fast), border-color var(--dur-fast)"
    },
    onFocus: e => {
      e.currentTarget.style.borderColor = "var(--hg-pink)";
      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,45,142,0.18)";
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = error ? "var(--hg-error)" : "#000";
      e.currentTarget.style.boxShadow = "none";
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "12px",
      marginTop: "5px",
      color: error ? "var(--hg-error)" : "rgba(0,0,0,0.55)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/marketing/Accordion.jsx
try { (() => {
/** FAQ accordion. Pink "+" that rotates; one item open at a time by default. */
function Accordion({
  items = [],
  single = true,
  style = {}
}) {
  const [open, setOpen] = React.useState(single ? 0 : []);
  const isOpen = i => single ? open === i : open.includes(i);
  const toggle = i => {
    if (single) setOpen(open === i ? -1 : i);else setOpen(open.includes(i) ? open.filter(x => x !== i) : [...open, i]);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      ...style
    }
  }, items.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => toggle(i),
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      padding: "20px 4px",
      background: "none",
      border: "none",
      cursor: "pointer",
      textAlign: "left",
      fontFamily: "var(--font-serif)",
      fontSize: "18px",
      fontWeight: 600,
      color: "#000"
    }
  }, item.q, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      fontSize: "24px",
      fontWeight: 400,
      color: "var(--hg-pink)",
      transform: isOpen(i) ? "rotate(45deg)" : "rotate(0)",
      transition: "transform var(--dur-base) var(--ease-out)"
    }
  }, "+")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: isOpen(i) ? "400px" : "0",
      overflow: "hidden",
      transition: "max-height var(--dur-base) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      padding: "0 4px 20px",
      fontSize: "16px",
      lineHeight: 1.7,
      color: "rgba(0,0,0,0.75)",
      margin: 0
    }
  }, item.a)))));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/marketing/PricingCard.jsx
try { (() => {
/** Membership / pricing tier card. `featured` flips it to a black card. */
function PricingCard({
  name,
  price,
  period = "/mo",
  tagline,
  features = [],
  cta = "Join Now",
  href,
  badge,
  featured = false,
  style = {}
}) {
  const dark = featured;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: dark ? "#000" : "#fff",
      color: dark ? "#fff" : "#000",
      border: `2px solid ${dark ? "#000" : "#000"}`,
      borderRadius: "var(--radius-xl)",
      padding: "32px",
      position: "relative",
      fontFamily: "var(--font-body)",
      boxShadow: dark ? "var(--shadow-pink)" : "none",
      ...style
    }
  }, badge && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "20px",
      right: "20px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: dark ? "pink" : "black"
  }, badge)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 700,
      fontSize: "24px",
      margin: "0 0 4px",
      color: dark ? "#fff" : "#000"
    }
  }, name), tagline && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "14px",
      opacity: 0.7,
      margin: "0 0 18px"
    }
  }, tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "4px",
      marginBottom: "22px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 700,
      fontSize: "44px",
      color: "var(--hg-pink)"
    }
  }, price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "15px",
      opacity: 0.7
    }
  }, period)), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "0 0 26px",
      display: "grid",
      gap: "12px"
    }
  }, features.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: "10px",
      fontSize: "15px",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--hg-pink)",
      fontWeight: 700
    }
  }, "\u2713"), f))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: dark ? "primary" : "secondary",
    fullWidth: true,
    cta: true,
    href: href
  }, cta));
}
Object.assign(__ds_scope, { PricingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/PricingCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/SectionHeader.jsx
try { (() => {
/** Centered (or left) section header: pink eyebrow + Playfair title + lead. */
function SectionHeader({
  eyebrow,
  title,
  accent,
  lead,
  align = "center",
  onDark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      maxWidth: align === "center" ? "720px" : "none",
      margin: align === "center" ? "0 auto" : "0",
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "11px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.2em",
      color: "var(--hg-pink)",
      margin: "0 0 14px"
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 700,
      fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
      margin: 0,
      color: onDark ? "#fff" : "#000"
    }
  }, title, " ", accent && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--hg-pink)"
    }
  }, accent)), lead && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "20px",
      lineHeight: 1.6,
      marginTop: "16px",
      color: onDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.75)"
    }
  }, lead));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/marketing/ServiceCard.jsx
try { (() => {
/** Service / treatment card — outline card with title, sub, bullets, price, badge. */
function ServiceCard({
  title,
  sub,
  bullets = [],
  price,
  priceUnit,
  badge,
  href,
  image,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "block",
      textDecoration: "none",
      color: "#000",
      background: "#fff",
      border: `2px solid ${hover ? "var(--hg-pink)" : "#000"}`,
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      transform: hover ? "translateY(-4px)" : "none",
      boxShadow: hover ? "var(--shadow-card-hover)" : "none",
      transition: "all var(--dur-base) var(--ease-out)",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, image && /*#__PURE__*/React.createElement("div", {
    style: {
      height: "180px",
      background: `#000 center/cover url(${image})`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "6px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 700,
      fontSize: "22px",
      margin: 0
    }
  }, title), badge && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "pink"
  }, badge)), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "15px",
      color: "rgba(0,0,0,0.7)",
      margin: "0 0 14px"
    }
  }, sub), bullets.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "0 0 16px",
      display: "grid",
      gap: "8px"
    }
  }, bullets.map((b, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: "8px",
      fontSize: "14px",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--hg-pink)",
      fontWeight: 700
    }
  }, "\u2713"), b))), price && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "4px",
      borderTop: "1px solid var(--border-hairline)",
      paddingTop: "14px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 700,
      fontSize: "26px",
      color: "var(--hg-pink)"
    }
  }, price), priceUnit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "13px",
      color: "rgba(0,0,0,0.6)"
    }
  }, priceUnit))));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/Sidebar.jsx
try { (() => {
/* Hello Gorgeous — Provider / Clinical workspace UI kit */

const NAV = [{
  name: "Dashboard",
  icon: "🏠",
  id: "dash"
}, {
  name: "Patient Queue",
  icon: "👥",
  id: "queue",
  badge: 3
}, {
  name: "My Schedule",
  icon: "📅",
  id: "schedule"
}, {
  name: "Charting",
  icon: "📝",
  id: "charting"
}, {
  name: "Patient Lookup",
  icon: "🔍",
  id: "lookup"
}, {
  name: "Photos",
  icon: "📷",
  id: "photos"
}, {
  name: "Tasks",
  icon: "✅",
  id: "tasks"
}, {
  name: "Products",
  icon: "💉",
  id: "products"
}, {
  name: "Performance",
  icon: "📊",
  id: "perf"
}];
function Clock() {
  const [t, setT] = React.useState(new Date());
  React.useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      borderBottom: "1px solid #000",
      background: "#111"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-body)",
      fontSize: "24px",
      fontWeight: 700,
      color: "var(--hg-pink)",
      letterSpacing: "-0.01em"
    }
  }, t.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "11px",
      color: "rgba(255,182,220,0.6)"
    }
  }, t.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  })));
}
function Sidebar({
  active,
  setActive
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: "256px",
      background: "#0a0a0a",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px",
      borderBottom: "1px solid #000",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "40px",
      height: "40px",
      borderRadius: "12px",
      background: "linear-gradient(135deg,#ec4899,#db2777)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: "13px",
      boxShadow: "0 6px 16px rgba(255,45,142,0.2)"
    }
  }, "HG"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontWeight: 700,
      color: "var(--hg-pink)",
      fontSize: "15px",
      whiteSpace: "nowrap"
    }
  }, "Provider Portal"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "11px",
      color: "rgba(244,114,182,0.6)"
    }
  }, "Clinical Workspace"))), /*#__PURE__*/React.createElement(Clock, null), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      padding: "12px 8px",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "grid",
      gap: "4px"
    }
  }, NAV.map(n => {
    const on = active === n.id;
    return /*#__PURE__*/React.createElement("li", {
      key: n.id
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setActive(n.id),
      style: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 12px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        fontWeight: 500,
        textAlign: "left",
        background: on ? "var(--hg-pink)" : "transparent",
        color: on ? "#fff" : "rgba(255,255,255,0.85)",
        boxShadow: on ? "0 6px 16px rgba(255,45,142,0.2)" : "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "18px"
      }
    }, n.icon), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, n.name), n.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        background: "#10b981",
        color: "#fff",
        fontSize: "11px",
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: "999px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: "6px",
        height: "6px",
        borderRadius: "999px",
        background: "#fff"
      }
    }), n.badge)));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px",
      borderTop: "1px solid #000",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "36px",
      height: "36px",
      borderRadius: "999px",
      background: "linear-gradient(135deg,#ec4899,#a855f7)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: "13px"
    }
  }, "R"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "13px",
      fontWeight: 700
    }
  }, "Ryan, NP"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: "#34d399",
      fontWeight: 600
    }
  }, "\u25CF On Duty"))));
}
window.ClinicalSidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/Views.jsx
try { (() => {
/* Hello Gorgeous — Provider workspace: dashboard + charting views */

function TopBar({
  title,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 28px",
      borderBottom: "1px solid var(--border-hairline)",
      background: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-serif)",
      margin: 0,
      fontSize: "24px"
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontSize: "13px",
      color: "rgba(0,0,0,0.55)"
    }
  }, sub)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      background: "#10b981",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      padding: "10px 16px",
      fontWeight: 600,
      fontSize: "14px",
      cursor: "pointer",
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "8px",
      height: "8px",
      borderRadius: "999px",
      background: "#fff"
    }
  }), "3 Waiting"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "var(--hg-pink)",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      padding: "10px 18px",
      fontWeight: 600,
      fontSize: "14px",
      cursor: "pointer",
      fontFamily: "var(--font-body)"
    }
  }, "+ New Chart")));
}
const STATS = [{
  n: "12",
  l: "Appointments today"
}, {
  n: "3",
  l: "In queue"
}, {
  n: "$2,450",
  l: "Revenue today"
}, {
  n: "8",
  l: "Charts to finalize"
}];
const QUEUE = [{
  name: "Sarah K.",
  svc: "Botox — 20u glabella",
  time: "Waiting 4 min",
  status: "ready"
}, {
  name: "Maria L.",
  svc: "Lip filler consult",
  time: "Waiting 11 min",
  status: "ready"
}, {
  name: "Jenna P.",
  svc: "Morpheus8 Burst — face",
  time: "In room 2",
  status: "inroom"
}];
const SCHEDULE = [{
  t: "10:00",
  name: "Ashley R.",
  svc: "Dysport touch-up",
  done: true
}, {
  t: "10:45",
  name: "Sarah K.",
  svc: "Botox — full face",
  done: true
}, {
  t: "11:30",
  name: "Maria L.",
  svc: "Lip filler",
  done: false
}, {
  t: "1:15",
  name: "Jenna P.",
  svc: "Morpheus8 Burst",
  done: false
}, {
  t: "2:30",
  name: "Dani M.",
  svc: "Botox touch-up",
  done: false
}];
function Dashboard() {
  const {
    Badge
  } = window.HelloGorgeousDesignSystem_e2c42b;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopBar, {
    title: "Good morning, Ryan \uD83D\uDC4B",
    sub: "Tuesday, July 8 \xB7 12 appointments today"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "18px",
      marginBottom: "28px"
    }
  }, STATS.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.l,
    style: {
      background: "#fff",
      border: "1px solid var(--border-hairline)",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "var(--shadow-card)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 700,
      fontSize: "32px",
      color: "var(--hg-pink)"
    }
  }, s.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "13px",
      color: "rgba(0,0,0,0.6)",
      marginTop: "2px"
    }
  }, s.l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr",
      gap: "24px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-serif)",
      fontSize: "18px",
      margin: "0 0 14px"
    }
  }, "Patient Queue"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "12px"
    }
  }, QUEUE.map(q => /*#__PURE__*/React.createElement("div", {
    key: q.name,
    style: {
      background: "#fff",
      border: "1px solid var(--border-hairline)",
      borderRadius: "14px",
      padding: "16px",
      boxShadow: "var(--shadow-card)",
      display: "flex",
      alignItems: "center",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "44px",
      height: "44px",
      borderRadius: "999px",
      background: "var(--hg-pink-soft)",
      color: "var(--hg-pink-deep)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700
    }
  }, q.name[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: "15px"
    }
  }, q.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "13px",
      color: "rgba(0,0,0,0.6)"
    }
  }, q.svc, " \xB7 ", q.time)), q.status === "ready" ? /*#__PURE__*/React.createElement("button", {
    style: {
      background: "var(--hg-pink)",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "8px 14px",
      fontWeight: 600,
      fontSize: "13px",
      cursor: "pointer",
      fontFamily: "var(--font-body)"
    }
  }, "Start") : /*#__PURE__*/React.createElement(Badge, {
    tone: "black"
  }, "In room 2"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-serif)",
      fontSize: "18px",
      margin: "0 0 14px"
    }
  }, "Today's Schedule"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      border: "1px solid var(--border-hairline)",
      borderRadius: "14px",
      boxShadow: "var(--shadow-card)",
      overflow: "hidden"
    }
  }, SCHEDULE.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "14px 16px",
      borderBottom: i < SCHEDULE.length - 1 ? "1px solid var(--border-hairline)" : "none",
      opacity: s.done ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: "tabular-nums",
      fontWeight: 700,
      fontSize: "14px",
      color: s.done ? "rgba(0,0,0,0.5)" : "var(--hg-pink)",
      minWidth: "44px"
    }
  }, s.t), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: "14px",
      textDecoration: s.done ? "line-through" : "none"
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      color: "rgba(0,0,0,0.55)"
    }
  }, s.svc)), s.done && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#10b981",
      fontWeight: 700,
      fontSize: "13px"
    }
  }, "\u2713"))))))));
}
function Charting() {
  const {
    Button,
    Input,
    Badge
  } = window.HelloGorgeousDesignSystem_e2c42b;
  const [units, setUnits] = React.useState({
    glabella: 20,
    forehead: 10,
    crows: 12
  });
  const total = Object.values(units).reduce((a, b) => a + b, 0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopBar, {
    title: "Charting \u2014 Sarah K.",
    sub: "Botox \xB7 Tuesday, July 8 \xB7 Ryan, NP"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "28px",
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr",
      gap: "24px",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      border: "2px solid #000",
      borderRadius: "16px",
      padding: "24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "18px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-serif)",
      margin: 0,
      fontSize: "20px"
    }
  }, "Neurotoxin map"), /*#__PURE__*/React.createElement(Badge, {
    tone: "pink"
  }, "Botox")), [["glabella", "Glabella (frown lines)"], ["forehead", "Forehead lines"], ["crows", "Crow's feet (both)"]].map(([k, label]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 0",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "15px",
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setUnits(u => ({
      ...u,
      [k]: Math.max(0, u[k] - 2)
    })),
    style: {
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      border: "2px solid #000",
      background: "#fff",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "16px"
    }
  }, "\u2212"), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: "56px",
      textAlign: "center",
      fontWeight: 700,
      fontFamily: "var(--font-serif)",
      fontSize: "18px"
    }
  }, units[k], "u"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setUnits(u => ({
      ...u,
      [k]: u[k] + 2
    })),
    style: {
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      border: "2px solid #000",
      background: "var(--hg-pink)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "16px"
    }
  }, "+")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "18px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "15px",
      fontWeight: 700
    }
  }, "Total units"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 700,
      fontSize: "26px",
      color: "var(--hg-pink)"
    }
  }, total, "u"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      border: "1px solid var(--border-hairline)",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "var(--shadow-card)"
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: "var(--font-serif)",
      margin: "0 0 14px"
    }
  }, "Lot & consent"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Product lot #",
    defaultValue: "C3824A"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Expiration",
    defaultValue: "2027-02"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#10b981",
      fontWeight: 600
    }
  }, "\u2713 Consent signed electronically"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      border: "1px solid var(--border-hairline)",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "var(--shadow-card)"
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: "var(--font-serif)",
      margin: "0 0 12px"
    }
  }, "Provider note"), /*#__PURE__*/React.createElement("textarea", {
    defaultValue: "Patient tolerated treatment well. No adverse reactions. Reviewed aftercare; follow-up in 2 weeks.",
    style: {
      width: "100%",
      minHeight: "90px",
      border: "1.5px solid #000",
      borderRadius: "8px",
      padding: "12px",
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      resize: "vertical",
      boxSizing: "border-box"
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    cta: true
  }, "Finalize & Sign Chart"))));
}
window.ClinicalViews = {
  Dashboard,
  Charting
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Views.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client-app/Screens.jsx
try { (() => {
/* Hello Gorgeous — Client app (PWA) UI kit: screens */

function AppTopBar({
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#000",
      color: "#fff",
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      position: "sticky",
      top: 0,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "30px",
      height: "30px",
      borderRadius: "8px",
      background: "linear-gradient(135deg,#ec4899,#f43f5e)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: "11px"
    }
  }, "HG"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: "16px"
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontSize: "12px",
      background: "rgba(255,45,142,0.15)",
      color: "#FF2D8E",
      padding: "3px 9px",
      borderRadius: "999px",
      fontWeight: 600
    }
  }, "VIP Glow"));
}
function HomeScreen({
  go
}) {
  const {
    Card
  } = window.HelloGorgeousDesignSystem_e2c42b;
  const tiles = [{
    t: "Book",
    s: "Find a time",
    e: "📅",
    to: "deals"
  }, {
    t: "Vitamin Bar",
    s: "Free shot ready",
    e: "💉",
    to: "vitamin"
  }, {
    t: "My Rewards",
    s: "1,240 pts",
    e: "⭐",
    to: "deals"
  }, {
    t: "Messages",
    s: "1 new",
    e: "💬",
    to: "deals"
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppTopBar, {
    title: "Hi, Dani \uD83D\uDC4B"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: "18px",
      overflow: "hidden",
      background: "linear-gradient(135deg,#FF2D8E,#E6007E)",
      color: "#fff",
      padding: "20px",
      marginBottom: "18px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      opacity: 0.9
    }
  }, "Member exclusive"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-serif)",
      margin: "6px 0",
      color: "#fff",
      fontSize: "22px"
    }
  }, "Free Vitamin Shot"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 14px",
      fontSize: "14px",
      opacity: 0.95
    }
  }, "Redeem on your next visit \u2014 no points needed."), /*#__PURE__*/React.createElement("button", {
    onClick: () => go("vitamin"),
    style: {
      background: "#fff",
      color: "#E6007E",
      border: "none",
      borderRadius: "10px",
      padding: "9px 18px",
      fontWeight: 700,
      fontSize: "13px",
      cursor: "pointer",
      fontFamily: "var(--font-body)"
    }
  }, "Redeem now")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px"
    }
  }, tiles.map(x => /*#__PURE__*/React.createElement("div", {
    key: x.t,
    onClick: () => go(x.to),
    style: {
      cursor: "pointer",
      background: "#fff",
      border: "1px solid var(--border-hairline)",
      borderRadius: "16px",
      padding: "16px",
      boxShadow: "var(--shadow-card)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "24px"
    }
  }, x.e), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      marginTop: "8px",
      fontSize: "15px"
    }
  }, x.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      color: "var(--hg-pink)",
      fontWeight: 600
    }
  }, x.s)))), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: "var(--font-serif)",
      margin: "24px 0 12px"
    }
  }, "Upcoming"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      border: "1px solid var(--border-hairline)",
      borderRadius: "16px",
      padding: "16px",
      boxShadow: "var(--shadow-card)",
      display: "flex",
      alignItems: "center",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      background: "var(--hg-pink-soft)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--hg-pink-deep)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "10px",
      fontWeight: 700
    }
  }, "JUL"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "18px",
      fontWeight: 700,
      lineHeight: 1
    }
  }, "09")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: "15px"
    }
  }, "Botox touch-up"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "13px",
      color: "rgba(0,0,0,0.6)"
    }
  }, "2:30 PM \xB7 with Ryan, NP")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "12px",
      fontWeight: 700,
      color: "var(--hg-success)"
    }
  }, "Confirmed"))));
}
const DEALS = [{
  t: "Spring Laser — Underarms",
  p: "$79",
  o: "$120",
  tag: "SPRING"
}, {
  t: "Lip Filler Refresh",
  p: "$549",
  o: "$650",
  tag: "MEMBER"
}, {
  t: "Morpheus8 Burst — 1 Area",
  p: "$600",
  o: "$750",
  tag: "NEW"
}, {
  t: "GLP-1 First Month",
  p: "$199",
  o: "$299",
  tag: "RX"
}];
function DealsScreen() {
  const {
    Badge
  } = window.HelloGorgeousDesignSystem_e2c42b;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppTopBar, {
    title: "Deals & Offers"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px",
      display: "grid",
      gap: "12px"
    }
  }, DEALS.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.t,
    style: {
      background: "#fff",
      border: "1px solid var(--border-hairline)",
      borderRadius: "16px",
      padding: "16px",
      boxShadow: "var(--shadow-card)",
      display: "flex",
      alignItems: "center",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "6px"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "pink"
  }, d.tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: "15px"
    }
  }, d.t), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "8px",
      marginTop: "4px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 700,
      fontSize: "22px",
      color: "var(--hg-pink)"
    }
  }, d.p), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "13px",
      color: "rgba(0,0,0,0.45)",
      textDecoration: "line-through"
    }
  }, d.o))), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "var(--hg-pink)",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "10px 16px",
      fontWeight: 700,
      fontSize: "13px",
      cursor: "pointer",
      fontFamily: "var(--font-body)"
    }
  }, "Claim")))));
}
function VitaminScreen({
  go
}) {
  const {
    Button
  } = window.HelloGorgeousDesignSystem_e2c42b;
  const shots = ["B12 Energy", "Lipo-MIC Burn", "Glutathione Glow", "Vitamin D3", "Biotin Beauty", "NAD+ Boost"];
  const [sel, setSel] = React.useState("Glutathione Glow");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppTopBar, {
    title: "Vitamin Bar"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--hg-pink-soft)",
      border: "1px solid var(--hg-pink-200)",
      borderRadius: "16px",
      padding: "16px",
      marginBottom: "18px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "13px",
      fontWeight: 700,
      color: "var(--hg-pink-deep)"
    }
  }, "\uD83C\uDF81 1 free shot available"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0 0",
      fontSize: "13px",
      color: "rgba(0,0,0,0.7)"
    }
  }, "Pick your shot and we'll have it ready at check-in.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px"
    }
  }, shots.map(s => {
    const on = sel === s;
    return /*#__PURE__*/React.createElement("div", {
      key: s,
      onClick: () => setSel(s),
      style: {
        cursor: "pointer",
        background: on ? "var(--hg-pink)" : "#fff",
        color: on ? "#fff" : "#000",
        border: `2px solid ${on ? "var(--hg-pink)" : "#000"}`,
        borderRadius: "14px",
        padding: "16px",
        fontWeight: 600,
        fontSize: "14px",
        transition: "all .2s"
      }
    }, s);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "20px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    cta: true,
    onClick: () => go("home")
  }, "Reserve ", sel))));
}
window.AppScreens = {
  HomeScreen,
  DealsScreen,
  VitaminScreen
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client-app/Screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Chrome.jsx
try { (() => {
/* Hello Gorgeous — Marketing site UI kit: header + footer chrome */

const TRI = [{
  border: "rgba(236,72,153,0.35)",
  sub: "#f472b6"
}, {
  border: "rgba(59,130,246,0.35)",
  sub: "#60a5fa"
}, {
  border: "rgba(245,158,11,0.35)",
  sub: "#fbbf24"
}];
const GRAD_TITLE = "linear-gradient(to right, #ec4899, #60a5fa, #f59e0b)";
const NAV = [{
  label: "Services",
  i: 0
}, {
  label: "Shop RX",
  i: 1
}, {
  label: "Quiz",
  i: 2
}, {
  label: "Specials",
  i: 0
}, {
  label: "Memberships ⭐",
  i: 2
}, {
  label: "Before & After",
  i: 1
}, {
  label: "About",
  i: 0
}];
function MktHeader({
  onNav,
  active
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "#000",
      borderBottom: "1px solid rgba(255,255,255,0.1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      padding: "7px 16px",
      textAlign: "center",
      fontSize: "12px",
      color: "rgba(255,255,255,0.7)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: GRAD_TITLE,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      fontWeight: 600
    }
  }, "#1 Best Med Spa in Oswego"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: "0 8px",
      color: "rgba(255,255,255,0.3)"
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,0.9)"
    }
  }, "We screen you like a medical practice, because we are one."), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: "0 8px",
      color: "rgba(255,255,255,0.3)"
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "#fff",
      textDecoration: "none"
    }
  }, "(630) 636-6193")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "1280px",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav("Home");
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "38px",
      height: "38px",
      borderRadius: "9px",
      background: "linear-gradient(to right,#ec4899,#db2777)",
      color: "#fff",
      fontWeight: 700,
      fontSize: "13px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "HG"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      background: GRAD_TITLE,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      fontWeight: 700,
      fontSize: "15px",
      lineHeight: 1.1
    }
  }, "Hello Gorgeous Med Spa"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "10px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.45)",
      fontWeight: 600
    }
  }, "Medical Aesthetics"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav("Book"),
    style: {
      background: "linear-gradient(to right,#ec4899,#db2777)",
      color: "#fff",
      border: "none",
      borderRadius: "9px",
      padding: "10px 22px",
      fontWeight: 700,
      fontSize: "14px",
      cursor: "pointer",
      fontFamily: "var(--font-body)"
    }
  }, "Book Now")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid rgba(255,255,255,0.05)",
      background: "rgba(9,9,11,0.9)"
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      maxWidth: "1280px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "center",
      gap: "6px",
      padding: "8px 12px",
      flexWrap: "wrap"
    }
  }, NAV.map(n => {
    const on = active === n.label;
    return /*#__PURE__*/React.createElement("a", {
      key: n.label,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNav(n.label);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        height: "32px",
        padding: "0 14px",
        borderRadius: "9px",
        fontSize: "13px",
        fontWeight: 600,
        textDecoration: "none",
        whiteSpace: "nowrap",
        background: on ? "linear-gradient(to right,#ec4899,#db2777)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${TRI[n.i].border}`,
        color: on ? "#fff" : TRI[n.i].sub
      }
    }, n.label);
  }))));
}
function MktFooter() {
  const {
    StarRating
  } = window.HelloGorgeousDesignSystem_e2c42b;
  const cols = [{
    h: "Services",
    links: ["Injectables", "Morpheus8 Burst", "Laser Hair Removal", "HydraFacial", "Lip Studio"]
  }, {
    h: "Shop RX",
    links: ["GLP-1 Weight Loss", "Peptide Therapy", "Hormone Therapy", "IV & Vitamin Shots"]
  }, {
    h: "About",
    links: ["Our Story", "Meet the Team", "Why Choose Us", "FAQ", "Blog"]
  }, {
    h: "Visit",
    links: ["Book Online", "Pre & Post Care", "Contact", "Memberships", "Gift Cards"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "#000",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: "1px solid rgba(255,255,255,0.15)",
      background: "#09090b",
      padding: "16px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "13px",
      fontWeight: 700,
      color: "#FFB8DC"
    }
  }, "Founder-led \xB7 Full-authority Nurse Practitioner on site"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "6px 0 0",
      fontSize: "13px",
      fontWeight: 600,
      color: "#FF2D8E"
    }
  }, "We screen you like a medical practice, because we are one.")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "48px 24px",
      display: "grid",
      gridTemplateColumns: "1.4fr repeat(4, 1fr)",
      gap: "32px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "14px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      background: "linear-gradient(135deg,#ec4899,#f43f5e)",
      color: "#fff",
      fontWeight: 700,
      fontSize: "18px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "HG"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: "#FF2D8E",
      fontWeight: 700,
      fontSize: "20px"
    }
  }, "Hello Gorgeous"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: "#FF2D8E",
      fontSize: "11px",
      letterSpacing: "0.08em"
    }
  }, "MEDICAL AESTHETICS"))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "14px",
      color: "rgba(255,255,255,0.85)",
      maxWidth: "320px"
    }
  }, "74 W. Washington Street, Oswego, IL 60543 \xB7 (630) 636-6193"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "14px"
    }
  }, /*#__PURE__*/React.createElement(StarRating, {
    rating: 4.4,
    count: 117,
    label: "Google"
  }))), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      color: "#FF2D8E",
      fontSize: "13px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontFamily: "var(--font-body)",
      margin: "0 0 14px"
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "grid",
      gap: "10px"
    }
  }, c.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "rgba(255,255,255,0.75)",
      textDecoration: "none",
      fontSize: "14px"
    }
  }, l))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid rgba(255,255,255,0.1)",
      padding: "20px 24px",
      textAlign: "center",
      fontSize: "13px",
      color: "rgba(255,255,255,0.6)"
    }
  }, "\xA9 ", new Date().getFullYear(), " Hello Gorgeous Med Spa. All rights reserved. \xB7 HIPAA Notice \xB7 Privacy Policy"));
}
window.MktHeader = MktHeader;
window.MktFooter = MktFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Sections.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Hello Gorgeous — Marketing site UI kit: page sections */

function Hero({
  onNav
}) {
  const {
    Button
  } = window.HelloGorgeousDesignSystem_e2c42b;
  return /*#__PURE__*/React.createElement("section", {
    className: "section-white",
    style: {
      padding: "80px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "1280px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "64px",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "hg-eyebrow",
    style: {
      margin: "0 0 16px"
    }
  }, "Best of Oswego \xB7 #1 Best Med Spa"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 700,
      fontSize: "56px",
      lineHeight: 1.05,
      letterSpacing: "-0.02em",
      margin: 0
    }
  }, "Oswego's Trusted ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--hg-pink)"
    }
  }, "Aesthetic Team")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "20px",
      marginTop: "22px",
      color: "rgba(0,0,0,0.8)"
    }
  }, "Medical Experts. Real Results."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "17px",
      marginTop: "8px",
      color: "rgba(0,0,0,0.6)"
    }
  }, "Botox \xB7 Fillers \xB7 Hormone Therapy \xB7 Medical Weight Loss"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "14px",
      marginTop: "10px",
      color: "#9a7400",
      fontWeight: 600
    }
  }, "\uD83C\uDFC6 Best of Oswego \u2014 #1 Best Med Spa"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "14px",
      marginTop: "32px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    cta: true,
    onClick: () => onNav("Book")
  }, "Book Now"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => onNav("Book")
  }, "Call 630-636-6193"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: "22px",
      overflow: "hidden",
      aspectRatio: "3/2",
      background: "#000",
      boxShadow: "var(--shadow-card)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/hero-brand.png",
    alt: "Hello Gorgeous founders Dani & Ryan",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }))));
}
const SERVICES = [{
  title: "Botox & Injectables",
  badge: "MENU",
  sub: "All 5 neurotoxins · NP on site",
  bullets: ["Botox from $10/unit", "Lip & dermal filler", "Free consultation"],
  price: "$10",
  priceUnit: "/unit"
}, {
  title: "Morpheus8 Burst",
  badge: "NEW",
  sub: "Deep RF microneedling",
  bullets: ["Skin tightening", "Acne scar repair", "Minimal downtime"],
  price: "$600",
  priceUnit: "/area"
}, {
  title: "GLP-1 Weight Loss",
  badge: "RX",
  sub: "Semaglutide & tirzepatide",
  bullets: ["NP-supervised", "Weekly injection", "Avg 15–25% loss"],
  price: "$249",
  priceUnit: "/mo"
}, {
  title: "HydraFacial",
  sub: "Cleanse · extract · hydrate",
  bullets: ["Instant glow", "No downtime", "All skin types"],
  price: "$199",
  priceUnit: ""
}, {
  title: "Laser Hair Removal",
  badge: "SPRING",
  sub: "Pay-per-session or membership",
  bullets: ["Underarms $79", "Bikini $129", "No packages required"],
  price: "$79",
  priceUnit: "/area"
}, {
  title: "Peptide Therapy",
  badge: "RX",
  sub: "BPC-157 · Sermorelin · PT-141",
  bullets: ["Recovery & repair", "Energy & sleep", "Physician-guided"],
  price: "$199",
  priceUnit: "/mo"
}];
function Services({
  onNav
}) {
  const {
    SectionHeader,
    ServiceCard
  } = window.HelloGorgeousDesignSystem_e2c42b;
  return /*#__PURE__*/React.createElement("section", {
    className: "section-white",
    style: {
      padding: "100px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "1280px",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Treatment Menu",
    title: "Medical Experts.",
    accent: "Real Results.",
    lead: "Every treatment is directed by a full-authority nurse practitioner \u2014 same-day appointments often available."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "40px",
      marginTop: "56px"
    }
  }, SERVICES.map(s => /*#__PURE__*/React.createElement(ServiceCard, _extends({
    key: s.title
  }, s, {
    href: "#"
  }))))));
}
function TrustStrip() {
  const stats = [{
    n: "4.4★",
    l: "117 Google reviews"
  }, {
    n: "5.0★",
    l: "1,931 Fresha reviews"
  }, {
    n: "#1",
    l: "Best Med Spa in Oswego"
  }, {
    n: "5",
    l: "neurotoxin brands offered"
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "section-black",
    style: {
      padding: "64px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "1280px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "32px",
      textAlign: "center"
    }
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 700,
      fontSize: "44px",
      color: "var(--hg-pink)"
    }
  }, s.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "14px",
      color: "rgba(255,255,255,0.7)",
      marginTop: "4px"
    }
  }, s.l)))));
}
function Memberships({
  onNav
}) {
  const {
    SectionHeader,
    PricingCard
  } = window.HelloGorgeousDesignSystem_e2c42b;
  return /*#__PURE__*/React.createElement("section", {
    className: "section-white",
    style: {
      padding: "100px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "1100px",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Monthly Memberships",
    title: "Glow on a",
    accent: "schedule.",
    lead: "Members save on every visit and bank credit toward injectables and advanced treatments."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "32px",
      marginTop: "56px",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(PricingCard, {
    name: "Glow",
    price: "$59",
    tagline: "Skin maintenance",
    features: ["1 express facial / mo", "5% off injectables", "Member pricing on lasers"],
    cta: "Join Glow",
    href: "#"
  }), /*#__PURE__*/React.createElement(PricingCard, {
    name: "VIP Glow",
    price: "$99",
    tagline: "Most popular",
    badge: "Popular",
    featured: true,
    features: ["1 full facial / mo", "10% off injectables", "Free Vitamin Bar shot", "Priority booking"],
    cta: "Join VIP",
    href: "#"
  }), /*#__PURE__*/React.createElement(PricingCard, {
    name: "Wellness RX",
    price: "$199",
    tagline: "Medical optimization",
    features: ["NP visit each month", "Peptide or GLP-1 program", "Quarterly lab review"],
    cta: "Join Wellness",
    href: "#"
  }))));
}
function FAQ() {
  const {
    SectionHeader,
    Accordion
  } = window.HelloGorgeousDesignSystem_e2c42b;
  return /*#__PURE__*/React.createElement("section", {
    className: "section-white",
    style: {
      padding: "0 24px 100px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "820px",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "Common Questions",
    title: "Good to",
    accent: "know."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "32px"
    }
  }, /*#__PURE__*/React.createElement(Accordion, {
    items: [{
      q: "Is there a consultation fee?",
      a: "No — consultations with our nurse practitioner are always free, whether you book in person or virtually."
    }, {
      q: "What makes Hello Gorgeous a medical spa?",
      a: "We're nurse-practitioner-directed and screen every client like a medical practice — because we are one. All injectables and Rx programs are physician-guided."
    }, {
      q: "Do you offer financing?",
      a: "Yes — 0% financing is available through Cherry, and memberships spread cost across the year."
    }, {
      q: "Which areas do you serve?",
      a: "Our clinic is in Oswego, IL and we regularly see clients from Naperville, Aurora, Plainfield, Yorkville and Montgomery."
    }]
  }))));
}
function FinalCTA({
  onNav
}) {
  const {
    Button
  } = window.HelloGorgeousDesignSystem_e2c42b;
  return /*#__PURE__*/React.createElement("section", {
    className: "section-pink",
    style: {
      padding: "80px 24px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "720px",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 700,
      fontSize: "40px",
      color: "#fff",
      margin: 0
    }
  }, "Ready to feel gorgeous?"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "rgba(255,255,255,0.9)",
      fontSize: "18px",
      marginTop: "14px"
    }
  }, "Book a free consultation with our team \u2014 same-day appointments are often available."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "14px",
      justifyContent: "center",
      marginTop: "28px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "white",
    cta: true,
    onClick: () => onNav("Book")
  }, "Book Free Consult"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => onNav("Book")
  }, "Call (630) 636-6193"))));
}
window.MktSections = {
  Hero,
  Services,
  TrustStrip,
  Memberships,
  FAQ,
  FinalCTA
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StarRating = __ds_scope.StarRating;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.PricingCard = __ds_scope.PricingCard;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

})();
