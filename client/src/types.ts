export type Post = {
  _id: string;
  title: string;
  content: string;

  likes?: string[];
  likesCount?: number;

  slug: string;

  author?: {
    username: string;
  };
  createdAt: string;

  mediaType?: string;
  mediaUrl?: string;
};