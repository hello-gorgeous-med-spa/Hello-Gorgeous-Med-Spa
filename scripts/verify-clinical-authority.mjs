/**
 * Verifies the clinical authority layer against a running server:
 * every `ld+json` block parses, `MedicalWebPage`/`Person` nodes carry the
 * reviewer wiring, and the visible byline appears exactly once per page.
 *
 * Usage: node scripts/verify-clinical-authority.mjs [baseUrl]
 */
const BASE = process.argv[2] || "http://localhost:3010";

const PAGES = [
  "/rx/peptides",
  "/rx/hormones",
  "/rx/wellness",
  "/rx/weight-loss",
  "/rx/sexual-health",
  "/rx/learn/what-are-peptides",
  "/rx/learn/what-is-glp-1",
  "/rx/learn/what-is-hormone-therapy",
  "/rx/learn/how-regen-works",
  "/rx/product/p175",
  "/peptides/peptides-101",
  "/peptides/bpc-157",
  "/providers/ryan",
  "/providers/dr-arora",
];

function ldBlocks(html) {
  const out = [];
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

function flatten(node) {
  if (Array.isArray(node)) return node.flatMap(flatten);
  if (node && typeof node === "object") {
    return [node, ...(Array.isArray(node["@graph"]) ? node["@graph"].flatMap(flatten) : [])];
  }
  return [];
}

let failures = 0;
const fail = (page, msg) => {
  failures += 1;
  console.log(`  FAIL ${page}: ${msg}`);
};

for (const path of PAGES) {
  const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const html = await res.text();
  console.log(`\n${path} — ${res.status}`);
  if (!res.ok) {
    fail(path, `HTTP ${res.status}`);
    continue;
  }

  const blocks = ldBlocks(html);
  if (blocks.length === 0) fail(path, "no ld+json blocks");

  const nodes = [];
  blocks.forEach((raw, i) => {
    try {
      nodes.push(...flatten(JSON.parse(raw)));
    } catch (err) {
      fail(path, `ld+json block ${i} does not parse: ${err.message}`);
    }
  });

  const types = nodes.flatMap((n) => (Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]));
  const medicalPages = nodes.filter((n) => n["@type"] === "MedicalWebPage");
  const persons = nodes.filter((n) => n["@type"] === "Person");
  const isProviderPage = path.startsWith("/providers/");

  console.log(`  ld+json blocks: ${blocks.length} · nodes: ${nodes.length}`);
  console.log(`  types: ${[...new Set(types)].filter(Boolean).join(", ")}`);

  if (!isProviderPage && medicalPages.length !== 1) {
    fail(path, `expected 1 MedicalWebPage, found ${medicalPages.length}`);
  }
  for (const mwp of medicalPages) {
    if (!mwp.lastReviewed) fail(path, "MedicalWebPage missing lastReviewed");
    const reviewedById = mwp.reviewedBy?.["@id"];
    if (!reviewedById) fail(path, "MedicalWebPage missing reviewedBy");
    else if (!nodes.some((n) => n["@id"] === reviewedById && n["@type"] === "Person")) {
      fail(path, `reviewedBy ${reviewedById} does not resolve to a Person node on the page`);
    }
  }

  const ryan = persons.find((p) => p.name === "Ryan Kent");
  const arora = persons.find((p) => (p.name || "").includes("Arora"));
  if (!ryan) fail(path, "no Person node for Ryan Kent");
  if (!arora) fail(path, "no Person node for Dr. Arora");
  for (const p of [ryan, arora].filter(Boolean)) {
    if (!p.jobTitle) fail(path, `${p.name} Person missing jobTitle`);
    if (!p.honorificSuffix) fail(path, `${p.name} Person missing honorificSuffix`);
    if (!p.hasCredential?.length) fail(path, `${p.name} Person missing hasCredential`);
    if (!p.affiliation?.["@id"]) fail(path, `${p.name} Person missing affiliation`);
  }

  // Visible byline: exactly one. Scripts are stripped first because the RSC flight
  // payload repeats server-rendered strings without rendering them twice.
  const visibleHtml = html.replace(/<script[\s\S]*?<\/script>/g, "");
  const bylineCount = (visibleHtml.match(/Clinically reviewed by/g) || []).length;
  const expectedByline = isProviderPage ? (path === "/providers/ryan" ? 1 : 0) : 1;
  if (bylineCount !== expectedByline) {
    fail(path, `expected ${expectedByline} visible byline(s), found ${bylineCount}`);
  }
  console.log(`  visible bylines: ${bylineCount}`);

  const sevenDays = html.match(/(seven|7) days a week/gi) || [];
  const npSeven = sevenDays.filter(() => /on site (seven|7) days/i.test(html));
  if (npSeven.length) fail(path, `"on site seven days a week" still present`);
  if (/Retatrutide/i.test(html)) fail(path, "Retatrutide is client-facing");
  if (/fresha\.com/i.test(html)) fail(path, "Fresha booking link present");
}

console.log(
  failures === 0
    ? "\nAll clinical authority checks passed."
    : `\n${failures} check(s) failed.`,
);
process.exit(failures === 0 ? 0 : 1);
