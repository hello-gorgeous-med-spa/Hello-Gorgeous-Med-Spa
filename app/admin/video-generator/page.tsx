"use client";

import { useState, useEffect, useRef } from "react";

interface VideoTemplate {
  id: string;
  name: string;
  description: string;
}

interface TemplateVariant {
  id: string;
  name: string;
  style: string;
  thumbnail: string;
  description: string;
  hook: string;
  pacing: "slow" | "medium" | "fast";
  mood: string;
}

const TEMPLATE_VARIANTS: Record<string, TemplateVariant[]> = {
  solaria: [
    { id: "solaria-a", name: "Elegant Reveal", style: "luxury", thumbnail: "🌟", description: "Dramatic reveal with luxury aesthetics", hook: "Premium transformation", pacing: "slow", mood: "Sophisticated" },
    { id: "solaria-b", name: "Before/After Focus", style: "clean", thumbnail: "📸", description: "Emphasizes real results", hook: "See the difference", pacing: "medium", mood: "Trustworthy" },
    { id: "solaria-c", name: "Tech Forward", style: "energetic", thumbnail: "⚡", description: "Highlights technology & innovation", hook: "Cutting-edge treatment", pacing: "fast", mood: "Exciting" },
  ],
  botox: [
    { id: "botox-a", name: "Quick & Easy", style: "minimal", thumbnail: "✨", description: "Emphasizes convenience", hook: "15 minutes to gorgeous", pacing: "fast", mood: "Effortless" },
    { id: "botox-b", name: "Natural Beauty", style: "clean", thumbnail: "🌸", description: "Natural-looking results", hook: "Enhance your natural beauty", pacing: "medium", mood: "Authentic" },
    { id: "botox-c", name: "VIP Experience", style: "luxury", thumbnail: "💎", description: "Premium service feel", hook: "The VIP treatment", pacing: "slow", mood: "Exclusive" },
  ],
  morpheus8: [
    { id: "morpheus8-a", name: "Science Focus", style: "clean", thumbnail: "🔬", description: "RF technology explained", hook: "Science meets beauty", pacing: "medium", mood: "Educational" },
    { id: "morpheus8-b", name: "Transformation", style: "energetic", thumbnail: "🔥", description: "Dramatic before/after", hook: "Total transformation", pacing: "fast", mood: "Powerful" },
    { id: "morpheus8-c", name: "Luxe Clinic", style: "luxury", thumbnail: "✨", description: "High-end spa experience", hook: "Luxury skin treatment", pacing: "slow", mood: "Premium" },
  ],
  weightloss: [
    { id: "weightloss-a", name: "Journey Story", style: "clean", thumbnail: "🏃", description: "Personal transformation narrative", hook: "Start your journey", pacing: "medium", mood: "Inspiring" },
    { id: "weightloss-b", name: "Medical Authority", style: "minimal", thumbnail: "👩‍⚕️", description: "Physician-supervised emphasis", hook: "Doctor-approved", pacing: "slow", mood: "Trustworthy" },
    { id: "weightloss-c", name: "Results Driven", style: "energetic", thumbnail: "📊", description: "Stats and success stories", hook: "Real results, real fast", pacing: "fast", mood: "Motivating" },
  ],
  fillers: [
    { id: "fillers-a", name: "Subtle Enhancement", style: "clean", thumbnail: "💋", description: "Natural-looking results", hook: "Enhance, don't change", pacing: "medium", mood: "Natural" },
    { id: "fillers-b", name: "Glam Up", style: "luxury", thumbnail: "💄", description: "Bold, glamorous results", hook: "Red carpet ready", pacing: "fast", mood: "Glamorous" },
    { id: "fillers-c", name: "Expert Hands", style: "minimal", thumbnail: "👐", description: "Focus on expert injection", hook: "Precision artistry", pacing: "slow", mood: "Professional" },
  ],
  prf: [
    { id: "prf-a", name: "Natural Regrowth", style: "clean", thumbnail: "🌱", description: "Natural healing process", hook: "Your body's own power", pacing: "medium", mood: "Organic" },
    { id: "prf-b", name: "Confidence Boost", style: "energetic", thumbnail: "💪", description: "Confidence transformation", hook: "Confidence restored", pacing: "fast", mood: "Empowering" },
  ],
  iv: [
    { id: "iv-a", name: "Wellness Focus", style: "clean", thumbnail: "💧", description: "Health and hydration", hook: "Feel amazing inside", pacing: "medium", mood: "Refreshing" },
    { id: "iv-b", name: "Energy Boost", style: "energetic", thumbnail: "⚡", description: "Energy and vitality", hook: "Instant energy", pacing: "fast", mood: "Energizing" },
  ],
  custom: [
    { id: "custom-a", name: "Professional", style: "clean", thumbnail: "📋", description: "Clean professional look", hook: "Custom hook", pacing: "medium", mood: "Professional" },
    { id: "custom-b", name: "Bold", style: "energetic", thumbnail: "🎯", description: "High energy appeal", hook: "Custom hook", pacing: "fast", mood: "Bold" },
    { id: "custom-c", name: "Elegant", style: "luxury", thumbnail: "✨", description: "Luxury feel", hook: "Custom hook", pacing: "slow", mood: "Elegant" },
  ],
};

interface GeneratedVideo {
  id: string;
  name: string;
  service: string;
  format: string;
  createdAt: string;
  status: "pending" | "rendering" | "completed" | "failed";
  url?: string;
  caption?: string;
  voiceoverUrl?: string;
}

interface VoicePreset {
  id: string;
  name: string;
  description: string;
}

const VOICE_PRESETS: VoicePreset[] = [
  { id: "rachel", name: "Rachel", description: "Calm, professional female" },
  { id: "bella", name: "Bella", description: "Warm, friendly female" },
  { id: "charlotte", name: "Charlotte", description: "Elegant, sophisticated female" },
  { id: "elli", name: "Elli", description: "Young, energetic female" },
  { id: "josh", name: "Josh", description: "Deep, authoritative male" },
  { id: "adam", name: "Adam", description: "Professional male" },
];

// Phase 3: Asset Library
interface Asset {
  id: string;
  name: string;
  type: "logo" | "background" | "overlay" | "photo";
  url: string;
  thumbnail?: string;
}

interface MusicTrack {
  id: string;
  name: string;
  mood: string;
  duration: string;
  bpm: number;
  preview?: string;
}

interface ExportPreset {
  id: string;
  name: string;
  description: string;
  settings: {
    format: string;
    quality: string;
    style: string;
    includeCaptions: boolean;
    includeMusic: boolean;
    voicePreset: string;
  };
}

const MUSIC_LIBRARY: MusicTrack[] = [
  { id: "upbeat-corporate", name: "Upbeat Corporate", mood: "Professional", duration: "2:30", bpm: 120 },
  { id: "gentle-spa", name: "Gentle Spa", mood: "Relaxing", duration: "3:00", bpm: 70 },
  { id: "modern-luxury", name: "Modern Luxury", mood: "Sophisticated", duration: "2:45", bpm: 90 },
  { id: "energetic-pop", name: "Energetic Pop", mood: "Exciting", duration: "2:15", bpm: 128 },
  { id: "calm-ambient", name: "Calm Ambient", mood: "Peaceful", duration: "3:30", bpm: 60 },
  { id: "inspiring-journey", name: "Inspiring Journey", mood: "Motivating", duration: "2:50", bpm: 100 },
  { id: "elegant-piano", name: "Elegant Piano", mood: "Elegant", duration: "3:15", bpm: 75 },
  { id: "trendy-social", name: "Trendy Social", mood: "Trendy", duration: "1:00", bpm: 115 },
];

const DEFAULT_PRESETS: ExportPreset[] = [
  {
    id: "instagram-reel",
    name: "Instagram Reel",
    description: "Optimized for Instagram Reels",
    settings: { format: "reel", quality: "high", style: "energetic", includeCaptions: true, includeMusic: true, voicePreset: "bella" },
  },
  {
    id: "facebook-ad",
    name: "Facebook Ad",
    description: "Professional Facebook video ad",
    settings: { format: "square", quality: "high", style: "clean", includeCaptions: true, includeMusic: true, voicePreset: "rachel" },
  },
  {
    id: "website-hero",
    name: "Website Hero",
    description: "Landscape for website headers",
    settings: { format: "landscape", quality: "ultra", style: "luxury", includeCaptions: false, includeMusic: true, voicePreset: "charlotte" },
  },
  {
    id: "tiktok-viral",
    name: "TikTok Viral",
    description: "Fast-paced TikTok style",
    settings: { format: "reel", quality: "standard", style: "energetic", includeCaptions: true, includeMusic: true, voicePreset: "elli" },
  },
  {
    id: "clinic-tour",
    name: "Clinic Tour",
    description: "Professional clinic showcase",
    settings: { format: "landscape", quality: "high", style: "clean", includeCaptions: false, includeMusic: true, voicePreset: "rachel" },
  },
];

// Phase 4: Analytics & Scheduling
interface VideoAnalytics {
  videoId: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagement: number;
  platform: string;
  postedAt: string;
}

interface ScheduledPost {
  id: string;
  videoId: string;
  videoName: string;
  platform: "instagram" | "facebook" | "tiktok" | "google";
  scheduledFor: string;
  status: "scheduled" | "posted" | "failed";
  caption?: string;
}

interface ContentSuggestion {
  id: string;
  title: string;
  description: string;
  service: string;
  reason: string;
  trending: boolean;
  seasonality?: string;
}

const MOCK_ANALYTICS: VideoAnalytics[] = [
  { videoId: "vid-1", views: 2450, likes: 187, shares: 23, comments: 45, engagement: 10.4, platform: "instagram", postedAt: "2026-03-08" },
  { videoId: "vid-2", views: 1820, likes: 134, shares: 18, comments: 28, engagement: 9.9, platform: "facebook", postedAt: "2026-03-05" },
  { videoId: "vid-3", views: 3200, likes: 298, shares: 56, comments: 72, engagement: 13.3, platform: "tiktok", postedAt: "2026-03-01" },
];

const AI_CONTENT_SUGGESTIONS: ContentSuggestion[] = [
  { id: "sug-1", title: "Spring Skin Refresh", description: "Highlight how Solaria CO2 preps skin for spring/summer", service: "solaria", reason: "Spring is peak season for skin renewal treatments", trending: true, seasonality: "Spring" },
  { id: "sug-2", title: "Wedding Season Botox", description: "Target brides and bridal parties with pre-wedding packages", service: "botox", reason: "Wedding season starting in April - high search volume", trending: true, seasonality: "Spring/Summer" },
  { id: "sug-3", title: "Summer Body Ready", description: "Weight loss journey before summer vacation season", service: "weightloss", reason: "New Year resolution follow-ups + summer prep", trending: false, seasonality: "Spring" },
  { id: "sug-4", title: "Lip Filler Myths Busted", description: "Educational content addressing common filler concerns", service: "fillers", reason: "Myth-busting content gets high engagement", trending: true },
  { id: "sug-5", title: "IV Hangover Cure", description: "Quick recovery IV therapy for party season", service: "iv", reason: "High search volume on weekends", trending: false },
  { id: "sug-6", title: "Morpheus8 vs Competitors", description: "Why Morpheus8 is the gold standard for skin tightening", service: "morpheus8", reason: "Comparison content drives decision-making", trending: true },
];

