import { Metadata } from 'next';
import { SettingsLayout } from '@/components/sites/stashr-me/settings/SettingsLayout';
import { ApiKeysSettings } from '@/components/sites/stashr-me/settings/ApiKeysSettings';

export const metadata: Metadata = {
  title: 'API Keys | Valut',
  description: 'Manage API keys and developer access for Valut.'
};

export default function ApiKeysPage() {
  return (
    <SettingsLayout activeTab="api-keys">
      <ApiKeysSettings />
    </SettingsLayout>
  );
}
