"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

type Category = "all" | "skincare" | "supplements" | "injectables" | "wellness";

type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  description: string;
  price: string;
  imageUrl: string;
  link?: string;
  linkType: "fullscript" | "skinscript" | "inoffice" | "request";
  popular?: boolean;
  tags?: string[];
};

const categories: { id: Category; name: string; icon: string }[] = [
  { id: "all", name: "All Products", icon: "🛍️" },
  { id: "skincare", name: "Skincare", icon: "✨" },
  { id: "supplements", name: "Supplements", icon: "💊" },
  { id: "injectables", name: "Injectable Kits", icon: "💉" },
  { id: "wellness", name: "Wellness", icon: "🌿" },
];

const products: Product[] = [
  // SKINCARE - Skinscript RX
  {
    id: "retinaldehyde",
    name: "Retinaldehyde Serum",
    brand: "Skinscript RX",
    category: "skincare",
    description: "Advanced vitamin A serum for anti-aging and cell renewal. Less irritating than retinol with faster results.",
    price: "$62",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    linkType: "skinscript",
    popular: true,
    tags: ["Anti-Aging", "Vitamin A"],
  },
  {
    id: "glycolic-cleanser",
    name: "Glycolic Cleanser",
    brand: "Skinscript RX",
    category: "skincare",
    description: "Daily exfoliating cleanser with 10% glycolic acid. Brightens and smooths skin texture.",
    price: "$38",
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    linkType: "skinscript",
    tags: ["Exfoliating", "Brightening"],
  },
  {
    id: "vitamin-c",
    name: "Vitamin C Serum 20%",
    brand: "Skinscript RX",
    category: "skincare",
    description: "Potent antioxidant serum for brightening, firming, and protecting against environmental damage.",
    price: "$58",
    imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
    linkType: "skinscript",
    popular: true,
    tags: ["Brightening", "Antioxidant"],
  },
  {
    id: "hydrating-mask",
    name: "Hydrating Enzyme Mask",
    brand: "Skinscript RX",
    category: "skincare",
    description: "Deeply hydrating mask with papaya enzymes for gentle exfoliation and moisture boost.",
    price: "$42",
    imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop",
    linkType: "skinscript",
    tags: ["Hydrating", "Enzyme"],
  },
  {
    id: "sunscreen-spf30",
    name: "Sheer Protection SPF 30",
    brand: "Skinscript RX",
    category: "skincare",
    description: "Lightweight, non-greasy mineral sunscreen. Perfect under makeup.",
    price: "$36",
    imageUrl: "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=400&h=400&fit=crop",
    linkType: "skinscript",
    tags: ["SPF", "Daily Use"],
  },
  {
    id: "peptide-eye",
    name: "Peptide Eye Cream",
    brand: "Skinscript RX",
    category: "skincare",
    description: "Firming eye cream with peptides to reduce fine lines, puffiness, and dark circles.",
    price: "$52",
    imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=400&fit=crop",
    linkType: "skinscript",
    tags: ["Eye Care", "Peptides"],
  },
  // SKINCARE - AnteAGE
  {
    id: "anteage-serum",
    name: "AnteAGE MD Serum",
    brand: "AnteAGE",
    category: "skincare",
    description: "Pro-healing serum with stem cell growth factors and cytokines for advanced skin rejuvenation.",
    price: "$180",
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop",
    linkType: "inoffice",
    popular: true,
    tags: ["Stem Cell", "Pro-Healing"],
  },
  {
    id: "anteage-accelerator",
    name: "AnteAGE MD Accelerator",
    brand: "AnteAGE",
    category: "skincare",
    description: "Powerful treatment accelerator with retinaldehyde and niacinamide for enhanced results.",
    price: "$180",
    imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop",
    linkType: "inoffice",
    tags: ["Accelerator", "Retinaldehyde"],
  },
  // SUPPLEMENTS - Fullscript
  {
    id: "vitamin-d3",
    name: "Vitamin D3 5000 IU",
    brand: "Fullscript",
    category: "supplements",
    description: "High-potency vitamin D3 for immune support, bone health, and mood regulation.",
    price: "$24",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    link: "https://us.fullscript.com/welcome/dglazier",
    linkType: "fullscript",
    tags: ["Immune", "Bone Health"],
  },
  {
    id: "omega-3",
    name: "Omega-3 Fish Oil",
    brand: "Fullscript",
    category: "supplements",
    description: "Pharmaceutical-grade fish oil for heart health, brain function, and inflammation support.",
    price: "$38",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
    link: "https://us.fullscript.com/welcome/dglazier",
    linkType: "fullscript",
    popular: true,
    tags: ["Heart", "Brain", "Anti-Inflammatory"],
  },
  {
    id: "probiotic",
    name: "Probiotic 50B",
    brand: "Fullscript",
    category: "supplements",
    description: "50 billion CFU multi-strain probiotic for gut health and immune support.",
    price: "$42",
    imageUrl: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
    link: "https://us.fullscript.com/welcome/dglazier",
    linkType: "fullscript",
    tags: ["Gut Health", "Immune"],
  },
  {
    id: "magnesium",
    name: "Magnesium Glycinate",
    brand: "Fullscript",
    category: "supplements",
    description: "Highly absorbable magnesium for sleep, muscle relaxation, and stress support.",
    price: "$28",
    imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop",
    link: "https://us.fullscript.com/welcome/dglazier",
    linkType: "fullscript",
    tags: ["Sleep", "Stress", "Muscle"],
  },
  {
    id: "collagen",
    name: "Collagen Peptides",
    brand: "Fullscript",
    category: "supplements",
    description: "Hydrolyzed collagen peptides for skin elasticity, joint health, and hair growth.",
    price: "$45",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
    link: "https://us.fullscript.com/welcome/dglazier",
    linkType: "fullscript",
    popular: true,
    tags: ["Skin", "Joints", "Hair"],
  },
  {
    id: "b-complex",
    name: "B-Complex Plus",
    brand: "Fullscript",
    category: "supplements",
    description: "Complete B vitamin complex for energy, metabolism, and nervous system support.",
    price: "$26",
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop",
    link: "https://us.fullscript.com/welcome/dglazier",
    linkType: "fullscript",
    tags: ["Energy", "Metabolism"],
  },
  // INJECTABLES - Olympia
  {
    id: "semaglutide-kit",
    name: "Semaglutide Injection Kit",
    brand: "Olympia Pharmacy",
    category: "injectables",
    description: "Monthly weight loss injection kit with supplies. Prescription required after consultation.",
    price: "Starting at $299/mo",
    imageUrl: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop",
    linkType: "request",
    popular: true,
    tags: ["Weight Loss", "GLP-1"],
  },
  {
    id: "tirzepatide-kit",
    name: "Tirzepatide Injection Kit",
    brand: "Olympia Pharmacy",
    category: "injectables",
    description: "Premium dual-action GLP-1/GIP weight loss injection kit. Prescription required.",
    price: "Starting at $399/mo",
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=400&fit=crop",
    linkType: "request",
    tags: ["Weight Loss", "GLP-1/GIP"],
  },
  {
    id: "b12-kit",
    name: "B12 Injection Kit (10 doses)",
    brand: "Olympia Pharmacy",
    category: "injectables",
    description: "At-home B12 injection kit with 10 doses for energy and metabolism support.",
    price: "$150",
    imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop",
    linkType: "request",
    tags: ["Energy", "B12"],
  },
  {
    id: "lipo-kit",
    name: "MIC/Lipo Injection Kit",
    brand: "Olympia Pharmacy",
    category: "injectables",
    description: "Fat-burning lipotropic injection kit for enhanced weight loss and metabolism.",
    price: "$125",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop",
    linkType: "request",
    tags: ["Weight Loss", "Lipotropic"],
  },
  // WELLNESS
  {
    id: "glutathione-oral",
    name: "Liposomal Glutathione",
    brand: "Fullscript",
    category: "wellness",
    description: "Highly absorbable oral glutathione for detox, skin brightening, and immune support.",
    price: "$58",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
    link: "https://us.fullscript.com/welcome/dglazier",
    linkType: "fullscript",
    tags: ["Detox", "Skin", "Immune"],
  },
  {
    id: "nad-supplement",
    name: "NAD+ Precursor",
    brand: "Fullscript",
    category: "wellness",
    description: "Oral NAD+ support for cellular energy, anti-aging, and cognitive function.",
    price: "$65",
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=400&fit=crop",
    link: "https://us.fullscript.com/welcome/dglazier",
    linkType: "fullscript",
    popular: true,
    tags: ["Anti-Aging", "Energy", "Brain"],
  },
  {
    id: "sleep-support",
    name: "Sleep Support Complex",
    brand: "Fullscript",
    category: "wellness",
    description: "Natural sleep aid with melatonin, magnesium, and calming herbs.",
    price: "$32",
    imageUrl: "https://images.unsplash.com/photo-1515894203077-9cd36032142f?w=400&h=400&fit=crop",
    link: "https://us.fullscript.com/welcome/dglazier",
    linkType: "fullscript",
    tags: ["Sleep", "Relaxation"],
  },
];

