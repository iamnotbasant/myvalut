import { Metadata } from 'next';
import { StashrApp } from '@/components/sites/stashr-me/bookmarks/StashrApp';

export const metadata: Metadata = {
  title: 'Tags & Topics | Valut',
  description: 'Explore, manage, and browse your bookmarks by tags and AI-generated concepts.'
};

export default function TagsPage() {
  return <StashrApp initialNav="tags" />;
}
