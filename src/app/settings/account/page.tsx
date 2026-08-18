import { Metadata } from 'next';
import { SettingsLayout } from '@/components/sites/stashr-me/settings/SettingsLayout';
import { AccountSettings } from '@/components/sites/stashr-me/settings/AccountSettings';

export const metadata: Metadata = {
  title: 'Account Settings | Stashr',
  description: 'Manage your profile and account preferences.'
};

export default function AccountSettingsPage() {
  return (
    <SettingsLayout activeTab="account">
      <AccountSettings />
    </SettingsLayout>
  );
}
