import { Metadata } from 'next';
import { StashrApp } from '@/components/sites/stashr-me/bookmarks/StashrApp';

export const metadata: Metadata = {
  title: 'Creators | Valut',
  description: 'Explore creators and authors from your saved bookmarks in Valut.'
};

export default function CreatorsPage() {
  return <StashrApp initialNav="creators" />;
}
