import { Metadata } from 'next';
import { StashrApp } from '@/components/sites/stashr-me/bookmarks/StashrApp';

export const metadata: Metadata = {
  title: 'Activity & Logs | Valut',
  description: 'System diagnostics, error logs, and AI tagging monitor.'
};

export default function LogsPage() {
  return <StashrApp initialNav="logs" />;
}
