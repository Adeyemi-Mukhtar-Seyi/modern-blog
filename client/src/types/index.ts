export type Author = {
  _id: string;
  username: string;
  email?: string;
  role?: string;
  avatar?: string | null;
};

export type Post = {
  _id: string;
  title: string;
  slug: string;
  content: string;

  category?: string;
  subcategory?: string;

  author: Author;

  mediaType?: 'image' | 'video' | 'audio' | 'none';

  mediaUrl?: string;
  mediaPath?: string;

  tags?: string[];

  likes: string[];
  likesCount: number;

  views?: number;

  createdAt: string;
  updatedAt?: string;
};