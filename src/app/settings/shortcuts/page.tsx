import { Metadata } from 'next';
import { SettingsLayout } from '@/components/sites/stashr-me/settings/SettingsLayout';
import { ShortcutsSettings } from '@/components/sites/stashr-me/settings/ShortcutsSettings';

export const metadata: Metadata = {
  title: 'Keyboard Shortcuts | Valut',
  description: 'View power user keyboard shortcuts and keybindings in Valut.',
};

export default function ShortcutsSettingsPage() {
  return (
    <SettingsLayout activeTab="shortcuts">
      <ShortcutsSettings />
    </SettingsLayout>
  );
}
