import { Metadata } from 'next';
import { SettingsLayout } from '@/components/sites/stashr-me/settings/SettingsLayout';
import { TagsSettings } from '@/components/sites/stashr-me/settings/TagsSettings';

export const metadata: Metadata = {
  title: 'Tag Settings | Valut',
  description: 'Manage and clean up your tags in Valut.'
};

export default function TagsSettingsPage() {
  return (
    <SettingsLayout activeTab="tags">
      <TagsSettings />
    </SettingsLayout>
  );
}
