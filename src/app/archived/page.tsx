import { Metadata } from 'next';
import { StashrApp } from '@/components/sites/stashr-me/bookmarks/StashrApp';

export const metadata: Metadata = {
  title: 'Archived | Valut',
  description: 'View and manage archived bookmarks in Valut.'
};

export default function ArchivedPage() {
  return <StashrApp initialNav="archived" />;
}
