export type Post = {
  _id: string;
  title: string;
  content: string;

  likes?: string[];
  likesCount?: number;

  slug: string;
  

  author: {
  _id: string;
  username: string;
  role: string;
};
  createdAt: string;

  mediaType?: string;
  mediaUrl?: string;
};