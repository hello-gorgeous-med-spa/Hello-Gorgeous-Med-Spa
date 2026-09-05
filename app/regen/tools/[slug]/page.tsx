import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRegenTool, REGEN_PUBLIC_TOOLS } from '@/lib/regen/public-tools';
import ToolClient from './ToolClient';

export function generateStaticParams() {
  return REGEN_PUBLIC_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getRegenTool(slug);
  if (!tool) return { title: 'Tool' };
  return { title: tool.title, description: tool.blurb };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getRegenTool(slug);
  if (!tool) notFound();
  return <ToolClient slug={tool.slug} title={tool.title} blurb={tool.blurb} />;
}
