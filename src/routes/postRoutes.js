const express = require('express');
const {
  listPosts,
  listMyPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', listPosts);
router.get('/mine', requireAuth, listMyPosts);
router.get('/:postId', getPost);
router.post('/', requireAuth, createPost);
router.put('/:postId', requireAuth, updatePost);
router.delete('/:postId', requireAuth, deletePost);

module.exports = router;
