const express = require('express'); // express 모듈을 가져온다.
const router = express.Router(); // router 객체를 생성한다.
const jwt = require('jsonwebtoken'); // jsonwebtoken 모듈을 가져온다.
const { Users } = require('../models');
const bcrypt = require('bcrypt');
require('dotenv').config();

// 로그인 API
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // 클라이언트에서 email과 password를 받습니다.

  const exUser = await Users.findOne({ where: { email } }); // 받은 이메일에 해당하는 사용자를 데이터베이스에서 찾습니다.
  if (!exUser) {
    return res
      .status(412)
      .json({ errorMessage: '이메일 또는 비밀번호를 확인해주세요.' });
  }

  const result = await bcrypt.compare(password, exUser.password);
  if (!result) {
    return res
      .status(412)
      .json({ errorMessage: '이메일 또는 비밀번호를 확인해주세요.' });
  }

  const token = jwt.sign({ userId: exUser.userId }, process.env.JWT_SECRET); // JWT를 생성하여 토큰 변수에 할당합니다. payload에는 사용자의 userId를 담습니다.
  // 쿠키에 SameSite 옵션을 'strict'로 설정하여 CSRF 공격을 방지할 수 있음 외부사이트 쿠키를 못 갖고옴
  res.cookie('authorization', `Bearer ${token}`, { sameSite: 'strict' }); // HTTP 응답 헤더에 쿠키를 설정합니다. Authorization 헤더에 생성한 토큰 Bearer 스키마와 함께 설정합니다.
  res.status(200).json({ token }); // HTTP 응답 코드를 200으로 설정하고 JSON 형식으로 토큰을 담은 객체를 응답합니다.
});

module.exports = router;
