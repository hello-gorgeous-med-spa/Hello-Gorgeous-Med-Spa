import { readFile } from "fs/promises";
import path from "path";

/** Staff + client under-eye consult. Served as Danielle’s HTML, unchanged except the browser title. */
export async function GET() {
  const html = await readFile(path.join(process.cwd(), "public/consults/puffy-eyes.html"), "utf8");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
