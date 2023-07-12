const express = require('express');
const router = express.Router();

const postsRouter = require('./posts');
const userRouter = require('./user');
const commentsRouter = require('./comments');
const authRouter = require('./auth');
const likeRouter = require('./like');

router.use('/api/posts', postsRouter);
router.use('/api/user', userRouter);
router.use('/api/comments', commentsRouter);
router.use('/api/auth', authRouter);
router.use('/api/like', likeRouter);

router.use('/api', (req, res, next) => {
  return res.status(200).json({ message: 'api routes' });
});

module.exports = router;
