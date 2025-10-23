const mongoose = require('mongoose');
const Post = require('../models/Post');

const generateSlug = async (title, existingId = null) => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  if (!base) {
    return `post-${Date.now()}`;
  }

  let slug = base;
  let counter = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (existingId) {
      query._id = { $ne: existingId };
    }
    // eslint-disable-next-line no-await-in-loop
    const exists = await Post.exists(query);
    if (!exists) {
      return slug;
    }
    slug = `${base}-${counter}`;
    counter += 1;
  }
};

const normalizePost = (doc) => {
  if (!doc) return null;
  const post = doc.toObject ? doc.toObject() : doc;

  return {
    ...post,
    id: post._id?.toString(),
    _id: post._id?.toString(),
    authorId: post.authorId?.toString(),
    createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
    updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
  };
};

const buildSort = (sortKey = 'date') => {
  switch (sortKey) {
    case 'author':
      return { authorName: 1, createdAt: -1 };
    case 'topic':
      return { topic: 1, createdAt: -1 };
    case 'date':
    default:
      return { createdAt: -1 };
  }
};

const listPosts = async (req, res) => {
  const { sort = 'date' } = req.query;
  try {
    const posts = await Post.find().sort(buildSort(sort)).lean().exec();

    res.json({
      posts: posts.map((post) => normalizePost(post)),
    });
  } catch (error) {
    console.error('[posts] list error', error);
    res.status(500).json({ message: 'Unable to load posts' });
  }
};

const resolveIdentifier = (postIdOrSlug) => {
  if (mongoose.Types.ObjectId.isValid(postIdOrSlug)) {
    return {
      $or: [{ _id: postIdOrSlug }, { slug: postIdOrSlug }],
    };
  }

  return { slug: postIdOrSlug };
};

const getPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const query = resolveIdentifier(postId);
    const postDoc = await Post.findOne(query).lean().exec();

    if (!postDoc) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json({ post: normalizePost(postDoc) });
  } catch (error) {
    console.error('[posts] get error', error);
    return res.status(500).json({ message: 'Unable to load post' });
  }
};

const createPost = async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const { title, topic, excerpt, readTime, content } = req.body;

  if (!title || !topic || !excerpt || !content) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const slug = await generateSlug(title);
    const post = await Post.create({
      title,
      topic,
      excerpt,
      readTime: readTime || '5 min read',
      content,
      slug,
      authorId: req.currentUser._id,
      authorName: req.currentUser.name,
    });

    return res.status(201).json({ post: normalizePost(post) });
  } catch (error) {
    console.error('[posts] create error', error);
    return res.status(500).json({ message: 'Unable to create post' });
  }
};

const updatePost = async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const { postId } = req.params;
  const { title, topic, excerpt, readTime, content } = req.body;

  try {
    const query = resolveIdentifier(postId);
    const post = await Post.findOne(query).exec();
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.authorId.equals(req.currentUser._id)) {
      return res.status(403).json({ message: 'You do not have permission to edit this post' });
    }

    if (title) {
      post.title = title;
      post.slug = await generateSlug(title, post._id);
    }

    if (topic) post.topic = topic;
    if (excerpt) post.excerpt = excerpt;
    if (readTime) post.readTime = readTime;
    if (content) post.content = content;
    post.updatedAt = new Date();

    await post.save();

    return res.json({ post: normalizePost(post) });
  } catch (error) {
    console.error('[posts] update error', error);
    return res.status(500).json({ message: 'Unable to update post' });
  }
};

module.exports = {
  listPosts,
  getPost,
  createPost,
  updatePost,
};
