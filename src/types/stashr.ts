export type PlatformType =
  | 'twitter'
  | 'reddit'
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'pinterest'
  | 'bluesky'
  | 'threads'
  | 'web';

export type TagColor =
  | 'violet'
  | 'amber'
  | 'teal'
  | 'green'
  | 'indigo'
  | 'orange'
  | 'pink'
  | 'blue'
  | 'cyan'
  | 'red';

export type ViewMode = 'grid' | 'row' | 'timeline' | 'mosaic' | 'list';

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
  count?: number;
}

export interface Collection {
  id: string;
  name: string;
  icon?: string;
  count?: number;
}

export interface BookmarkItem {
  id: string;
  platform: PlatformType;
  displayName: string;
  username: string;
  avatarUrl?: string;
  imageUrl?: string;
  title?: string;
  text: string;
  url?: string;
  date: string;
  createdAt?: number;
  tags: {
    name: string;
    color: TagColor;
  }[];
  isFavorite?: boolean;
  isArchived?: boolean;
  note?: string;
  collectionId?: string;
}

export interface FilterState {
  query: string;
  platforms: PlatformType[];
  tags: string[];
  onlyFavorites?: boolean;
  collectionId: string | null;
  activeNav: 'bookmarks' | 'archived' | 'creators' | 'connections';
}
