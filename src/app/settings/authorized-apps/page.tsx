import { Metadata } from 'next';
import { SettingsLayout } from '@/components/sites/stashr-me/settings/SettingsLayout';
import { AuthorizedAppsSettings } from '@/components/sites/stashr-me/settings/AuthorizedAppsSettings';

export const metadata: Metadata = {
  title: 'Authorized Apps | Valut',
  description: 'Manage authorized extensions and integrations in Valut.'
};

export default function AuthorizedAppsPage() {
  return (
    <SettingsLayout activeTab="authorized-apps">
      <AuthorizedAppsSettings />
    </SettingsLayout>
  );
}
