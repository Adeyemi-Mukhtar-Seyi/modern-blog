export interface Comment {
  _id: string;
  content: string;

  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };

  likes: string[];

  dislikes: string[];

  quotedComment?: {
    _id: string;
    content: string;

    user: {
      username: string;
    };
  };

  createdAt: string;
}