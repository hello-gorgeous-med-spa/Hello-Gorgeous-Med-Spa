export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  keywords: string[];
  content: string;
  /** OG / Article schema — path under public, e.g. /images/foo.png */
  featuredImage?: string;
  /** Must match visible FAQ copy on the page (Rich Results). */
  structuredDataFaqs?: readonly { question: string; answer: string }[];
}
