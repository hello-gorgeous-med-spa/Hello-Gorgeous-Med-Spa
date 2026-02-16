import Link from "next/link";

import { CTA } from "@/components/CTA";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-24">
      <section className="w-full max-w-4xl fade-up is-visible">
        <div className="rounded-2xl border border-black bg-gradient-to-b from-gray-950/60 to-black p-6 md:p-10">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
            <div className="text-center md:text-left md:max-w-md">
              <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-pink-500">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/10 border border-pink-500/30">
                  ?
                </span>
                404
              </p>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
                Page Not Found
              </h1>
              <p className="mt-5 text-black">
                Oops! The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back
                on track.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start fade-up is-visible fade-delay-1">
                <CTA href="/" variant="gradient">
                  Go Home
                </CTA>
                <CTA href="/services" variant="outline">
                  Explore Services
                </CTA>
              </div>
            </div>

            <div className="w-full max-w-md fade-up is-visible fade-delay-2">
              <div className="rounded-2xl border border-black bg-black/40 p-5">
                <div className="h-48 rounded-xl bg-gradient-to-br from-pink-500/15 via-pink-500/10 to-black float-slow" />
              </div>
              <p className="mt-3 text-center text-sm text-black">
                Not sure where to go? Start with services.
              </p>
              <p className="mt-2 text-center text-sm text-black">
                Or head to <Link className="underline" href="/contact">Contact</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

