import { Metadata } from 'next';
import { StashrApp } from '@/components/sites/stashr-me/bookmarks/StashrApp';

export const metadata: Metadata = {
  title: 'Connections | Stashr',
  description: 'Manage integrations and import connections.'
};

export default function ConnectionsPage() {
  return <StashrApp initialNav="connections" />;
}
