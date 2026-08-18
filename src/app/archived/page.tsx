import { Metadata } from 'next';
import { StashrApp } from '@/components/sites/stashr-me/bookmarks/StashrApp';

export const metadata: Metadata = {
  title: 'Archived | Stashr',
  description: 'View and manage archived bookmarks.'
};

export default function ArchivedPage() {
  return <StashrApp initialNav="archived" />;
}
