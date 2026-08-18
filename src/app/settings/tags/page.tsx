import { Metadata } from 'next';
import { SettingsLayout } from '@/components/sites/stashr-me/settings/SettingsLayout';
import { TagsSettings } from '@/components/sites/stashr-me/settings/TagsSettings';

export const metadata: Metadata = {
  title: 'Tag Settings | Stashr',
  description: 'Manage and clean up your tags.'
};

export default function TagsSettingsPage() {
  return (
    <SettingsLayout activeTab="tags">
      <TagsSettings />
    </SettingsLayout>
  );
}
