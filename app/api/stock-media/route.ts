import { NextRequest, NextResponse } from "next/server";

interface PexelsPhoto {
  id: number;
  url: string;
  photographer: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsVideo {
  id: number;
  url: string;
  user: { name: string };
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
}

interface StockMediaResult {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail: string;
  source: "pexels" | "unsplash" | "upload";
  author: string;
  alt?: string;
  width?: number;
  height?: number;
}

// Med spa relevant search terms
const CATEGORY_QUERIES: Record<string, string[]> = {
  "weight-loss": ["weight loss transformation", "fitness journey", "healthy lifestyle", "measuring tape waist"],
  "botox": ["beauty treatment", "skincare routine", "anti-aging", "facial treatment", "beauty clinic"],
  "laser": ["laser treatment", "skin treatment", "dermatology", "beauty technology"],
  "clinic": ["medical spa interior", "beauty salon", "spa treatment room", "modern clinic"],
  "injection": ["medical injection", "beauty injection", "cosmetic procedure"],
  "happy-patients": ["happy woman face", "confident woman", "beautiful skin", "glowing skin"],
  "wellness": ["wellness spa", "self care", "relaxation", "beauty ritual"],
  "body": ["body contouring", "body transformation", "fitness results", "toned body"],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "beauty spa";
  const category = searchParams.get("category");
  const type = searchParams.get("type") || "image"; // image or video
  const count = parseInt(searchParams.get("count") || "20");
  const orientation = searchParams.get("orientation") || "portrait"; // portrait, landscape, square

  // Use category-specific queries if provided
  let searchQuery = query;
  if (category && CATEGORY_QUERIES[category]) {
    searchQuery = CATEGORY_QUERIES[category][Math.floor(Math.random() * CATEGORY_QUERIES[category].length)];
  }

  const pexelsApiKey = process.env.PEXELS_API_KEY;
  
  if (!pexelsApiKey) {
    // Return mock data if no API key
    return NextResponse.json({
      success: true,
      media: generateMockMedia(type as "image" | "video", count),
      source: "mock",
      message: "Add PEXELS_API_KEY to .env for real stock media",
    });
  }

  try {
    const results: StockMediaResult[] = [];

    if (type === "image") {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=${count}&orientation=${orientation}`,
        {
          headers: { Authorization: pexelsApiKey },
        }
      );
      const data = await response.json();
      
      for (const photo of data.photos as PexelsPhoto[]) {
        results.push({
          id: `pexels-${photo.id}`,
          type: "image",
          url: photo.src.large2x,
          thumbnail: photo.src.medium,
          source: "pexels",
          author: photo.photographer,
          alt: photo.alt,
        });
      }
    } else {
      const response = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(searchQuery)}&per_page=${count}&orientation=${orientation}`,
        {
          headers: { Authorization: pexelsApiKey },
        }
      );
      const data = await response.json();
      
      for (const video of data.videos as PexelsVideo[]) {
        const hdFile = video.video_files.find(
          (f) => f.quality === "hd" && f.file_type === "video/mp4"
        );
        if (hdFile) {
          results.push({
            id: `pexels-video-${video.id}`,
            type: "video",
            url: hdFile.link,
            thumbnail: `https://images.pexels.com/videos/${video.id}/free-video-${video.id}.jpg`,
            source: "pexels",
            author: video.user.name,
            width: hdFile.width,
            height: hdFile.height,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      media: results,
      query: searchQuery,
      total: results.length,
    });
  } catch (error) {
    console.error("Stock media fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch stock media" }, { status: 500 });
  }
}

function generateMockMedia(type: "image" | "video", count: number): StockMediaResult[] {
  const categories = ["beauty", "spa", "skincare", "wellness", "clinic"];
  const results: StockMediaResult[] = [];
  
  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    results.push({
      id: `mock-${type}-${i}`,
      type,
      url: `https://images.unsplash.com/photo-${1500000000000 + i}?w=800`,
      thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i}?w=200`,
      source: "pexels",
      author: "Stock Photographer",
      alt: `${category} ${type}`,
    });
  }
  
  return results;
}

// Get available categories
export async function OPTIONS() {
  return NextResponse.json({
    categories: Object.keys(CATEGORY_QUERIES),
    orientations: ["portrait", "landscape", "square"],
    types: ["image", "video"],
  });
}
