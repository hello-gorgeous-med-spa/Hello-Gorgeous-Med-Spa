"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

type Category = "all" | "injectables" | "skin" | "hormones" | "wellness" | "news";

type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: Category;
  source: string;
  sourceUrl: string;
  imageUrl: string;
  isExternal: boolean;
  isFeatured?: boolean;
  date: string;
  readTime?: string;
  videoId?: string; // YouTube video ID
};

const categories: { id: Category; name: string; icon: string; color: string }[] = [
  { id: "all", name: "All", icon: "📚", color: "pink" },
  { id: "injectables", name: "Injectables", icon: "💉", color: "pink" },
  { id: "skin", name: "Skin Rejuvenation", icon: "✨", color: "purple" },
  { id: "hormones", name: "Hormone Health", icon: "⚖️", color: "amber" },
  { id: "wellness", name: "Wellness", icon: "💊", color: "fuchsia" },
  { id: "news", name: "Spa News", icon: "📰", color: "blue" },
];

const articles: Article[] = [
  // INJECTABLES - Allergan
  {
    id: "botox-how-it-works",
    title: "How BOTOX® Cosmetic Works",
    excerpt:
      "Learn how BOTOX® temporarily reduces muscle activity to smooth moderate to severe frown lines, crow&apos;s feet, and forehead lines.",
    category: "injectables",
    source: "Allergan",
    sourceUrl: "https://www.botoxcosmetic.com/how-botox-cosmetic-works",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop",
    isExternal: true,
    isFeatured: true,
    date: "2024-01-15",
    readTime: "5 min",
  },
  {
    id: "juvederm-collection",
    title: "The JUVÉDERM® Collection of Fillers",
    excerpt:
      "Discover the #1 dermal filler collection in the US. Different formulations for lips, cheeks, chin, and more.",
    category: "injectables",
    source: "Allergan",
    sourceUrl: "https://www.juvederm.com/",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop",
    isExternal: true,
    date: "2024-01-10",
    readTime: "4 min",
  },
  {
    id: "alle-rewards",
    title: "Allē Rewards: Save on Your Favorite Treatments",
    excerpt:
      "Join Allē and earn points on Allergan Aesthetics treatments. Redeem for savings on BOTOX®, JUVÉDERM®, and more.",
    category: "injectables",
    source: "Allergan",
    sourceUrl: "https://alle.com/",
    imageUrl: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=400&fit=crop",
    isExternal: true,
    date: "2024-01-05",
    readTime: "3 min",
  },
  // INJECTABLES - Revanesse
  {
    id: "revanesse-versa",
    title: "Revanesse® Versa™: The Versatile Filler",
    excerpt:
      "A premium hyaluronic acid filler designed for smooth, natural-looking results with less swelling.",
    category: "injectables",
    source: "Revanesse",
    sourceUrl: "https://revanesse.com/versa/",
    imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=400&fit=crop",
    isExternal: true,
    date: "2024-01-08",
    readTime: "4 min",
  },
  {
    id: "revanesse-lips",
    title: "Revanesse® Lips™: Perfect Your Pout",
    excerpt:
      "Specifically designed for lip augmentation with a smooth, natural feel and beautiful results.",
    category: "injectables",
    source: "Revanesse",
    sourceUrl: "https://revanesse.com/lips/",
    imageUrl: "https://images.unsplash.com/photo-1588006173527-6fa1e8b00d53?w=600&h=400&fit=crop",
    isExternal: true,
    date: "2024-01-03",
    readTime: "3 min",
  },
  // SKIN - AnteAGE
  {
    id: "anteage-exosomes",
    title: "The Science of Exosomes in Skincare",
    excerpt:
      "Discover how AnteAGE MD harnesses stem cell-derived growth factors and exosomes for skin rejuvenation.",
    category: "skin",
    source: "AnteAGE",
    sourceUrl: "https://anteage.com/pages/the-science",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop",
    isExternal: true,
    isFeatured: true,
    date: "2024-01-12",
    readTime: "6 min",
  },
  {
    id: "anteage-md-system",
    title: "AnteAGE MD: Professional Skincare System",
    excerpt:
      "Learn about the complete AnteAGE MD system including serums, brightening solutions, and microneedling protocols.",
    category: "skin",
    source: "AnteAGE",
    sourceUrl: "https://anteage.com/collections/anteage-md",
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop",
    isExternal: true,
    date: "2024-01-06",
    readTime: "5 min",
  },
  {
    id: "prp-vs-prf",
    title: "PRP vs PRF: What&apos;s the Difference?",
    excerpt:
      "Understanding platelet-rich plasma and platelet-rich fibrin treatments for skin rejuvenation and hair restoration.",
    category: "skin",
    source: "Hello Gorgeous Med Spa",
    sourceUrl: "/blog",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    isExternal: false,
    date: "2024-01-14",
    readTime: "7 min",
  },
  // HORMONES - Biote
  {
    id: "biote-hormone-optimization",
    title: "Bioidentical Hormone Replacement Therapy",
    excerpt:
      "Learn how Biote pellet therapy can help restore hormonal balance for both men and women.",
    category: "hormones",
    source: "Biote",
    sourceUrl: "https://biote.com/patients/what-is-hormone-optimization",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    isExternal: true,
    isFeatured: true,
    date: "2024-01-11",
    readTime: "6 min",
  },
  {
    id: "biote-symptoms",
    title: "Signs of Hormonal Imbalance",
    excerpt:
      "Fatigue, weight gain, mood changes? These could be signs of hormonal imbalance. Take the symptom checker.",
    category: "hormones",
    source: "Biote",
    sourceUrl: "https://biote.com/patients/symptoms",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    isExternal: true,
    date: "2024-01-04",
    readTime: "4 min",
  },
  {
    id: "testosterone-women",
    title: "Testosterone Therapy for Women",
    excerpt:
      "Why testosterone matters for women&apos;s health, energy, libido, and overall well-being.",
    category: "hormones",
    source: "Biote",
    sourceUrl: "https://biote.com/patients/testosterone-for-women",
    imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&h=400&fit=crop",
    isExternal: true,
    date: "2024-01-02",
    readTime: "5 min",
  },
  // WELLNESS - Fullscript & Weight Loss
  {
    id: "fullscript-supplements",
    title: "Professional-Grade Supplements",
    excerpt:
      "Access practitioner-only supplements through our Fullscript dispensary. Quality you can trust.",
    category: "wellness",
    source: "Fullscript",
    sourceUrl: "https://us.fullscript.com/welcome/dglazier",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop",
    isExternal: true,
    date: "2024-01-09",
    readTime: "3 min",
  },
  {
    id: "glp1-weight-loss",
    title: "GLP-1 Medications: How They Work for Weight Loss",
    excerpt:
      "Understanding semaglutide and tirzepatide—the science behind these revolutionary weight loss medications.",
    category: "wellness",
    source: "Hello Gorgeous Med Spa",
    sourceUrl: "/blog",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    isExternal: false,
    isFeatured: true,
    date: "2024-01-13",
    readTime: "8 min",
  },
  {
    id: "vitamin-injections",
    title: "The Benefits of Vitamin Injections",
    excerpt:
      "B12, glutathione, biotin, and more—why injections deliver better results than oral supplements.",
    category: "wellness",
    source: "Hello Gorgeous Med Spa",
    sourceUrl: "/blog",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=400&fit=crop",
    isExternal: false,
    date: "2024-01-07",
    readTime: "5 min",
  },
  {
    id: "peptide-therapy",
    title: "Peptide Therapy: The Future of Wellness",
    excerpt:
      "From BPC-157 to CJC/Ipamorelin—how peptides can support healing, anti-aging, and performance.",
    category: "wellness",
    source: "Hello Gorgeous Med Spa",
    sourceUrl: "/blog",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop",
    isExternal: false,
    date: "2024-01-01",
    readTime: "6 min",
  },
  // NEWS
  {
    id: "welcome-oswego",
    title: "Hello Gorgeous Med Spa: Now Open in Oswego!",
    excerpt:
      "We&apos;re thrilled to bring luxury medical aesthetics to Oswego, IL. Meet our team and learn about our services.",
    category: "news",
    source: "Hello Gorgeous Med Spa",
    sourceUrl: "/blog",
    imageUrl: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&h=400&fit=crop",
    isExternal: false,
    isFeatured: true,
    date: "2024-01-15",
    readTime: "4 min",
  },
  {
    id: "botox-party",
    title: "Host a Botox + Besties Party!",
    excerpt:
      "We come to you! Exclusive pricing: $10/unit Botox, $99 Lip Flip, $499 Filler. Perfect for girls&apos; night.",
    category: "news",
    source: "Hello Gorgeous Med Spa",
    sourceUrl: "/botox-party",
    imageUrl: "https://images.unsplash.com/photo-1529543544277-750e2865e8d0?w=600&h=400&fit=crop",
    isExternal: false,
    date: "2024-01-10",
    readTime: "3 min",
  },
];

