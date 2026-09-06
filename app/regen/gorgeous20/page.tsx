import { headers } from "next/headers";
import { redirect } from "next/navigation";

/** Old launch-kit URL — GORGEOUS20 is now the homepage ticker + popup. */
export default async function Gorgeous20Redirect() {
  const host = (await headers()).get("host") || "";
  if (host.includes("tryregenrx.com")) {
    redirect("/");
  }
  redirect("/regen");
}
