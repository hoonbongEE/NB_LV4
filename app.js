const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan'); // 로깅
const path = require('path'); // 노드 내장 모듈
const dotenv = require('dotenv'); //env환경변수를 로드하기 위해 가져옴

// process.env

const app = express();
// process.env.COOKIE_SECRET 없음
dotenv.config(); // .env 파일에 정의된 환경 변수들은 process.env 객체에 저장되어 애플리케이션 전체에서 사용할 수 있게 됨
// process.env.COOKIE_SECRET 있음
// const PORT = process.env.PROT || 3000;

app.use(morgan('dev')); // 개발 중에는 자세한 로그를 확인하기 위해 morgan 미들웨어를 사용함 'dev'는 로깅 포맷을 지정하는 매개변수로, 개발 시에는 보다 자세한 로그를 출력해줌
app.use(express.json());
app.use(cookieParser()); // 쿠키들을 서명(암호)하는 키
const routes = require('./routes/index.js');

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`포트: 서버 열림 : ${process.env.PORT}`);
});

// app.listen(PORT, () => {
//   console.log(PORT, '포트: 서버 열림');
// });
