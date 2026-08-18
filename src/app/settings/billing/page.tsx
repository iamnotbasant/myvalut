import { Metadata } from 'next';
import { SettingsLayout } from '@/components/sites/stashr-me/settings/SettingsLayout';
import { BillingSettings } from '@/components/sites/stashr-me/settings/BillingSettings';

export const metadata: Metadata = {
  title: 'Billing Settings | Stashr',
  description: 'Manage subscription and billing.'
};

export default function BillingSettingsPage() {
  return (
    <SettingsLayout activeTab="billing">
      <BillingSettings />
    </SettingsLayout>
  );
}