const OPTIMAL_POST_TIMES: Record<string, { day: string; time: string; engagement: string }[]> = {
  instagram: [
    { day: "Tuesday", time: "11:00 AM", engagement: "High" },
    { day: "Wednesday", time: "7:00 PM", engagement: "Very High" },
    { day: "Friday", time: "2:00 PM", engagement: "High" },
  ],
  facebook: [
    { day: "Wednesday", time: "1:00 PM", engagement: "Very High" },
    { day: "Thursday", time: "3:00 PM", engagement: "High" },
    { day: "Friday", time: "11:00 AM", engagement: "High" },
  ],
  tiktok: [
    { day: "Tuesday", time: "9:00 PM", engagement: "Very High" },
    { day: "Thursday", time: "7:00 PM", engagement: "Very High" },
    { day: "Saturday", time: "8:00 PM", engagement: "High" },
  ],
};

// Phase 5: Templates Gallery, Collaboration, A/B Testing, Hashtags
interface VideoTemplateGallery {
  id: string;
  name: string;
  thumbnail: string;
  service: string;
  style: string;
  views: number;
  engagement: number;
  likes: number;
  createdBy: string;
  createdAt: string;
  tags: string[];
}

interface CollaborationComment {
  id: string;
  author: string;
  avatar: string;
  message: string;
  timestamp: string;
  type: "comment" | "approval" | "revision";
}

interface ABTestResult {
  id: string;
  variantA: { name: string; views: number; engagement: number; conversions: number };
  variantB: { name: string; views: number; engagement: number; conversions: number };
  winner: "A" | "B" | "tie" | "ongoing";
  startDate: string;
  endDate?: string;
}

const TEMPLATE_GALLERY: VideoTemplateGallery[] = [
  { id: "gal-1", name: "Spring Botox Special", thumbnail: "💉", service: "botox", style: "clean", views: 12500, engagement: 8.7, likes: 890, createdBy: "Hello Gorgeous", createdAt: "2026-02-15", tags: ["spring", "special", "botox"] },
  { id: "gal-2", name: "Morpheus8 Transformation", thumbnail: "🔥", service: "morpheus8", style: "energetic", views: 18200, engagement: 12.3, likes: 1420, createdBy: "Hello Gorgeous", createdAt: "2026-01-20", tags: ["transformation", "skin", "trending"] },
  { id: "gal-3", name: "Weight Loss Journey", thumbnail: "🏃", service: "weightloss", style: "clean", views: 9800, engagement: 7.2, likes: 620, createdBy: "Hello Gorgeous", createdAt: "2026-02-28", tags: ["journey", "health", "semaglutide"] },
  { id: "gal-4", name: "Lip Filler Perfection", thumbnail: "💋", service: "fillers", style: "luxury", views: 22100, engagement: 15.1, likes: 2100, createdBy: "Hello Gorgeous", createdAt: "2026-01-05", tags: ["lips", "filler", "viral"] },
  { id: "gal-5", name: "Solaria CO2 Results", thumbnail: "✨", service: "solaria", style: "luxury", views: 8400, engagement: 9.8, likes: 710, createdBy: "Hello Gorgeous", createdAt: "2026-03-01", tags: ["laser", "results", "skincare"] },
  { id: "gal-6", name: "IV Therapy Energy", thumbnail: "⚡", service: "iv", style: "energetic", views: 5200, engagement: 6.4, likes: 340, createdBy: "Hello Gorgeous", createdAt: "2026-02-10", tags: ["energy", "wellness", "hydration"] },
];

const MOCK_COMMENTS: CollaborationComment[] = [
  { id: "c1", author: "Sarah", avatar: "👩‍⚕️", message: "Love this! Can we add the new pricing?", timestamp: "2 hours ago", type: "comment" },
  { id: "c2", author: "Manager", avatar: "👔", message: "Approved for posting", timestamp: "1 hour ago", type: "approval" },
];

const MOCK_AB_TESTS: ABTestResult[] = [
  { 
    id: "ab-1", 
    variantA: { name: "Quick & Easy Botox", views: 4500, engagement: 8.2, conversions: 12 },
    variantB: { name: "VIP Botox Experience", views: 4200, engagement: 11.5, conversions: 18 },
    winner: "B",
    startDate: "2026-02-20",
    endDate: "2026-03-06"
  },
  { 
    id: "ab-2", 
    variantA: { name: "Before/After Focus", views: 2100, engagement: 9.1, conversions: 5 },
    variantB: { name: "Tech Forward Style", views: 2300, engagement: 7.8, conversions: 4 },
    winner: "ongoing",
    startDate: "2026-03-08"
  },
];

const HASHTAG_SETS: Record<string, Record<string, string[]>> = {
  instagram: {
    botox: ["#botox", "#botoxlife", "#antiaging", "#wrinklefree", "#medspa", "#beautytips", "#skincare", "#botoxbabe", "#aesthetics", "#illinoismedspa"],
    fillers: ["#lipfiller", "#dermalfiller", "#fillers", "#lipinjections", "#juvederm", "#restylane", "#beautylips", "#medspalife", "#aestheticnurse", "#chicagomedspa"],
    morpheus8: ["#morpheus8", "#skinrejuvenation", "#microneedling", "#radiofrequency", "#skintreatment", "#antiagingskin", "#skintightening", "#glowingskin", "#medspatreatment"],
    weightloss: ["#weightloss", "#semaglutide", "#ozempic", "#weightlossjourney", "#healthylifestyle", "#bodytransformation", "#medicalweightloss", "#tirzepatide"],
    solaria: ["#co2laser", "#lasertreatment", "#skinresurfacing", "#laserskincare", "#fractional", "#skintexture", "#laserfacial", "#inmode"],
    iv: ["#ivtherapy", "#ivdrip", "#hydration", "#wellness", "#vitamins", "#immuneboost", "#energyboost", "#selfcare"],
    prf: ["#prf", "#hairrestoration", "#prfhair", "#naturalbeauty", "#hairgrowth", "#plateletrich", "#regrowth"],
  },
  tiktok: {
    botox: ["#botox", "#botoxcheck", "#medspatiktok", "#beautytok", "#antiaging", "#fyp", "#viral", "#beforeandafter"],
    fillers: ["#lipfiller", "#fillertok", "#lipscheck", "#beautytok", "#fyp", "#viral", "#medspa", "#glow"],
    morpheus8: ["#morpheus8", "#skintok", "#glow", "#skincare", "#fyp", "#trending", "#beforeafter"],
    weightloss: ["#weightlosstiktok", "#semaglutide", "#ozempic", "#transformationtok", "#fyp", "#viral"],
    solaria: ["#lasertreatment", "#skintok", "#skincare", "#fyp", "#trending", "#beforeafter"],
    iv: ["#ivtherapy", "#wellnesstok", "#selfcare", "#fyp", "#trending"],
    prf: ["#hairgrowth", "#prf", "#naturalbeauty", "#fyp"],
  },
  facebook: {
    botox: ["#Botox", "#AntiAging", "#MedSpa", "#OswegoIL", "#HelloGorgeous", "#BeautyTreatment"],
    fillers: ["#DermalFillers", "#LipFiller", "#MedSpa", "#OswegoIL", "#HelloGorgeous", "#Aesthetics"],
    morpheus8: ["#Morpheus8", "#SkinTightening", "#MedSpa", "#OswegoIL", "#HelloGorgeous"],
    weightloss: ["#WeightLoss", "#Semaglutide", "#HealthyLifestyle", "#OswegoIL", "#HelloGorgeous"],
    solaria: ["#LaserTreatment", "#Skincare", "#MedSpa", "#OswegoIL", "#HelloGorgeous"],
    iv: ["#IVTherapy", "#Wellness", "#OswegoIL", "#HelloGorgeous"],
    prf: ["#PRF", "#HairRestoration", "#OswegoIL", "#HelloGorgeous"],
  },
};

const SERVICE_TEMPLATES: VideoTemplate[] = [
  { id: "solaria", name: "Solaria CO2 Laser", description: "Fractional laser resurfacing promo" },
  { id: "botox", name: "Botox", description: "Anti-wrinkle treatment promo" },
  { id: "morpheus8", name: "Morpheus8", description: "RF microneedling promo" },
  { id: "weightloss", name: "Weight Loss", description: "Semaglutide/Tirzepatide promo" },
  { id: "fillers", name: "Dermal Fillers", description: "Lip & facial filler promo" },
  { id: "prf", name: "PRF Hair Restoration", description: "Hair regrowth promo" },
  { id: "iv", name: "IV Therapy", description: "Vitamin infusion promo" },
  { id: "custom", name: "Custom Service", description: "Create your own promo" },
];

const DEFAULT_BENEFITS: Record<string, string[]> = {
  solaria: ["Stimulates collagen production", "Reduces fine lines & wrinkles", "Improves skin texture", "Minimal downtime"],
  botox: ["Reduces fine lines & wrinkles", "Quick 15-minute treatment", "No downtime required", "Results last 3-4 months"],
  morpheus8: ["Tightens loose skin", "Reduces fat & cellulite", "Stimulates collagen", "Minimal downtime"],
  weightloss: ["FDA-approved medication", "Average 15-20% weight loss", "Reduces appetite naturally", "Physician supervised"],
  fillers: ["Instant volume restoration", "Smooths lines & wrinkles", "Enhances lips & cheeks", "Results last 12-18 months"],
  prf: ["Uses your own platelets", "Stimulates hair follicles", "No surgery required", "Natural-looking results"],
  iv: ["Immediate hydration", "Boost energy levels", "Enhance immunity", "Fast 30-45 min treatment"],
  custom: ["Benefit One", "Benefit Two", "Benefit Three", "Benefit Four"],
};

interface VideoScene {
  id: string;
  name: string;
  duration: string;
  textOnScreen: string;
  voiceoverScript: string;
}

