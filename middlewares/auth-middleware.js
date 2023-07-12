const jwt = require('jsonwebtoken');
const { Users } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;

    if (!authorization) {
      return res.status(401).json({ message: '인증 정보가 없습니다' });
    }
    const [tokenType, token] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      return res
        .status(401)
        .json({ message: '토큰 타입이 일치하지 않습니다.' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedToken.userId;

    const user = await Users.findOne({ where: { userId } });
    if (!user) {
      res.clearCookie('authorization');
      return res
        .status(401)
        .json({ message: '토큰 사용자가 존재하지 않습니다.' });
    }

    res.locals.user = user;
    req.userId = userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: '비정상적인 요청입니다.',
    });
  }
};
