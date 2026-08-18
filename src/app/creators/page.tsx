import { Metadata } from 'next';
import { StashrApp } from '@/components/sites/stashr-me/bookmarks/StashrApp';

export const metadata: Metadata = {
  title: 'Creators | Stashr',
  description: 'Explore creators and authors from your saved bookmarks.'
};

export default function CreatorsPage() {
  return <StashrApp initialNav="creators" />;
}