const DEFAULT_SCENES: Record<string, VideoScene[]> = {
  solaria: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Introducing the future of skin rejuvenation." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Sun damage? Fine lines? Uneven texture?", voiceoverScript: "Tired of sun damage, fine lines, and uneven skin texture?" },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "SOLARIA CO2 LASER", voiceoverScript: "The Solaria CO2 Fractional Laser delivers dramatic results with minimal downtime." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Benefits appear one by one", voiceoverScript: "Stimulate collagen. Resurface skin. Reduce wrinkles. Improve texture." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "REAL RESULTS", voiceoverScript: "See the transformation for yourself." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "VIP LAUNCH SPECIAL $1,895", voiceoverScript: "Book now at our exclusive launch price of eighteen ninety-five." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa, Oswego Illinois. Call today." },
  ],
  botox: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Smooth away the years." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Wrinkles? Crow's feet? Frown lines?", voiceoverScript: "Don't let wrinkles define your look." },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "BOTOX", voiceoverScript: "Botox delivers natural-looking results in just fifteen minutes." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Quick • No Downtime • Natural", voiceoverScript: "Quick treatment. No downtime. Natural-looking results that last." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "REAL RESULTS", voiceoverScript: "Join thousands of satisfied clients." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "SPECIAL: $10/unit", voiceoverScript: "Now just ten dollars per unit." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa. Book your appointment today." },
  ],
  morpheus8: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Tighten. Contour. Transform." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Loose skin? Loss of definition?", voiceoverScript: "Is loose skin making you look older than you feel?" },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "MORPHEUS8", voiceoverScript: "Morpheus8 combines microneedling with radiofrequency for unmatched skin tightening." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Tightens • Contours • Rejuvenates", voiceoverScript: "Tighten loose skin. Reduce fat. Stimulate collagen naturally." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "REAL RESULTS", voiceoverScript: "See the dramatic transformation." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "VIP PRICING AVAILABLE", voiceoverScript: "Ask about our VIP pricing." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa. Call now." },
  ],
  weightloss: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Transform your body. Transform your life." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Struggling to lose weight?", voiceoverScript: "Tired of diets that don't work?" },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "MEDICAL WEIGHT LOSS", voiceoverScript: "Our physician-supervised weight loss program uses FDA-approved medication." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "15-20% Weight Loss Average", voiceoverScript: "Clients see an average of fifteen to twenty percent weight loss." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "REAL TRANSFORMATIONS", voiceoverScript: "Real people. Real results." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "NEW PATIENT SPECIAL", voiceoverScript: "Start your transformation today with our new patient special." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa. Your journey starts now." },
  ],
  fillers: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Restore. Enhance. Define." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Lost volume? Thin lips?", voiceoverScript: "Missing that youthful fullness?" },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "DERMAL FILLERS", voiceoverScript: "Premium dermal fillers restore volume and enhance your natural beauty." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Lips • Cheeks • Jawline", voiceoverScript: "Enhance lips. Define cheeks. Sculpt your jawline." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "STUNNING RESULTS", voiceoverScript: "See the difference expert injection makes." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "SPRING SPECIAL", voiceoverScript: "Ask about our current special offers." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa. Book your consultation." },
  ],
  prf: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Regrow your confidence." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Thinning hair? Receding hairline?", voiceoverScript: "Hair loss affecting your confidence?" },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "PRF HAIR RESTORATION", voiceoverScript: "PRF uses your own growth factors to stimulate natural hair regrowth." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Natural • Non-Surgical • Effective", voiceoverScript: "No surgery. No synthetic ingredients. Just your body's natural healing power." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "REAL REGROWTH", voiceoverScript: "See thicker, healthier hair." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "LIMITED TIME OFFER", voiceoverScript: "Book your treatment package today." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa. Restore your hair." },
  ],
  iv: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Feel amazing from the inside out." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Tired? Dehydrated? Run down?", voiceoverScript: "Feeling exhausted and run down?" },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "IV THERAPY", voiceoverScript: "IV Therapy delivers vitamins and hydration directly to your bloodstream." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Energy • Immunity • Recovery", voiceoverScript: "Boost energy. Strengthen immunity. Speed recovery." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "FEEL THE DIFFERENCE", voiceoverScript: "Feel revitalized in just thirty minutes." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "WELLNESS SPECIAL", voiceoverScript: "Try our most popular IV cocktail." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Hello Gorgeous Med Spa. Recharge today." },
  ],
  custom: [
    { id: "intro", name: "Intro", duration: "0-3s", textOnScreen: "HELLO GORGEOUS MED SPA", voiceoverScript: "Your intro voiceover here." },
    { id: "problem", name: "The Problem", duration: "3-7s", textOnScreen: "Problem statement here", voiceoverScript: "Describe the problem your service solves." },
    { id: "solution", name: "The Solution", duration: "7-12s", textOnScreen: "YOUR SERVICE NAME", voiceoverScript: "Introduce your solution." },
    { id: "benefits", name: "Benefits", duration: "12-17s", textOnScreen: "Key benefits listed", voiceoverScript: "List the key benefits." },
    { id: "results", name: "Before/After", duration: "17-22s", textOnScreen: "REAL RESULTS", voiceoverScript: "Show the results." },
    { id: "offer", name: "Special Offer", duration: "22-26s", textOnScreen: "SPECIAL OFFER", voiceoverScript: "Present your offer." },
    { id: "cta", name: "Call to Action", duration: "26-30s", textOnScreen: "BOOK NOW | 630-636-6193", voiceoverScript: "Call to action here." },
  ],
};

