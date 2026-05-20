import { Types } from 'mongoose';

interface UserType {
  _id: Types.ObjectId | string;
  role?: string;
}

interface PostType {
  author: Types.ObjectId | string;
}

const canModifyPost = (user: UserType, post: PostType) => {
  if (!user) return false;

  const isAdmin = user.role === 'admin';

  const isOwner =
    post.author.toString() === user._id.toString();

  return isAdmin || isOwner;
};

export default canModifyPost;