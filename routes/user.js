const express = require('express'); // Express 모듈을 가져옵니다.
const router = express.Router(); // Router 객체를 생성합니다.
// const authMiddleware = require('../middlewares/auth-middleware.js'); // "../middlewares/auth-middleware.js" 파일에서 미들웨어를 가져옵니다.
const { Users } = require('../models'); // "../models"에서 Users 모델을 가져옵니다.
// const jwt = require('jsonwebtoken'); // JWT(Json Web Token) 모듈을 가져옵니다.
const bcrypt = require('bcrypt'); // bcrypt 모듈을 가져옵니다.
require('dotenv').config(); // dotenv를 사용하여 환경 변수를 설정합니다.

router.post('/signup', async (req, res) => {
  const { email, password, nickname } = req.body; // 요청 본문에서 email, password, nickname을 추출합니다.
  // console.log(email, password, nickname);

  try {
    const exEmail = await Users.findOne({ where: { email } }); // 이메일을 사용하여 Users 모델에서 이미 등록된 사용자인지 확인합니다.
    if (exEmail) {
      return res.status(412).json({ errorMessage: '중복된 이메일 입니다.' }); // 이미 등록된 이메일이 있다면 에러 응답을 반환합니다.
    }

    const exNickname = await Users.findOne({ where: { nickname } }); // 닉네임을 사용하여 Users 모델에서 이미 등록된 사용자인지 확인합니다.
    if (exNickname) {
      return res.status(412).json({ errorMessage: '중복된 닉네임 입니다.' }); // 이미 등록된 닉네임이 있다면 에러 응답을 반환합니다.
    }

    const hash = await bcrypt.hash(password, 12); // 비밀번호를 bcrypt를 사용하여 해시화합니다.

    await Users.create({ email, nickname, password: hash }); // 이메일, 닉네임, 해시화된 비밀번호를 사용하여 Users 모델에 새로운 사용자를 생성합니다.
    return res.status(201).json({ message: '회원가입 되었습니다.' }); // 회원가입이 성공했음을 응답합니다.
  } catch (error) {
    console.error(error);
  }
});

module.exports = router; // router 객체를 모듈로 내보냅니다.