export function ShopContent() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleOrderRequest = (product: Product) => {
    setOrderProduct(product);
    setShowOrderForm(true);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    
    // In production, this would send to your backend
    console.log("Order request:", { product: orderProduct, ...formData });
    
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1000));
    setFormStatus("sent");
  };

  const getButtonText = (linkType: string) => {
    switch (linkType) {
      case "fullscript":
        return "Shop on Fullscript";
      case "skinscript":
        return "Request to Order";
      case "inoffice":
        return "Available In-Office";
      case "request":
        return "Request Consultation";
      default:
        return "Learn More";
    }
  };

  const getButtonAction = (product: Product) => {
    if (product.linkType === "fullscript" && product.link) {
      return { href: product.link, external: true };
    }
    return { onClick: () => handleOrderRequest(product) };
  };

  return (
    <>
      {/* Hero */}
      <Section className="relative py-20 bg-gradient-to-b from-pink-950/30 via-purple-950/20 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium mb-4">
              🛍️ Professional Products
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Shop{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Hello Gorgeous
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Professional-grade skincare, supplements, and wellness products.
              Curated by our providers, delivered to your door.
            </p>
            
            {/* Payment badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-pink-400">✓</span>
                <span className="text-white text-sm">Free Shipping $75+</span>
              </div>
              <a
                href="https://pay.withcherry.com/hellogorgeous"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 transition"
              >
                <span>🍒</span>
                <span className="text-pink-400 text-sm font-medium">Buy Now, Pay Later with Cherry</span>
              </a>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Quick Links */}
      <Section className="py-8 bg-black border-b border-white/10">
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
          <a
            href="https://us.fullscript.com/welcome/dglazier"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-center hover:bg-fuchsia-500/20 transition"
          >
            <span className="text-2xl mb-2 block">💊</span>
            <span className="text-white font-medium text-sm">Shop Fullscript</span>
            <span className="text-fuchsia-400 text-xs block">Supplements</span>
          </a>
          <a
            href="https://pay.withcherry.com/hellogorgeous"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/30 text-center hover:bg-pink-500/20 transition"
          >
            <span className="text-2xl mb-2 block">🍒</span>
            <span className="text-white font-medium text-sm">Cherry Financing</span>
            <span className="text-pink-400 text-xs block">Pay Over Time</span>
          </a>
          <a
            href="tel:630-636-6193"
            className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center hover:bg-blue-500/20 transition"
          >
            <span className="text-2xl mb-2 block">📞</span>
            <span className="text-white font-medium text-sm">Call to Order</span>
            <span className="text-blue-400 text-xs block">630-636-6193</span>
          </a>
        </div>
      </Section>

      {/* Categories */}
      <Section className="py-6 bg-black sticky top-16 z-30 border-b border-white/10">
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
        </div>
      </Section>

      {/* Products Grid */}
      <Section className="py-12 bg-gradient-to-b from-black to-pink-950/5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, i) => {
            const action = getButtonAction(product);
            return (
              <FadeUp key={product.id} delayMs={i * 30}>
                <div className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/30 transition h-full flex flex-col">
                  {product.popular && (
                    <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-medium">
                      Popular
                    </span>
                  )}
                  
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <p className="text-pink-400 text-xs font-medium mb-1">{product.brand}</p>
                      <h3 className="text-white font-semibold mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-2">{product.description}</p>
                      {product.tags && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full bg-white/5 text-gray-500 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto">
                      <p className="text-white font-bold text-lg mb-3">{product.price}</p>
                      {"href" in action ? (
                        <a
                          href={action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium text-center text-sm hover:opacity-90 transition"
                        >
                          {getButtonText(product.linkType)} →
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={action.onClick}
                          className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium text-sm hover:bg-white/20 transition"
                        >
                          {getButtonText(product.linkType)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </Section>

      {/* Brand Partners */}
      <Section className="py-12 bg-black border-t border-white/10">
        <FadeUp>
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Our Product Partners</h3>
            <p className="text-gray-400 text-sm">
              Professional-grade products from trusted brands
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Skinscript RX", desc: "Medical-Grade Skincare", icon: "✨" },
              { name: "Fullscript", desc: "Professional Supplements", icon: "💊" },
              { name: "AnteAGE", desc: "Stem Cell Science", icon: "🧬" },
              { name: "Olympia Pharmacy", desc: "Compounded Medications", icon: "🏥" },
            ].map((brand) => (
              <div
                key={brand.name}
                className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
              >
                <span className="text-3xl mb-2 block">{brand.icon}</span>
                <p className="text-white font-semibold">{brand.name}</p>
                <p className="text-gray-500 text-sm">{brand.desc}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </Section>

      {/* Cherry Financing Banner */}
      <Section className="py-12 bg-gradient-to-r from-pink-950/30 to-purple-950/30">
        <FadeUp>
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-4xl mb-4 block">🍒</span>
            <h2 className="text-2xl font-bold text-white mb-3">
              Buy Now, Pay Later with Cherry
            </h2>
            <p className="text-gray-400 mb-6">
              Split your purchase into easy monthly payments. Quick approval, no hard credit check.
              Available for products and treatments.
            </p>
            <a
              href="https://pay.withcherry.com/hellogorgeous"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold hover:opacity-90 transition"
            >
              Apply for Cherry Financing →
            </a>
          </div>
        </FadeUp>
      </Section>

      {/* CTA */}
      <Section className="py-16 bg-black">
        <FadeUp>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Product Recommendations?
            </h2>
            <p className="text-gray-400 mb-6">
              Not sure which products are right for you? Book a consultation and
              our providers will create a personalized regimen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 transition"
              >
                Book Consultation →
              </a>
              <a
                href="tel:630-636-6193"
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition"
              >
                📞 630-636-6193
              </a>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Order Request Modal */}
      {showOrderForm && orderProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-gray-900 rounded-3xl overflow-hidden border border-white/10">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">Request to Order</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowOrderForm(false);
                    setFormStatus("idle");
                    setFormData({ name: "", email: "", phone: "", message: "" });
                  }}
                  className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {formStatus === "sent" ? (
                <div className="text-center py-8">
                  <span className="text-5xl mb-4 block">✅</span>
                  <h4 className="text-white font-bold text-xl mb-2">Request Sent!</h4>
                  <p className="text-gray-400">
                    We&apos;ll contact you within 24 hours to complete your order.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 mb-6">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={orderProduct.imageUrl}
                        alt={orderProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-pink-400 text-xs">{orderProduct.brand}</p>
                      <p className="text-white font-semibold">{orderProduct.name}</p>
                      <p className="text-white font-bold">{orderProduct.price}</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                      <label className="text-white text-sm font-medium block mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium block mb-1">Phone</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                        placeholder="(630) 555-1234"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium block mb-1">Message (optional)</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none resize-none"
                        placeholder="Any questions or special requests?"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={formStatus === "sending"}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 transition disabled:opacity-50"
                    >
                      {formStatus === "sending" ? "Sending..." : "Submit Order Request"}
                    </button>
                    
                    <p className="text-gray-500 text-xs text-center">
                      We&apos;ll contact you to confirm availability and process payment.
                      Cherry financing available.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-gray-900 rounded-3xl overflow-hidden border border-white/10">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
            >
              ✕
            </button>
            <div className="relative aspect-square">
              <Image
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <p className="text-pink-400 text-sm font-medium mb-1">{selectedProduct.brand}</p>
              <h3 className="text-white font-bold text-xl mb-2">{selectedProduct.name}</h3>
              <p className="text-gray-400 mb-4">{selectedProduct.description}</p>
              <p className="text-white font-bold text-2xl mb-4">{selectedProduct.price}</p>
              
              {selectedProduct.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProduct.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {selectedProduct.linkType === "fullscript" && selectedProduct.link ? (
                <a
                  href={selectedProduct.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-center hover:opacity-90 transition"
                >
                  Shop on Fullscript →
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(null);
                    handleOrderRequest(selectedProduct);
                  }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-center hover:opacity-90 transition"
                >
                  Request to Order →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
