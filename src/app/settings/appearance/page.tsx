import { Metadata } from 'next';
import { SettingsLayout } from '@/components/sites/stashr-me/settings/SettingsLayout';
import { AppearanceSettings } from '@/components/sites/stashr-me/settings/AppearanceSettings';

export const metadata: Metadata = {
  title: 'Appearance | Stashr',
  description: 'Customize theme and display density.'
};

export default function AppearanceSettingsPage() {
  return (
    <SettingsLayout activeTab="appearance">
      <AppearanceSettings />
    </SettingsLayout>
  );
}
