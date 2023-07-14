const express = require('express'); // express module을 express 변수에 할당
const router = express.Router(); // express.Router()로 라우터 객체 생성
const authMiddleware = require('../middlewares/auth-middleware.js');
const { Users, Posts, Likes } = require('../models');

// 좋아요 추가, 취소 API
router.put('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params; // URL에서 postId 파라미터 추출
  const { user } = res.locals; // 인증된 사용자 정보 추출

  try {
    const post = await Posts.findByPk(postId, {
      attributes: ['postId', 'likes'], // 게시글의 postId와 likes 속성만 가져옴
    });
    if (!post) {
      return res.status(404).json({ error: '게시글이 존재하지 않습니다.' });
    }

    const [like, created] = await Likes.findOrCreate({
      where: { UserId: user.userId, PostId: postId }, // 사용자와 게시글에 대한 좋아요 찾기 또는 생성
    });

    if (created) {
      await post.increment('likes'); // 게시글의 likes 속성을 1 증가
      return res
        .status(200)
        .json({ message: '게시글의 좋아요를 등록하였습니다.' });
    } else {
      await post.decrement('likes'); // 게시글의 likes 속성을 1 감소
      await like.destroy(); // 좋아요 삭제
      return res
        .status(200)
        .json({ message: '게시글의 좋아요를 취소하였습니다.' });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ errorMessage: '오류가 발생하였습니다.' });
  }
});

// 좋아요 게시글 조회 API
router.get('/get', authMiddleware, async (req, res) => {
  const { user } = res.locals;
  try {
    // 사용자가 좋아요한 게시물 ID 조회
    const likedPostIds = await Likes.findAll({
      where: { UserId: user.userId },
      attributes: ['PostId'],
    });

    // 사용자가 좋아요한 게시물을 조회
    const likedPosts = await Posts.findAll({
      where: { postId: likedPostIds.map(item => item.PostId) },
      order: [['likes', 'DESC']],
      attributes: ['title', 'likes', 'createdAt'],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],
    });

    res.status(200).json({ posts: likedPosts });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: '좋아요 게시글 조회에 실패하였습니다.' });
  }
});

module.exports = router;
