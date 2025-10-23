const express = require('express');
const { listPosts, getPost, createPost, updatePost } = require('../controllers/postController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', listPosts);
router.get('/:postId', getPost);
router.post('/', requireAuth, createPost);
router.put('/:postId', requireAuth, updatePost);

module.exports = router;