// Featured videos from brand YouTube channels
const featuredVideos = [
  {
    id: "botox-video",
    title: "BOTOX® Cosmetic: Real Results",
    source: "Allergan",
    videoId: "4BvwpjaGZCQ",
    category: "injectables",
  },
  {
    id: "biote-video",
    title: "What is Biote Hormone Therapy?",
    source: "Biote",
    videoId: "hxPnZSG5bWA",
    category: "hormones",
  },
  {
    id: "anteage-video",
    title: "AnteAGE MD: The Science of Stem Cells",
    source: "AnteAGE",
    videoId: "Wz4Z_vFVGkU",
    category: "skin",
  },
];

export function BlogContent() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [showVideos, setShowVideos] = useState(false);

  const filteredArticles =
    activeCategory === "all"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const featuredArticles = filteredArticles.filter((a) => a.isFeatured);
  const regularArticles = filteredArticles.filter((a) => !a.isFeatured);

  const filteredVideos =
    activeCategory === "all"
      ? featuredVideos
      : featuredVideos.filter((v) => v.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <Section className="relative py-16 bg-gradient-to-b from-pink-950/30 to-black">
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium mb-4">
              📚 Educational Resources
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blog &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Resources
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Expert insights on aesthetics, wellness, and beauty from our trusted
              partners and the Hello Gorgeous team.
            </p>
          </div>
        </FadeUp>
      </Section>

      {/* Categories */}
      <Section className="py-8 bg-black border-b border-white/10 sticky top-16 z-30">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-pink-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowVideos(!showVideos)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              showVideos
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            🎬 Videos
          </button>
        </div>
      </Section>

      {/* Videos Section */}
      {showVideos && filteredVideos.length > 0 && (
        <Section className="py-12 bg-gradient-to-b from-black to-purple-950/10">
          <FadeUp>
            <h2 className="text-2xl font-bold text-white mb-6">
              🎬 Featured Videos
            </h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => (
              <FadeUp key={video.id} delayMs={index * 60}>
                <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-white font-semibold">{video.title}</p>
                    <p className="text-gray-500 text-sm">Source: {video.source}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </Section>
      )}

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <Section className="py-12 bg-black">
          <FadeUp>
            <h2 className="text-2xl font-bold text-white mb-6">⭐ Featured</h2>
          </FadeUp>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredArticles.map((article, index) => (
              <FadeUp key={article.id} delayMs={index * 60}>
                <a
                  href={article.sourceUrl}
                  target={article.isExternal ? "_blank" : "_self"}
                  rel={article.isExternal ? "noopener noreferrer" : undefined}
                  className="group block bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl overflow-hidden border border-pink-500/20 hover:border-pink-500/40 transition"
                >
                  <div className="relative aspect-[2/1] overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/70 text-pink-400 text-xs font-medium">
                        {categories.find((c) => c.id === article.category)?.icon}{" "}
                        {categories.find((c) => c.id === article.category)?.name}
                      </span>
                      {article.isExternal && (
                        <span className="px-3 py-1 rounded-full bg-black/70 text-gray-400 text-xs">
                          ↗ {article.source}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.date}</span>
                      {article.readTime && <span>{article.readTime} read</span>}
                    </div>
                  </div>
                </a>
              </FadeUp>
            ))}
          </div>
        </Section>
      )}

      {/* All Articles */}
      <Section className="py-12 bg-gradient-to-b from-black to-pink-950/5">
        <FadeUp>
          <h2 className="text-2xl font-bold text-white mb-6">
            📖 All{" "}
            {activeCategory !== "all" &&
              categories.find((c) => c.id === activeCategory)?.name}{" "}
            Articles
          </h2>
        </FadeUp>

        {regularArticles.length === 0 && featuredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No articles in this category yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article, index) => (
              <FadeUp key={article.id} delayMs={index * 40}>
                <a
                  href={article.sourceUrl}
                  target={article.isExternal ? "_blank" : "_self"}
                  rel={article.isExternal ? "noopener noreferrer" : undefined}
                  className="group block bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-pink-500/30 transition h-full"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    {article.isExternal && (
                      <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/70 text-gray-400 text-xs">
                        ↗ {article.source}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-pink-400">
                        {categories.find((c) => c.id === article.category)?.icon}
                      </span>
                      <span className="text-xs text-gray-500">{article.date}</span>
                    </div>
                    <h3 className="text-white font-semibold group-hover:text-pink-400 transition mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </a>
              </FadeUp>
            ))}
          </div>
        )}
      </Section>

      {/* Partner Logos */}
      <Section className="py-12 bg-black border-t border-white/10">
        <FadeUp>
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">
              Trusted Partners & Sources
            </h3>
            <p className="text-gray-500 text-sm">
              Educational content curated from industry leaders
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["Allergan", "Revanesse", "AnteAGE", "Biote", "Fullscript"].map(
              (partner) => (
                <span
                  key={partner}
                  className="text-gray-400 font-semibold text-lg"
                >
                  {partner}
                </span>
              )
            )}
          </div>
        </FadeUp>
      </Section>

      {/* CTA */}
      <Section className="py-16 bg-gradient-to-b from-black to-pink-950/20">
        <FadeUp>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Have Questions?
            </h2>
            <p className="text-gray-400 mb-6">
              Our team is here to help you understand which treatments are right
              for you. Book a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold hover:opacity-90 transition"
              >
                Book Free Consultation →
              </a>
              <a
                href="tel:630-636-6193"
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition"
              >
                📞 Call 630-636-6193
              </a>
            </div>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
