'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { EditPencilIcon } from '@/components/icons';

export function AccountSettings() {
  const [email, setEmail] = useState('httpbasant@gmail.com');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [avatar, setAvatar] = useState('/stashr_files/unnamed.jpg');
  const [deletionRequested, setDeletionRequested] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatar('/stashr_files/unnamed.jpg');
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-10 px-6 py-8 md:px-10 md:py-10 animate-in fade-in duration-150">
      {/* 1. Profile Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-strong tracking-tight">Profile</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your profile information.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            {/* Avatar image */}
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-1 ring-border bg-neutral-800">
              <Image
                src={avatar}
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex h-8 items-center justify-center rounded-xl border border-input bg-card/80 px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent shadow-xs">
                <span>Change photo</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>

              <button
                type="button"
                onClick={handleRemovePhoto}
                className="h-8 rounded-xl px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Remove
              </button>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            JPEG, PNG, or WebP (max 5MB)
          </p>
        </div>
      </div>

      {/* 2. Email Section */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-strong">
          Email
        </label>
        <div className="relative max-w-md">
          <input
            type="email"
            value={email}
            readOnly={!isEditingEmail}
            onChange={e => setEmail(e.target.value)}
            className={`h-9 w-full rounded-xl border border-input bg-card/60 px-3.5 pr-10 text-xs text-foreground outline-none transition-all ${
              isEditingEmail ? 'focus:border-ring focus:ring-2 focus:ring-ring/20' : 'cursor-default'
            }`}
          />
          <button
            type="button"
            onClick={() => setIsEditingEmail(!isEditingEmail)}
            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1 text-muted-foreground hover:text-foreground transition-colors"
            title="Edit email"
          >
            <EditPencilIcon className="size-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Delete Account Section */}
      <div className="space-y-3 pt-2">
        <div>
          <h2 className="text-sm font-semibold text-strong tracking-tight">Delete account</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            If you'd like to delete your account, please get in touch and we'll take care of it.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setDeletionRequested(true)}
            className="inline-flex h-8.5 items-center gap-2 rounded-xl border border-input bg-card/80 px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent shadow-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-muted-foreground">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>{deletionRequested ? 'Request received' : 'Request account deletion'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