export default function VideoGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("solaria");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    serviceName: "Solaria CO2 Laser",
    headline: "VIP Launch Special",
    subheadline: "by InMode",
    price: "$1,895",
    originalPrice: "$2,500",
    promoLabel: "Limited Launch Offer",
    benefits: DEFAULT_BENEFITS.solaria,
    format: "vertical" as "vertical" | "square" | "horizontal",
    includeVoiceover: false,
    voicePreset: "rachel",
    customVoiceScript: "",
    // Phase 1: New settings
    qualityPreset: "standard" as "standard" | "high" | "ultra",
    includeCaptions: true,
    videoStyle: "clean" as "clean" | "luxury" | "energetic" | "minimal",
  });
  const [isGeneratingVoiceover, setIsGeneratingVoiceover] = useState(false);
  const [showScriptEditor, setShowScriptEditor] = useState(false);
  const [videoScenes, setVideoScenes] = useState<VideoScene[]>(DEFAULT_SCENES.solaria);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showBrandKit, setShowBrandKit] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"storyboard" | "animated">("storyboard");
  const [currentPreviewScene, setCurrentPreviewScene] = useState(0);
  // Phase 3: Asset Library & Music
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [musicVolume, setMusicVolume] = useState(30);
  const [showMusicLibrary, setShowMusicLibrary] = useState(false);
  const [savedPresets, setSavedPresets] = useState<ExportPreset[]>(DEFAULT_PRESETS);
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [batchFormats, setBatchFormats] = useState<string[]>([]);
  const [isBatchRendering, setIsBatchRendering] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{format: string; status: string}[]>([]);
  // Phase 4: Analytics & Scheduling
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [selectedPlatformForSchedule, setSelectedPlatformForSchedule] = useState<"instagram" | "facebook" | "tiktok" | "google">("instagram");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleCaption, setScheduleCaption] = useState("");
  // Phase 5: Gallery, Collaboration, A/B Testing, Hashtags
  const [showGallery, setShowGallery] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<string>("all");
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [collaborationComments, setCollaborationComments] = useState<CollaborationComment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [showABTesting, setShowABTesting] = useState(false);
  const [showHashtags, setShowHashtags] = useState(false);
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [hashtagPlatform, setHashtagPlatform] = useState<"instagram" | "tiktok" | "facebook">("instagram");
  const [brandKit, setBrandKit] = useState({
    primaryColor: "#E91E8C",
    secondaryColor: "#FF69B4",
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
    logoUrl: "",
    fontFamily: "system-ui",
  });

  useEffect(() => {
    const template = SERVICE_TEMPLATES.find((t) => t.id === selectedTemplate);
    if (template && selectedTemplate !== "custom") {
      const serviceNames: Record<string, string> = {
        solaria: "Solaria CO2 Laser",
        botox: "Botox",
        morpheus8: "Morpheus8",
        weightloss: "Semaglutide",
        fillers: "Dermal Fillers",
        prf: "PRF Hair Restoration",
        iv: "IV Therapy",
      };
      setFormData((prev) => ({
        ...prev,
        serviceName: serviceNames[selectedTemplate] || template.name,
        benefits: DEFAULT_BENEFITS[selectedTemplate] || DEFAULT_BENEFITS.custom,
      }));
      setVideoScenes(DEFAULT_SCENES[selectedTemplate] || DEFAULT_SCENES.custom);
    }
  }, [selectedTemplate]);

  const updateScene = (sceneId: string, field: "textOnScreen" | "voiceoverScript", value: string) => {
    setVideoScenes((prev) =>
      prev.map((scene) =>
        scene.id === sceneId ? { ...scene, [field]: value } : scene
      )
    );
  };

  const generateFullScript = () => {
    return videoScenes.map((scene) => scene.voiceoverScript).join(" ");
  };

  const handleGenerateAIScript = async () => {
    setIsGeneratingScript(true);
    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceName: formData.serviceName,
          headline: formData.headline,
          price: formData.price,
          benefits: formData.benefits,
          promoLabel: formData.promoLabel,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.scenes) {
          setVideoScenes(result.scenes);
        }
      } else {
        alert("Failed to generate script. Using default template.");
      }
    } catch (error) {
      console.error("Error generating script:", error);
      alert("Failed to generate script. Using default template.");
    }
    setIsGeneratingScript(false);
  };

  const handleImageUpload = (type: "before" | "after", file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "before") {
        setBeforeImage(reader.result as string);
      } else {
        setAfterImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateVoiceover = async () => {
    setIsGeneratingVoiceover(true);
    try {
      const response = await fetch("/api/generate-voiceover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: selectedTemplate,
          voicePreset: formData.voicePreset,
          customText: formData.customVoiceScript || undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Voiceover generated! File: ${result.filename}\nVoice: ${result.voice}`);
      } else {
        const error = await response.json();
        alert(`Failed to generate voiceover: ${error.error}\n${error.hint || ""}`);
      }
    } catch (error) {
      console.error("Error generating voiceover:", error);
      alert("Failed to generate voiceover. Check console for details.");
    }
    setIsGeneratingVoiceover(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    let voiceoverUrl: string | undefined;
    
    if (formData.includeVoiceover) {
      try {
        const scriptToUse = formData.customVoiceScript || generateFullScript();
        const voiceResponse = await fetch("/api/generate-voiceover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service: selectedTemplate,
            voicePreset: formData.voicePreset,
            customText: scriptToUse,
          }),
        });
        if (voiceResponse.ok) {
          const voiceResult = await voiceResponse.json();
          voiceoverUrl = voiceResult.audioUrl;
        }
      } catch (e) {
        console.error("Voiceover generation failed:", e);
      }
    }
    
    const newVideo: GeneratedVideo = {
      id: `video-${Date.now()}`,
      name: `${formData.serviceName} Promo`,
      service: formData.serviceName,
      format: formData.format,
      createdAt: new Date().toISOString(),
      status: "rendering",
      caption: generateCaption(),
      voiceoverUrl,
    };
    
    setGeneratedVideos((prev) => [newVideo, ...prev]);

    try {
      // Get template variant details if selected
      const variantDetails = selectedVariant 
        ? TEMPLATE_VARIANTS[selectedTemplate]?.find(v => v.id === selectedVariant)
        : null;

      const response = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: selectedTemplate,
          format: formData.format,
          props: {
            serviceName: formData.serviceName,
            headline: formData.headline,
            subheadline: formData.subheadline,
            price: formData.price,
            originalPrice: formData.originalPrice,
            promoLabel: formData.promoLabel,
            benefits: formData.benefits,
            clinicName: "Hello Gorgeous Med Spa",
            address: "74 W Washington St",
            city: "Oswego, IL",
            phone: "630-636-6193",
            website: "hellogorgeousmedspa.com",
            // Brand Kit colors
            brandColor: brandKit.primaryColor,
            secondaryColor: brandKit.secondaryColor,
            backgroundColor: brandKit.backgroundColor,
            textColor: brandKit.textColor,
            logoUrl: brandKit.logoUrl,
            // Phase 1 settings
            qualityPreset: formData.qualityPreset,
            videoStyle: formData.videoStyle,
            includeCaptions: formData.includeCaptions,
            // Phase 2: Template Variant
            templateVariant: selectedVariant,
            variantStyle: variantDetails?.style,
            variantPacing: variantDetails?.pacing,
            variantMood: variantDetails?.mood,
            // Video scenes for preview/rendering
            scenes: videoScenes,
            // Phase 3: Music
            backgroundMusic: selectedMusic,
            musicVolume,
            // Media
            voiceoverUrl,
            beforeImage,
            afterImage,
            // Script for captions
            captionScript: formData.includeCaptions ? generateFullScript() : undefined,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.jobId) {
          const pollForCompletion = async () => {
            const maxAttempts = 40;
            let attempts = 0;
            
            const poll = setInterval(async () => {
              attempts++;
              try {
                const statusRes = await fetch(`/api/render-video?jobId=${result.jobId}`);
                const statusData = await statusRes.json();
                
                if (statusData.job?.status === "completed") {
                  clearInterval(poll);
                  setGeneratedVideos((prev) =>
                    prev.map((v) =>
                      v.id === newVideo.id
                        ? { ...v, status: "completed", url: statusData.job.videoUrl }
                        : v
                    )
                  );
                  setIsGenerating(false);
                } else if (statusData.job?.status === "failed" || attempts >= maxAttempts) {
                  clearInterval(poll);
                  setGeneratedVideos((prev) =>
                    prev.map((v) =>
                      v.id === newVideo.id ? { ...v, status: "failed" } : v
                    )
                  );
                  setIsGenerating(false);
                }
              } catch (e) {
                console.error("Polling error:", e);
              }
            }, 3000);
          };
          
          pollForCompletion();
          return;
        }
        
        setGeneratedVideos((prev) =>
          prev.map((v) =>
            v.id === newVideo.id
              ? { ...v, status: "completed", url: result.videoUrl }
              : v
          )
        );
      } else {
        setGeneratedVideos((prev) =>
          prev.map((v) =>
            v.id === newVideo.id ? { ...v, status: "failed" } : v
          )
        );
      }
    } catch (error) {
      console.error("Error generating video:", error);
      setGeneratedVideos((prev) =>
        prev.map((v) =>
          v.id === newVideo.id ? { ...v, status: "failed" } : v
        )
      );
    }

    setIsGenerating(false);
  };

  const generateCaption = () => {
    const captions: Record<string, string> = {
      solaria: `✨ Introducing the Solaria CO2 Fractional Laser at Hello Gorgeous Med Spa! 

🔥 ${formData.promoLabel}: ${formData.price}

📍 74 W Washington St, Oswego, IL
📞 630-636-6193
🌐 hellogorgeousmedspa.com

#SolariaCO2 #LaserResurfacing #MedSpa #Oswego #HelloGorgeous #SkinCare #AntiAging`,

      botox: `💉 Smooth away wrinkles with Botox at Hello Gorgeous!

✨ ${formData.promoLabel}: ${formData.price}

Quick 15-min treatment • No downtime • Results in 3-5 days

📍 74 W Washington St, Oswego, IL
📞 630-636-6193

#Botox #AntiAging #MedSpa #Oswego #HelloGorgeous #WrinkleFree`,

      morpheus8: `🔥 Tighten & contour with Morpheus8!

RF Microneedling technology for:
✅ Skin tightening
✅ Fat reduction
✅ Collagen stimulation

${formData.promoLabel}: ${formData.price}

📍 Hello Gorgeous Med Spa, Oswego IL
📞 630-636-6193

#Morpheus8 #SkinTightening #MedSpa #Oswego #HelloGorgeous`,

      weightloss: `🏃‍♀️ Transform your body with medical weight loss!

${formData.promoLabel}: ${formData.price}

✅ FDA-approved
✅ Average 15-20% weight loss
✅ Physician supervised

📍 Hello Gorgeous Med Spa, Oswego IL
📞 630-636-6193

#WeightLoss #Semaglutide #MedicalWeightLoss #Oswego #HelloGorgeous`,

      fillers: `💋 Restore volume & enhance your features!

${formData.promoLabel}: ${formData.price}

• Lips • Cheeks • Jawline • Under eyes

📍 Hello Gorgeous Med Spa, Oswego IL
📞 630-636-6193

#DermalFillers #LipFiller #MedSpa #Oswego #HelloGorgeous`,

      prf: `🌱 Regrow your hair naturally with PRF!

${formData.promoLabel}: ${formData.price}

Uses your own growth factors • No surgery • Natural results

📍 Hello Gorgeous Med Spa, Oswego IL
📞 630-636-6193

#PRFHair #HairRestoration #MedSpa #Oswego #HelloGorgeous`,

      iv: `💧 Boost your wellness with IV Therapy!

${formData.promoLabel}: ${formData.price}

Hydration • Energy • Immunity • Recovery

📍 Hello Gorgeous Med Spa, Oswego IL
📞 630-636-6193

#IVTherapy #Wellness #MedSpa #Oswego #HelloGorgeous`,
    };

    return captions[selectedTemplate] || captions.solaria;
  };

  const copyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    alert("Caption copied to clipboard!");
  };

  const [postingTo, setPostingTo] = useState<string | null>(null);

  const handlePostToSocial = async (videoId: string, platform: "instagram" | "facebook" | "google") => {
    const video = generatedVideos.find((v) => v.id === videoId);
    if (!video || !video.url) {
      alert("Video not ready for posting");
      return;
    }

    setPostingTo(`${videoId}-${platform}`);

    try {
      const response = await fetch("/api/social/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          videoUrl: video.url,
          caption: video.caption || "",
          serviceName: video.service,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`✅ Successfully posted to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);
      } else {
        alert(`❌ Failed to post to ${platform}: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error(`Error posting to ${platform}:`, error);
      alert(`❌ Failed to post to ${platform}. Check console for details.`);
    }

    setPostingTo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-pink-50 to-gray-100 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent mb-2">
            🎬 Video Generator
          </h1>
          <p className="text-pink-600/80 text-lg">
            Create professional marketing videos for your services in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
              <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
                Select Service
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SERVICE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02] ${
                      selectedTemplate === template.id
                        ? "border-pink-500 bg-pink-100 shadow-lg shadow-pink-500/20"
                        : "border-gray-200 hover:border-pink-400/50 bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-gray-800">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Variant Selection - NEW PHASE 2 */}
            {selectedTemplate && TEMPLATE_VARIANTS[selectedTemplate] && (
              <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
                <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                  <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1.5</span>
                  Choose Template Style
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">A/B Testing</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {TEMPLATE_VARIANTS[selectedTemplate].map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02] relative ${
                        selectedVariant === variant.id
                          ? "border-pink-500 bg-pink-50 shadow-lg shadow-pink-500/20"
                          : "border-gray-200 hover:border-pink-400/50 bg-gray-50"
                      }`}
                    >
                      {/* Thumbnail Icon */}
                      <div className="text-4xl mb-3">{variant.thumbnail}</div>
                      
                      {/* Variant Name */}
                      <div className="font-semibold text-gray-800">{variant.name}</div>
                      
                      {/* Description */}
                      <div className="text-xs text-gray-500 mt-1">{variant.description}</div>
                      
                      {/* Tags */}
                      <div className="flex gap-1 mt-3 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          variant.pacing === "slow" ? "bg-blue-100 text-blue-700" :
                          variant.pacing === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {variant.pacing === "slow" ? "🐢" : variant.pacing === "medium" ? "🚶" : "🚀"} {variant.pacing}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          {variant.mood}
                        </span>
                      </div>
                      
                      {/* Hook Preview */}
                      <div className="mt-3 text-xs italic text-gray-600 border-t border-gray-100 pt-2">
                        &ldquo;{variant.hook}&rdquo;
                      </div>
                      
                      {/* Selected indicator */}
                      {selectedVariant === variant.id && (
                        <div className="absolute top-2 right-2 text-pink-500">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Template Preview Hint */}
                {selectedVariant && (
                  <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="flex items-center gap-2 text-sm text-pink-700">
                      <span>💡</span>
                      <span>This style will be applied to your video. You can preview it before rendering!</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Customize Content */}
            <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
              <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                Customize Content
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">
                    Subheadline (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.subheadline}
                    onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">
                    Promo Label
                  </label>
                  <input
                    type="text"
                    value={formData.promoLabel}
                    onChange={(e) => setFormData({ ...formData, promoLabel: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">
                    💰 Price
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400 text-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">
                    Original Price (strikethrough)
                  </label>
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  ✨ Benefits (4 bullet points)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {formData.benefits.map((benefit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...formData.benefits];
                        newBenefits[index] = e.target.value;
                        setFormData({ ...formData, benefits: newBenefits });
                      }}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-gray-900 placeholder-gray-400"
                      placeholder={`Benefit ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Before/After Photos */}
            <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
              <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">3</span>
                Before/After Photos (Optional)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">📸 Before Photo</label>
                  <input
                    ref={beforeInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload("before", e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => beforeInputRef.current?.click()}
                    className={`w-full h-32 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${
                      beforeImage
                        ? "border-green-500 bg-green-50"
                        : "border-pink-300 hover:border-pink-500 bg-pink-50/50"
                    }`}
                  >
                    {beforeImage ? (
                      <>
                        <span className="text-green-600 text-2xl">✓</span>
                        <span className="text-green-600 text-sm">Photo uploaded</span>
                      </>
                    ) : (
                      <>
                        <span className="text-pink-500 text-3xl">+</span>
                        <span className="text-gray-500 text-sm">Click to upload</span>
                      </>
                    )}
                  </button>
                  {beforeImage && (
                    <button
                      onClick={() => setBeforeImage(null)}
                      className="mt-2 text-xs text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">📸 After Photo</label>
                  <input
                    ref={afterInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload("after", e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => afterInputRef.current?.click()}
                    className={`w-full h-32 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${
                      afterImage
                        ? "border-green-500 bg-green-50"
                        : "border-pink-300 hover:border-pink-500 bg-pink-50/50"
                    }`}
                  >
                    {afterImage ? (
                      <>
                        <span className="text-green-600 text-2xl">✓</span>
                        <span className="text-green-600 text-sm">Photo uploaded</span>
                      </>
                    ) : (
                      <>
                        <span className="text-pink-500 text-3xl">+</span>
                        <span className="text-gray-500 text-sm">Click to upload</span>
                      </>
                    )}
                  </button>
                  {afterImage && (
                    <button
                      onClick={() => setAfterImage(null)}
                      className="mt-2 text-xs text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Video Script Editor */}
            <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                  <span className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">4</span>
                  Video Script Editor
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                    Scene-by-Scene Control
                  </span>
                  <button
                    onClick={() => setShowScriptEditor(!showScriptEditor)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showScriptEditor ? "▼ Hide" : "▶ Show"}
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Control exactly what appears on screen and what the AI voiceover says in each scene.
              </p>

              {showScriptEditor && (
                <div className="space-y-4">
                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={handleGenerateAIScript}
                      disabled={isGeneratingScript}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isGeneratingScript ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>✨ AI Generate Script</>
                      )}
                    </button>
                    <button
                      onClick={() => setVideoScenes(DEFAULT_SCENES[selectedTemplate] || DEFAULT_SCENES.custom)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                    >
                      🔄 Reset to Default
                    </button>
                  </div>

                  {/* Scene Editor */}
                  <div className="space-y-3">
                    {videoScenes.map((scene, index) => (
                      <div key={scene.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="font-medium text-gray-800">{scene.name}</span>
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              {scene.duration}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1 font-medium">
                              📺 Text on Screen
                            </label>
                            <input
                              type="text"
                              value={scene.textOnScreen}
                              onChange={(e) => updateScene(scene.id, "textOnScreen", e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1 font-medium">
                              🎙️ Voiceover Script
                            </label>
                            <input
                              type="text"
                              value={scene.voiceoverScript}
                              onChange={(e) => updateScene(scene.id, "voiceoverScript", e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-gray-900"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Full Script Preview */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">📝 Full Voiceover Script Preview</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generateFullScript());
                          alert("Script copied to clipboard!");
                        }}
                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 italic">
                      "{generateFullScript()}"
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Est. duration: ~{Math.ceil(generateFullScript().split(" ").length / 2.5)} seconds
                    </p>
                  </div>
                </div>
              )}

              {!showScriptEditor && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>{videoScenes.length} scenes</strong> configured • Click "Show" to customize each scene's text and voiceover
                  </p>
                </div>
              )}
            </div>

            {/* Format Selection with Safe Zone Preview */}
            <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
              <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">5</span>
                Select Format
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { id: "vertical", label: "Vertical", desc: "9:16 Reels/TikTok", icon: "📱" },
                  { id: "square", label: "Square", desc: "1:1 Feed Posts", icon: "⬜" },
                  { id: "horizontal", label: "Horizontal", desc: "16:9 Website", icon: "🖥️" },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setFormData({ ...formData, format: format.id as "vertical" | "square" | "horizontal" })}
                    className={`p-4 rounded-xl border-2 transition-all text-center hover:scale-[1.02] ${
                      formData.format === format.id
                        ? "border-pink-500 bg-pink-100 shadow-lg shadow-pink-500/20"
                        : "border-gray-200 hover:border-pink-400/50 bg-gray-50"
                    }`}
                  >
                    <div className="text-3xl mb-2">{format.icon}</div>
                    <div className="font-medium text-gray-800">{format.label}</div>
                    <div className="text-xs text-gray-500">{format.desc}</div>
                  </button>
                ))}
              </div>

              {/* Safe Zone Preview */}
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">📐 Safe Zone Preview</span>
                  <button
                    onClick={() => setShowSafeZones(!showSafeZones)}
                    className={`text-xs px-3 py-1 rounded-full ${showSafeZones ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
                  >
                    {showSafeZones ? "✓ Enabled" : "Disabled"}
                  </button>
                </div>
                <div className="flex justify-center">
                  <div 
                    className="relative bg-black rounded-lg overflow-hidden"
                    style={{ 
                      width: formData.format === "horizontal" ? "200px" : formData.format === "square" ? "120px" : "80px",
                      height: formData.format === "horizontal" ? "112px" : formData.format === "square" ? "120px" : "142px"
                    }}
                  >
                    {/* Content area */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-xs">Your Video</span>
                    </div>
                    {/* Safe zones */}
                    {showSafeZones && formData.format === "vertical" && (
                      <>
                        <div className="absolute top-0 left-0 right-0 h-[18%] bg-red-500/30 border-b border-red-500 border-dashed flex items-center justify-center">
                          <span className="text-[8px] text-red-200">IG/TikTok UI</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-red-500/30 border-t border-red-500 border-dashed flex items-center justify-center">
                          <span className="text-[8px] text-red-200">Buttons/Caption</span>
                        </div>
                      </>
                    )}
                    {showSafeZones && formData.format === "square" && (
                      <>
                        <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-red-500/30 border-t border-red-500 border-dashed flex items-center justify-center">
                          <span className="text-[6px] text-red-200">Caption</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {formData.format === "vertical" 
                    ? "Keep important text in the center 60% of the video" 
                    : formData.format === "square"
                    ? "Avoid text at bottom where captions appear"
                    : "Full frame available for website use"}
                </p>
              </div>
            </div>

            {/* Video Style & Quality */}
            <div className="bg-white rounded-2xl p-6 border border-orange-200 shadow-lg">
              <h2 className="text-xl font-semibold text-orange-600 mb-4 flex items-center gap-2">
                <span className="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">6</span>
                Video Style & Quality
              </h2>
              
              {/* Video Style */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2 font-medium">🎨 Video Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "clean", label: "Clean Clinic", desc: "Professional & minimal", color: "bg-blue-50 border-blue-300" },
                    { id: "luxury", label: "Luxury", desc: "Elegant & premium", color: "bg-purple-50 border-purple-300" },
                    { id: "energetic", label: "High Energy", desc: "Bold & dynamic", color: "bg-pink-50 border-pink-300" },
                    { id: "minimal", label: "Minimal", desc: "Simple & modern", color: "bg-gray-50 border-gray-300" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setFormData({ ...formData, videoStyle: style.id as "clean" | "luxury" | "energetic" | "minimal" })}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        formData.videoStyle === style.id
                          ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                          : `${style.color} hover:border-orange-300`
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-800">{style.label}</div>
                      <div className="text-xs text-gray-500">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Preset */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2 font-medium">⚡ Render Quality</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "standard", label: "Standard", desc: "Fast render • Good quality", crf: "CRF 18" },
                    { id: "high", label: "High", desc: "Sharper text • Slower", crf: "CRF 16" },
                    { id: "ultra", label: "Ultra", desc: "Archive quality • Slowest", crf: "CRF 14" },
                  ].map((quality) => (
                    <button
                      key={quality.id}
                      onClick={() => setFormData({ ...formData, qualityPreset: quality.id as "standard" | "high" | "ultra" })}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        formData.qualityPreset === quality.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300 bg-gray-50"
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-800">{quality.label}</div>
                      <div className="text-xs text-gray-500">{quality.desc}</div>
                      <div className="text-xs text-orange-600 mt-1">{quality.crf}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-Captions Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-sm text-gray-800">📝 Auto-Captions</div>
                  <div className="text-xs text-gray-500">Burn captions into video (improves engagement)</div>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, includeCaptions: !formData.includeCaptions })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    formData.includeCaptions ? "bg-orange-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      formData.includeCaptions ? "translate-x-7" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Brand Kit */}
            <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-cyan-600 flex items-center gap-2">
                  <span className="bg-cyan-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7</span>
                  Brand Kit
                </h2>
                <button
                  onClick={() => setShowBrandKit(!showBrandKit)}
                  className="text-sm text-cyan-600 hover:text-cyan-800 font-medium"
                >
                  {showBrandKit ? "▼ Hide" : "▶ Customize"}
                </button>
              </div>
              
              {!showBrandKit && (
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ backgroundColor: brandKit.primaryColor }} />
                    <div className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ backgroundColor: brandKit.secondaryColor }} />
                    <div className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ backgroundColor: brandKit.backgroundColor }} />
                  </div>
                  <span className="text-sm text-gray-600">Hello Gorgeous Brand Colors</span>
                </div>
              )}

              {showBrandKit && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandKit.primaryColor}
                          onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandKit.primaryColor}
                          onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Secondary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandKit.secondaryColor}
                          onChange={(e) => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandKit.secondaryColor}
                          onChange={(e) => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Background</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandKit.backgroundColor}
                          onChange={(e) => setBrandKit({ ...brandKit, backgroundColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandKit.backgroundColor}
                          onChange={(e) => setBrandKit({ ...brandKit, backgroundColor: e.target.value })}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandKit.textColor}
                          onChange={(e) => setBrandKit({ ...brandKit, textColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandKit.textColor}
                          onChange={(e) => setBrandKit({ ...brandKit, textColor: e.target.value })}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Logo URL (optional)</label>
                    <input
                      type="text"
                      value={brandKit.logoUrl}
                      onChange={(e) => setBrandKit({ ...brandKit, logoUrl: e.target.value })}
                      placeholder="https://your-logo-url.png"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-xl">
                    <p className="text-xs text-cyan-700">
                      💡 Brand Kit colors will be applied to your video templates for consistent branding across all content.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Phase 3: Music Library */}
            <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-indigo-600 flex items-center gap-2">
                  <span className="bg-indigo-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7.5</span>
                  Background Music
                  <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">Phase 3</span>
                </h2>
                <button
                  onClick={() => setShowMusicLibrary(!showMusicLibrary)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {showMusicLibrary ? "Hide" : "Show"} Library
                </button>
              </div>

              {/* Selected Music Preview */}
              {selectedMusic && (
                <div className="mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎵</span>
                      <div>
                        <div className="font-medium text-gray-800">
                          {MUSIC_LIBRARY.find(m => m.id === selectedMusic)?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {MUSIC_LIBRARY.find(m => m.id === selectedMusic)?.mood} • {MUSIC_LIBRARY.find(m => m.id === selectedMusic)?.duration}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMusic(null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  {/* Volume Control */}
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-sm text-gray-600">🔊 Volume:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 w-10">{musicVolume}%</span>
                  </div>
                </div>
              )}

              {showMusicLibrary && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {MUSIC_LIBRARY.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => setSelectedMusic(track.id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all hover:scale-[1.01] ${
                          selectedMusic === track.id
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {track.mood === "Relaxing" ? "🧘" :
                             track.mood === "Professional" ? "💼" :
                             track.mood === "Sophisticated" ? "🎩" :
                             track.mood === "Exciting" ? "🎉" :
                             track.mood === "Peaceful" ? "🌿" :
                             track.mood === "Motivating" ? "🚀" :
                             track.mood === "Elegant" ? "🎹" :
                             "🎵"}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{track.name}</div>
                            <div className="text-xs text-gray-500">{track.mood}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">{track.duration}</div>
                            <div className="text-xs text-gray-400">{track.bpm} BPM</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <p className="text-xs text-indigo-700">
                      🎧 Music will play under the voiceover at the selected volume level. Royalty-free tracks included.
                    </p>
                  </div>
                </div>
              )}

              {!selectedMusic && !showMusicLibrary && (
                <div className="text-center py-4">
                  <button
                    onClick={() => setShowMusicLibrary(true)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    + Add background music
                  </button>
                </div>
              )}
            </div>

            {/* Phase 3: Asset Library */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-emerald-600 flex items-center gap-2">
                  <span className="bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7.6</span>
                  Asset Library
                  <span className="ml-2 text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">Phase 3</span>
                </h2>
                <button
                  onClick={() => setShowAssetLibrary(!showAssetLibrary)}
                  className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  {showAssetLibrary ? "Hide" : "Show"} Assets
                </button>
              </div>

              {showAssetLibrary && (
                <div className="space-y-4">
                  {/* Upload New Asset */}
                  <div className="border-2 border-dashed border-emerald-300 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      id="asset-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const newAsset: Asset = {
                              id: `asset-${Date.now()}`,
                              name: file.name.replace(/\.[^/.]+$/, ""),
                              type: "photo",
                              url: event.target?.result as string,
                            };
                            setAssets([...assets, newAsset]);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label htmlFor="asset-upload" className="cursor-pointer">
                      <span className="text-3xl mb-2 block">📁</span>
                      <span className="text-emerald-600 font-medium">Upload New Asset</span>
                      <p className="text-xs text-gray-500 mt-1">Logos, backgrounds, overlays, photos</p>
                    </label>
                  </div>

                  {/* Asset Grid */}
                  {assets.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {assets.map((asset) => (
                        <div
                          key={asset.id}
                          className="relative group rounded-xl overflow-hidden border border-gray-200 hover:border-emerald-400 transition-colors"
                        >
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-20 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setBrandKit({ ...brandKit, logoUrl: asset.url });
                              }}
                              className="text-xs bg-white text-gray-800 px-2 py-1 rounded"
                            >
                              Use
                            </button>
                            <button
                              onClick={() => {
                                setAssets(assets.filter(a => a.id !== asset.id));
                              }}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                            >
                              ×
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                            <span className="text-xs text-white truncate block">{asset.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {assets.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No assets uploaded yet. Upload logos, backgrounds, or photos to reuse across videos.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Phase 3: Export Presets */}
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-amber-600 flex items-center gap-2">
                  <span className="bg-amber-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7.7</span>
                  Export Presets
                  <span className="ml-2 text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">Phase 3</span>
                </h2>
                <button
                  onClick={() => setShowPresetManager(!showPresetManager)}
                  className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                >
                  {showPresetManager ? "Hide" : "Show"} Presets
                </button>
              </div>

              {showPresetManager && (
                <div className="space-y-4">
                  {/* Quick Apply Presets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setSelectedFormat(preset.settings.format);
                          setQualityPreset(preset.settings.quality as "standard" | "high" | "ultra");
                          setVideoStyle(preset.settings.style as "clean" | "luxury" | "energetic" | "minimal");
                          setIncludeCaptions(preset.settings.includeCaptions);
                          setFormData({
                            ...formData,
                            voicePreset: preset.settings.voicePreset,
                            includeVoiceover: true,
                          });
                        }}
                        className="p-4 rounded-xl border-2 border-amber-200 hover:border-amber-400 bg-amber-50 text-left transition-all hover:scale-[1.01]"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">
                            {preset.id.includes("instagram") ? "📸" :
                             preset.id.includes("facebook") ? "👍" :
                             preset.id.includes("tiktok") ? "🎵" :
                             preset.id.includes("website") ? "🌐" :
                             "🎬"}
                          </span>
                          <span className="font-medium text-gray-800">{preset.name}</span>
                        </div>
                        <p className="text-xs text-gray-600">{preset.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            {preset.settings.format}
                          </span>
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            {preset.settings.quality}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Save Current as Preset */}
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💾</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Save Current Settings</p>
                        <p className="text-xs text-gray-500">Save your current configuration as a reusable preset</p>
                      </div>
                      <button
                        onClick={() => {
                          const presetName = prompt("Enter preset name:");
                          if (presetName) {
                            const newPreset: ExportPreset = {
                              id: `custom-${Date.now()}`,
                              name: presetName,
                              description: "Custom saved preset",
                              settings: {
                                format: selectedFormat,
                                quality: qualityPreset,
                                style: videoStyle,
                                includeCaptions,
                                includeMusic: !!selectedMusic,
                                voicePreset: formData.voicePreset,
                              },
                            };
                            setSavedPresets([...savedPresets, newPreset]);
                          }
                        }}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                      >
                        Save Preset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Phase 3: Batch Rendering */}
            <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-lg">
              <h2 className="text-xl font-semibold text-rose-600 mb-4 flex items-center gap-2">
                <span className="bg-rose-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7.8</span>
                Batch Render
                <span className="ml-2 text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full">Phase 3</span>
              </h2>
              
              <p className="text-sm text-gray-600 mb-4">
                Generate multiple format versions at once for different platforms.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { id: "reel", name: "Reel/TikTok", icon: "📱", ratio: "9:16" },
                  { id: "square", name: "Square", icon: "⬜", ratio: "1:1" },
                  { id: "story", name: "Story", icon: "📖", ratio: "9:16" },
                  { id: "landscape", name: "Landscape", icon: "🖥️", ratio: "16:9" },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => {
                      if (batchFormats.includes(format.id)) {
                        setBatchFormats(batchFormats.filter(f => f !== format.id));
                      } else {
                        setBatchFormats([...batchFormats, format.id]);
                      }
                    }}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      batchFormats.includes(format.id)
                        ? "border-rose-500 bg-rose-50"
                        : "border-gray-200 hover:border-rose-300 bg-gray-50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{format.icon}</div>
                    <div className="text-sm font-medium text-gray-800">{format.name}</div>
                    <div className="text-xs text-gray-500">{format.ratio}</div>
                  </button>
                ))}
              </div>

              {batchFormats.length > 0 && (
                <div className="space-y-3">
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-rose-700">
                        {batchFormats.length} format{batchFormats.length > 1 ? "s" : ""} selected
                      </span>
                      <button
                        onClick={() => setBatchFormats([])}
                        className="text-xs text-rose-600 hover:text-rose-800"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>

                  {/* Batch Progress */}
                  {batchProgress.length > 0 && (
                    <div className="space-y-2">
                      {batchProgress.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{item.format}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.status === "completed" ? "bg-green-100 text-green-700" :
                            item.status === "rendering" ? "bg-yellow-100 text-yellow-700" :
                            item.status === "failed" ? "bg-red-100 text-red-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      setIsBatchRendering(true);
                      setBatchProgress(batchFormats.map(f => ({ format: f, status: "pending" })));
                      
                      for (const format of batchFormats) {
                        setBatchProgress(prev => 
                          prev.map(p => p.format === format ? { ...p, status: "rendering" } : p)
                        );
                        
                        // Simulate rendering (in real implementation, call the API)
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        
                        setBatchProgress(prev => 
                          prev.map(p => p.format === format ? { ...p, status: "completed" } : p)
                        );
                      }
                      
                      setIsBatchRendering(false);
                    }}
                    disabled={isBatchRendering}
                    className={`w-full py-3 rounded-xl font-medium transition-all ${
                      isBatchRendering
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-rose-500 hover:bg-rose-600 text-white"
                    }`}
                  >
                    {isBatchRendering ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Batch Rendering...
                      </span>
                    ) : (
                      `🚀 Render ${batchFormats.length} Format${batchFormats.length > 1 ? "s" : ""}`
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Phase 4: AI Content Suggestions */}
            <div className="bg-white rounded-2xl p-6 border border-violet-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-violet-600 flex items-center gap-2">
                  <span className="bg-violet-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7.9</span>
                  AI Content Ideas
                  <span className="ml-2 text-xs bg-violet-100 text-violet-600 px-2 py-1 rounded-full">Phase 4</span>
                </h2>
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="text-sm text-violet-600 hover:text-violet-800 font-medium"
                >
                  {showSuggestions ? "Hide" : "Show"} Ideas
                </button>
              </div>

              {showSuggestions && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    AI-powered content suggestions based on seasonality, trends, and your service offerings.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {AI_CONTENT_SUGGESTIONS.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="p-4 rounded-xl border border-violet-200 bg-violet-50 hover:border-violet-400 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {suggestion.trending && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">🔥 Trending</span>
                            )}
                            {suggestion.seasonality && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🌸 {suggestion.seasonality}</span>
                            )}
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">{suggestion.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                        <p className="text-xs text-violet-600 italic mb-3">💡 {suggestion.reason}</p>
                        <button
                          onClick={() => {
                            setSelectedTemplate(suggestion.service);
                            setHeadline(suggestion.title);
                            setShowSuggestions(false);
                          }}
                          className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors"
                        >
                          Use This Idea →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Phase 4: Schedule Posts */}
            <div className="bg-white rounded-2xl p-6 border border-sky-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-sky-600 flex items-center gap-2">
                  <span className="bg-sky-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7.10</span>
                  Schedule Posts
                  <span className="ml-2 text-xs bg-sky-100 text-sky-600 px-2 py-1 rounded-full">Phase 4</span>
                </h2>
                <button
                  onClick={() => setShowScheduler(!showScheduler)}
                  className="text-sm text-sky-600 hover:text-sky-800 font-medium"
                >
                  {showScheduler ? "Hide" : "Show"} Scheduler
                </button>
              </div>

              {showScheduler && (
                <div className="space-y-4">
                  {/* Platform Selection */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">Platform</label>
                    <div className="flex gap-2">
                      {(["instagram", "facebook", "tiktok", "google"] as const).map((platform) => (
                        <button
                          key={platform}
                          onClick={() => setSelectedPlatformForSchedule(platform)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedPlatformForSchedule === platform
                              ? "bg-sky-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {platform === "instagram" ? "📸" : platform === "facebook" ? "👍" : platform === "tiktok" ? "🎵" : "🏢"}{" "}
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optimal Post Times */}
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
                    <h4 className="text-sm font-medium text-sky-800 mb-2">📊 Best Times to Post on {selectedPlatformForSchedule.charAt(0).toUpperCase() + selectedPlatformForSchedule.slice(1)}</h4>
                    <div className="flex gap-3 flex-wrap">
                      {OPTIMAL_POST_TIMES[selectedPlatformForSchedule]?.map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const nextDate = new Date();
                            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                            const targetDay = daysOfWeek.indexOf(slot.day);
                            const currentDay = nextDate.getDay();
                            const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7;
                            nextDate.setDate(nextDate.getDate() + daysUntilTarget);
                            setScheduleDate(nextDate.toISOString().split("T")[0]);
                            setScheduleTime(slot.time.replace(" AM", ":00").replace(" PM", ":00"));
                          }}
                          className="px-3 py-2 bg-white rounded-lg border border-sky-200 hover:border-sky-400 transition-colors text-sm"
                        >
                          <div className="font-medium text-gray-800">{slot.day}</div>
                          <div className="text-xs text-gray-500">{slot.time}</div>
                          <div className={`text-xs mt-1 ${slot.engagement === "Very High" ? "text-green-600" : "text-sky-600"}`}>
                            {slot.engagement === "Very High" ? "⭐" : "✓"} {slot.engagement}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time Picker */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">Date</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-sky-400 focus:outline-none text-gray-800 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1 font-medium">Time</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-sky-400 focus:outline-none text-gray-800 bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">Caption</label>
                    <textarea
                      value={scheduleCaption}
                      onChange={(e) => setScheduleCaption(e.target.value)}
                      placeholder="Write your post caption..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-sky-400 focus:outline-none text-gray-800 bg-gray-50 resize-none"
                    />
                  </div>

                  {/* Schedule Button */}
                  <button
                    onClick={() => {
                      if (!scheduleDate || !scheduleTime) {
                        alert("Please select a date and time");
                        return;
                      }
                      const newPost: ScheduledPost = {
                        id: `sched-${Date.now()}`,
                        videoId: generatedVideos[0]?.id || "",
                        videoName: generatedVideos[0]?.name || "New Video",
                        platform: selectedPlatformForSchedule,
                        scheduledFor: `${scheduleDate}T${scheduleTime}`,
                        status: "scheduled",
                        caption: scheduleCaption,
                      };
                      setScheduledPosts([...scheduledPosts, newPost]);
                      setScheduleDate("");
                      setScheduleTime("");
                      setScheduleCaption("");
                    }}
                    className="w-full py-3 bg-sky-500 text-white rounded-xl font-medium hover:bg-sky-600 transition-colors"
                  >
                    📅 Schedule Post
                  </button>

                  {/* Scheduled Posts List */}
                  {scheduledPosts.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium text-gray-800">Scheduled Posts</h4>
                      {scheduledPosts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-800 text-sm">{post.videoName}</div>
                            <div className="text-xs text-gray-500">
                              {post.platform} • {new Date(post.scheduledFor).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              post.status === "scheduled" ? "bg-sky-100 text-sky-700" :
                              post.status === "posted" ? "bg-green-100 text-green-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {post.status}
                            </span>
                            <button
                              onClick={() => setScheduledPosts(scheduledPosts.filter(p => p.id !== post.id))}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Phase 4: Video Analytics */}
            <div className="bg-white rounded-2xl p-6 border border-teal-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-teal-600 flex items-center gap-2">
                  <span className="bg-teal-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7.11</span>
                  Video Analytics
                  <span className="ml-2 text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded-full">Phase 4</span>
                </h2>
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                >
                  {showAnalytics ? "Hide" : "Show"} Analytics
                </button>
              </div>

              {showAnalytics && (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-4 bg-teal-50 rounded-xl text-center">
                      <div className="text-2xl font-bold text-teal-700">
                        {MOCK_ANALYTICS.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-teal-600">Total Views</div>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-xl text-center">
                      <div className="text-2xl font-bold text-pink-700">
                        {MOCK_ANALYTICS.reduce((sum, a) => sum + a.likes, 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-pink-600">Total Likes</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl text-center">
                      <div className="text-2xl font-bold text-blue-700">
                        {MOCK_ANALYTICS.reduce((sum, a) => sum + a.shares, 0)}
                      </div>
                      <div className="text-xs text-blue-600">Total Shares</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl text-center">
                      <div className="text-2xl font-bold text-purple-700">
                        {(MOCK_ANALYTICS.reduce((sum, a) => sum + a.engagement, 0) / MOCK_ANALYTICS.length).toFixed(1)}%
                      </div>
                      <div className="text-xs text-purple-600">Avg Engagement</div>
                    </div>
                  </div>

                  {/* Video Performance Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-gray-600 font-medium">Video</th>
                          <th className="text-left py-2 px-3 text-gray-600 font-medium">Platform</th>
                          <th className="text-right py-2 px-3 text-gray-600 font-medium">Views</th>
                          <th className="text-right py-2 px-3 text-gray-600 font-medium">Likes</th>
                          <th className="text-right py-2 px-3 text-gray-600 font-medium">Engagement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_ANALYTICS.map((video, idx) => (
                          <tr key={video.videoId} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 px-3 text-gray-800">Video #{idx + 1}</td>
                            <td className="py-2 px-3">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                video.platform === "instagram" ? "bg-pink-100 text-pink-700" :
                                video.platform === "facebook" ? "bg-blue-100 text-blue-700" :
                                "bg-purple-100 text-purple-700"
                              }`}>
                                {video.platform}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right text-gray-800">{video.views.toLocaleString()}</td>
                            <td className="py-2 px-3 text-right text-gray-800">{video.likes.toLocaleString()}</td>
                            <td className="py-2 px-3 text-right">
                              <span className={`font-medium ${
                                video.engagement > 10 ? "text-green-600" : "text-gray-600"
                              }`}>
                                {video.engagement}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    📊 Analytics update automatically when connected to social media APIs
                  </p>
                </div>
              )}
            </div>

            {/* Phase 5: Templates Gallery */}
            <div className="bg-white rounded-2xl p-6 border border-fuchsia-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-fuchsia-600 flex items-center gap-2">
                  <span className="bg-fuchsia-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7.12</span>
                  Templates Gallery
                  <span className="ml-2 text-xs bg-fuchsia-100 text-fuchsia-600 px-2 py-1 rounded-full">Phase 5</span>
                </h2>
                <button
                  onClick={() => setShowGallery(!showGallery)}
                  className="text-sm text-fuchsia-600 hover:text-fuchsia-800 font-medium"
                >
                  {showGallery ? "Hide" : "Browse"} Gallery
                </button>
              </div>

              {showGallery && (
                <div className="space-y-4">
                  {/* Filter Tabs */}
                  <div className="flex gap-2 flex-wrap">
                    {["all", "botox", "fillers", "morpheus8", "weightloss", "solaria", "iv"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setGalleryFilter(filter)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          galleryFilter === filter
                            ? "bg-fuchsia-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TEMPLATE_GALLERY
                      .filter(t => galleryFilter === "all" || t.service === galleryFilter)
                      .map((template) => (
                      <div
                        key={template.id}
                        className="rounded-xl border border-fuchsia-200 overflow-hidden hover:border-fuchsia-400 transition-colors bg-gradient-to-br from-fuchsia-50 to-pink-50"
                      >
                        {/* Thumbnail */}
                        <div className="h-32 bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center">
                          <span className="text-5xl">{template.thumbnail}</span>
                        </div>
                        
                        {/* Info */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-1">{template.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-fuchsia-100 text-fuchsia-700 px-2 py-0.5 rounded-full">{template.style}</span>
                            <span className="text-xs text-gray-500">{template.createdAt}</span>
                          </div>
                          
                          {/* Stats */}
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                            <span>👁️ {template.views.toLocaleString()}</span>
                            <span>❤️ {template.likes}</span>
                            <span>📈 {template.engagement}%</span>
                          </div>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {template.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">#{tag}</span>
                            ))}
                          </div>
                          
                          {/* Clone Button */}
                          <button
                            onClick={() => {
                              setSelectedTemplate(template.service);
                              setVideoStyle(template.style as "clean" | "luxury" | "energetic" | "minimal");
                              setHeadline(template.name);
                              setShowGallery(false);
                            }}
                            className="w-full py-2 bg-fuchsia-500 text-white rounded-lg text-sm font-medium hover:bg-fuchsia-600 transition-colors"
                          >
                            📋 Clone Template
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Phase 5: Auto-Hashtag Generator */}
            <div className="bg-white rounded-2xl p-6 border border-orange-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-orange-600 flex items-center gap-2">
                  <span className="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7.13</span>
                  Auto-Hashtags
                  <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Phase 5</span>
                </h2>
                <button
                  onClick={() => setShowHashtags(!showHashtags)}
                  className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                >
                  {showHashtags ? "Hide" : "Generate"} Hashtags
                </button>
              </div>

              {showHashtags && (
                <div className="space-y-4">
                  {/* Platform Selection */}
                  <div className="flex gap-2">
                    {(["instagram", "tiktok", "facebook"] as const).map((platform) => (
                      <button
                        key={platform}
                        onClick={() => setHashtagPlatform(platform)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          hashtagPlatform === platform
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {platform === "instagram" ? "📸" : platform === "tiktok" ? "🎵" : "👍"}{" "}
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={() => {
                      const serviceHashtags = HASHTAG_SETS[hashtagPlatform]?.[selectedTemplate] || [];
                      const genericHashtags = ["#hellogorgeousmedspa", "#oswegoil", "#medspa", "#beauty"];
                      setGeneratedHashtags([...serviceHashtags, ...genericHashtags]);
                    }}
                    className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                  >
                    🏷️ Generate Hashtags for {SERVICE_TEMPLATES.find(s => s.id === selectedTemplate)?.name || "Service"}
                  </button>

                  {/* Generated Hashtags */}
                  {generatedHashtags.length > 0 && (
                    <div className="space-y-3">
                      <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {generatedHashtags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-sm bg-white text-orange-700 px-3 py-1 rounded-full border border-orange-200 hover:bg-orange-100 cursor-pointer transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{generatedHashtags.length} hashtags</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(generatedHashtags.join(" "));
                              alert("Hashtags copied!");
                            }}
                            className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                          >
                            📋 Copy All
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500">
                        💡 Tip: {hashtagPlatform === "instagram" ? "Use 20-30 hashtags" : hashtagPlatform === "tiktok" ? "Use 3-5 trending hashtags" : "Use 3-5 relevant hashtags"} for best reach on {hashtagPlatform}.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Phase 5: A/B Testing Dashboard */}
            <div className="bg-white rounded-2xl p-6 border border-lime-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-lime-600 flex items-center gap-2">
                  <span className="bg-lime-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7.14</span>
                  A/B Testing
                  <span className="ml-2 text-xs bg-lime-100 text-lime-600 px-2 py-1 rounded-full">Phase 5</span>
                </h2>
                <button
                  onClick={() => setShowABTesting(!showABTesting)}
                  className="text-sm text-lime-600 hover:text-lime-800 font-medium"
                >
                  {showABTesting ? "Hide" : "View"} Tests
                </button>
              </div>

              {showABTesting && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Compare video performance to find what works best for your audience.
                  </p>

                  {MOCK_AB_TESTS.map((test) => (
                    <div key={test.id} className="p-4 rounded-xl border border-lime-200 bg-lime-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">
                          {test.startDate} {test.endDate ? `→ ${test.endDate}` : "→ Ongoing"}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          test.winner === "ongoing" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {test.winner === "ongoing" ? "🔄 Running" : `🏆 Winner: Variant ${test.winner}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Variant A */}
                        <div className={`p-3 rounded-lg border-2 ${
                          test.winner === "A" ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-gray-800">A</span>
                            <span className="text-sm text-gray-600">{test.variantA.name}</span>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Views:</span>
                              <span className="font-medium">{test.variantA.views.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Engagement:</span>
                              <span className="font-medium">{test.variantA.engagement}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Conversions:</span>
                              <span className="font-medium text-green-600">{test.variantA.conversions}</span>
                            </div>
                          </div>
                        </div>

                        {/* Variant B */}
                        <div className={`p-3 rounded-lg border-2 ${
                          test.winner === "B" ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-gray-800">B</span>
                            <span className="text-sm text-gray-600">{test.variantB.name}</span>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Views:</span>
                              <span className="font-medium">{test.variantB.views.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Engagement:</span>
                              <span className="font-medium">{test.variantB.engagement}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Conversions:</span>
                              <span className="font-medium text-green-600">{test.variantB.conversions}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button className="w-full py-3 border-2 border-dashed border-lime-300 rounded-xl text-lime-600 font-medium hover:border-lime-400 hover:bg-lime-50 transition-colors">
                    + Create New A/B Test
                  </button>
                </div>
              )}
            </div>

            {/* Phase 5: Collaboration */}
            <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                  <span className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7.15</span>
                  Collaboration
                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Phase 5</span>
                </h2>
                <button
                  onClick={() => setShowCollaboration(!showCollaboration)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showCollaboration ? "Hide" : "Show"} Comments
                </button>
              </div>

              {showCollaboration && (
                <div className="space-y-4">
                  {/* Comments List */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {collaborationComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl">{comment.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-800 text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-400">{comment.timestamp}</span>
                            {comment.type === "approval" && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Approved</span>
                            )}
                            {comment.type === "revision" && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">⟳ Revision</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{comment.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment or request..."
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 focus:outline-none text-gray-800 bg-gray-50"
                    />
                    <button
                      onClick={() => {
                        if (newComment.trim()) {
                          const comment: CollaborationComment = {
                            id: `c-${Date.now()}`,
                            author: "You",
                            avatar: "👤",
                            message: newComment,
                            timestamp: "Just now",
                            type: "comment",
                          };
                          setCollaborationComments([...collaborationComments, comment]);
                          setNewComment("");
                        }
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                    >
                      Send
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const approval: CollaborationComment = {
                          id: `c-${Date.now()}`,
                          author: "You",
                          avatar: "👤",
                          message: "Approved for publishing",
                          timestamp: "Just now",
                          type: "approval",
                        };
                        setCollaborationComments([...collaborationComments, approval]);
                      }}
                      className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => {
                        const revision: CollaborationComment = {
                          id: `c-${Date.now()}`,
                          author: "You",
                          avatar: "👤",
                          message: "Needs revision before publishing",
                          timestamp: "Just now",
                          type: "revision",
                        };
                        setCollaborationComments([...collaborationComments, revision]);
                      }}
                      className="flex-1 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors"
                    >
                      ⟳ Request Changes
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Voiceover */}
            <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-purple-600 flex items-center gap-2">
                  <span className="bg-purple-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">8</span>
                  AI Voiceover
                </h2>
                <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                  ElevenLabs
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setFormData({ ...formData, includeVoiceover: !formData.includeVoiceover })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    formData.includeVoiceover ? "bg-purple-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      formData.includeVoiceover ? "translate-x-7" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700">Include AI voiceover narration</span>
              </div>

              {formData.includeVoiceover && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">🎙️ Voice</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {VOICE_PRESETS.map((voice) => (
                        <button
                          key={voice.id}
                          onClick={() => setFormData({ ...formData, voicePreset: voice.id })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            formData.voicePreset === voice.id
                              ? "border-purple-500 bg-purple-100"
                              : "border-gray-200 hover:border-purple-400/50 bg-gray-50"
                          }`}
                        >
                          <div className="font-medium text-sm text-gray-800">{voice.name}</div>
                          <div className="text-xs text-gray-500">{voice.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">
                      Custom Script (optional)
                    </label>
                    <textarea
                      value={formData.customVoiceScript}
                      onChange={(e) => setFormData({ ...formData, customVoiceScript: e.target.value })}
                      placeholder="Leave empty to use auto-generated script..."
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none h-24 resize-none text-sm text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <button
                    onClick={handleGenerateVoiceover}
                    disabled={isGeneratingVoiceover}
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isGeneratingVoiceover ? "Generating..." : "🎙️ Generate Voiceover Only"}
                  </button>
                </div>
              )}
            </div>

            {/* Preview Player - PHASE 2 */}
            <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-pink-600 flex items-center gap-2">
                  <span className="bg-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">8</span>
                  Preview Your Video
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode("storyboard")}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      previewMode === "storyboard"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    📋 Storyboard
                  </button>
                  <button
                    onClick={() => setPreviewMode("animated")}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      previewMode === "animated"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    ▶️ Animated
                  </button>
                </div>
              </div>

              {/* Storyboard Preview */}
              {previewMode === "storyboard" && (
                <div className="space-y-4">
                  {/* Scene Timeline */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {videoScenes.map((scene, index) => (
                      <button
                        key={scene.id}
                        onClick={() => setCurrentPreviewScene(index)}
                        className={`flex-shrink-0 p-2 rounded-lg border-2 transition-all ${
                          currentPreviewScene === index
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 bg-gray-50 hover:border-pink-300"
                        }`}
                        style={{ width: "100px" }}
                      >
                        <div className="text-xs text-gray-500 mb-1">Scene {index + 1}</div>
                        <div className="text-xs font-medium text-gray-700 truncate">{scene.title}</div>
                      </button>
                    ))}
                  </div>

                  {/* Current Scene Preview */}
                  <div 
                    className="relative rounded-xl overflow-hidden"
                    style={{
                      aspectRatio: selectedFormat === "reel" ? "9/16" : selectedFormat === "story" ? "9/16" : "1/1",
                      maxHeight: "400px",
                      margin: "0 auto",
                      background: brandKit.backgroundColor,
                    }}
                  >
                    {/* Background */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${brandKit.primaryColor}20 0%, ${brandKit.secondaryColor}20 100%)`,
                      }}
                    />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      {/* Scene Icon/Type */}
                      <div className="text-4xl mb-4">
                        {videoScenes[currentPreviewScene]?.id === "hook" && "🎬"}
                        {videoScenes[currentPreviewScene]?.id === "problem" && "🤔"}
                        {videoScenes[currentPreviewScene]?.id === "solution" && "💡"}
                        {videoScenes[currentPreviewScene]?.id === "benefits" && "✨"}
                        {videoScenes[currentPreviewScene]?.id === "social_proof" && "⭐"}
                        {videoScenes[currentPreviewScene]?.id === "cta" && "📞"}
                        {videoScenes[currentPreviewScene]?.id === "closing" && "🏁"}
                      </div>
                      
                      {/* Scene Title */}
                      <div 
                        className="text-xl font-bold mb-2"
                        style={{ color: brandKit.primaryColor }}
                      >
                        {videoScenes[currentPreviewScene]?.title}
                      </div>
                      
                      {/* Text on Screen */}
                      <div 
                        className="text-lg font-semibold mb-4 max-w-[80%]"
                        style={{ color: brandKit.textColor }}
                      >
                        {videoScenes[currentPreviewScene]?.textOnScreen}
                      </div>
                      
                      {/* Voiceover Preview */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black/60 rounded-lg p-3 text-white text-sm italic">
                          &ldquo;{videoScenes[currentPreviewScene]?.voiceover}&rdquo;
                        </div>
                      </div>
                    </div>

                    {/* Safe Zones Overlay */}
                    {showSafeZones && (
                      <>
                        <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-red-500/20 border-t-2 border-red-400 border-dashed flex items-center justify-center">
                          <span className="text-red-600 text-xs font-medium bg-white/80 px-2 py-0.5 rounded">Caption Zone</span>
                        </div>
                        <div className="absolute top-0 left-0 right-0 h-[8%] bg-red-500/20 border-b-2 border-red-400 border-dashed flex items-center justify-center">
                          <span className="text-red-600 text-xs font-medium bg-white/80 px-2 py-0.5 rounded">UI Zone</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Scene Navigation */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setCurrentPreviewScene(Math.max(0, currentPreviewScene - 1))}
                      disabled={currentPreviewScene === 0}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition-colors"
                    >
                      ← Previous
                    </button>
                    <span className="text-gray-500">
                      Scene {currentPreviewScene + 1} of {videoScenes.length}
                    </span>
                    <button
                      onClick={() => setCurrentPreviewScene(Math.min(videoScenes.length - 1, currentPreviewScene + 1))}
                      disabled={currentPreviewScene === videoScenes.length - 1}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* Animated Preview */}
              {previewMode === "animated" && (
                <div className="space-y-4">
                  <div 
                    className="relative rounded-xl overflow-hidden mx-auto"
                    style={{
                      aspectRatio: selectedFormat === "reel" ? "9/16" : selectedFormat === "story" ? "9/16" : "1/1",
                      maxHeight: "400px",
                      background: brandKit.backgroundColor,
                    }}
                  >
                    {/* Animated Scene Slideshow */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-pulse">
                      <div className="text-5xl mb-4">🎬</div>
                      <div 
                        className="text-xl font-bold"
                        style={{ color: brandKit.primaryColor }}
                      >
                        {headline}
                      </div>
                      <div 
                        className="text-sm mt-2 opacity-70"
                        style={{ color: brandKit.textColor }}
                      >
                        {videoScenes.length} scenes • {selectedFormat} format
                      </div>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group">
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-pink-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-gray-500 text-sm">
                    Full animated preview will play in the Remotion Studio.
                    <br />
                    <span className="text-pink-600">Generate the video to see the final result!</span>
                  </p>
                </div>
              )}

              {/* Preview Summary */}
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Video Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Service:</span>
                    <span className="font-medium text-gray-700">{SERVICE_TEMPLATES.find(t => t.id === selectedTemplate)?.name || "Not selected"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Format:</span>
                    <span className="font-medium text-gray-700">{selectedFormat === "reel" ? "Reel (9:16)" : selectedFormat === "story" ? "Story (9:16)" : selectedFormat === "square" ? "Square (1:1)" : "Landscape (16:9)"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Style:</span>
                    <span className="font-medium text-gray-700">{selectedVariant ? TEMPLATE_VARIANTS[selectedTemplate]?.find(v => v.id === selectedVariant)?.name : videoStyle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Quality:</span>
                    <span className="font-medium text-gray-700">{qualityPreset}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Voiceover:</span>
                    <span className="font-medium text-gray-700">{useVoiceover ? (voiceoverUrl ? "Ready ✓" : "Will generate") : "None"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Captions:</span>
                    <span className="font-medium text-gray-700">{includeCaptions ? "Yes ✓" : "No"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-5 rounded-2xl font-bold text-xl transition-all shadow-xl ${
                isGenerating
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 hover:from-pink-400 hover:via-pink-500 hover:to-purple-500 shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.01]"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating Video (~60 seconds)...
                </span>
              ) : (
                "🎬 Generate Video"
              )}
            </button>
          </div>

          {/* Right: Generated Videos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-8 border border-pink-200 shadow-lg">
              <h2 className="text-xl font-semibold text-pink-600 mb-4">Generated Videos</h2>

              {generatedVideos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-gray-500">No videos generated yet</p>
                  <p className="text-sm text-gray-400 mt-1">Create your first video above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedVideos.map((video) => (
                    <div key={video.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-800">{video.name}</div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            video.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : video.status === "rendering"
                              ? "bg-yellow-100 text-yellow-600"
                              : video.status === "failed"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {video.status === "rendering" ? "⏳ Rendering..." : video.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        {video.format} • {new Date(video.createdAt).toLocaleTimeString()}
                      </div>

                      {video.status === "completed" && (
                        <div className="space-y-2">
                          <button
                            onClick={() => video.url && window.open(video.url, "_blank")}
                            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 py-2 rounded-xl text-sm font-medium transition-all"
                          >
                            ⬇️ Download Video
                          </button>
                          <button
                            onClick={() => video.caption && copyCaption(video.caption)}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl text-sm font-medium transition-colors"
                          >
                            📋 Copy Caption
                          </button>

                          {/* Social Media Post Buttons */}
                          <div className="pt-2 border-t border-gray-200 mt-2">
                            <p className="text-xs text-gray-500 mb-2 text-center">Post to Social Media</p>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => handlePostToSocial(video.id, "instagram")}
                                disabled={postingTo === `${video.id}-instagram`}
                                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-400 hover:via-pink-400 hover:to-orange-400 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {postingTo === `${video.id}-instagram` ? "..." : "📸 IG"}
                              </button>
                              <button
                                onClick={() => handlePostToSocial(video.id, "facebook")}
                                disabled={postingTo === `${video.id}-facebook`}
                                className="bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {postingTo === `${video.id}-facebook` ? "..." : "📘 FB"}
                              </button>
                              <button
                                onClick={() => handlePostToSocial(video.id, "google")}
                                disabled={postingTo === `${video.id}-google`}
                                className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 hover:from-blue-400 hover:via-green-400 hover:to-yellow-400 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {postingTo === `${video.id}-google` ? "..." : "🔍 Google"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {video.status === "rendering" && (
                        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full w-1/2 animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
