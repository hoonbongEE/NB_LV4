const express = require('express'); // express module을 express 변수에 할당
const router = express.Router(); // express.Router()로 라우터 객체 생성
const authMiddleware = require('../middlewares/auth-middleware.js'); // "../middlewares/auth-middleware.js" 파일에서 인증 미들웨어를 가져온다.
const { Users, Posts, Comments } = require('../models/index.js');
// const { Op } = require('sequelize');

// 댓글 작성
router.post('/posts/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { user } = res.locals;
  //   console.log(content);
  try {
    const createComments = await Comments.create({
      PostId: postId,
      UserId: user.userId,
      nickname: user.nickname,
      content,
      createAt: new Date(),
    });
    res.status(200).json({
      message: '댓글 작성에 성공하였습니다.',
    });
    // console.log('2번째=>', content);
  } catch (error) {
    res.status(400).json({
      message: '댓글 작성에 실패하였습니다.',
    });
  }
});

// 댓글 전체 조회
router.get('/posts/:postId', async (req, res) => {
  try {
    const comments = await Comments.findAll({ order: [['createdAt', 'desc']] }); // createdAt을 기준으로 내림차순으로 정렬한다(최신순)
    res.json({ data: comments }); // JSON 형식으로 모든 댓글을 응답한다.
  } catch (error) {
    res.status(404).json({ error: '댓글 조회에 실패하였습니다.' }); // HTTP 상태 코드를 404로 알리고 errorMessage를 json형식으로 응답한다.
  }
});

// 댓글 상세 조회
router.get('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comments.findOne({
      include: {
        model: Users,
        attributes: ['userId', 'nickname'],
      },
      where: { commentId }, // where 조건을 commentId로 변경
      order: [['createdAt', 'DESC']],
    });

    if (!comment) {
      // comment가 존재하지 않을 경우
      res.status(404).json({ errorMessage: '댓글을 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ errorMessage: '서버 오류' });
  }
});

// 댓글 수정
router.patch('/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comments.findOne({ where: { commentId } });

    if (!comment) {
      res.status(404).json({ message: '존재하지 않는 댓글입니다.' });
      return;
    }
    await Comments.update({ content }, { where: { commentId } });

    res.status(200).json({ message: '댓글을 수정하였습니다.' });
  } catch (error) {
    res.status(400).json({ message: '댓글 수정에 실패하였습니다.' });
  }
});

// 댓글 삭제

router.delete('/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comments.findOne({ where: { commentId } });

    if (!comment) {
      res.status(404).json({ message: '존재하지 않는 댓글입니다.' });
      return;
    }
    await comment.destroy({ where: { commentId } });
    res.status(200).json({ message: '댓글을 삭제하였습니다.' });
  } catch (error) {
    res.status(400).json({ message: '댓글 삭제를 실패하였습니다.' });
  }
});

module.exports = router; // router객체를 모듈로 내보낸다
