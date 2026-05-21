const canModifyPost = (post, user) => {

  if (!post || !user) {
    return false;
  }

  const isOwner =
    post.author?._id?.toString() ===
    user._id?.toString();

  const isAdmin =
    user.role === 'admin';

  return isOwner || isAdmin;
};

module.exports = canModifyPost;