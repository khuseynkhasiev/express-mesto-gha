const jsonWebToken = require('jsonwebtoken');
const { ERROR_UNAUTHORIZED } = require('../errors');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    /*    return res
      .status(ERROR_UNAUTHORIZED).send({ message: 'Необходима авторизация' }); */

    const err = new Error('Необходима авторизация');
    err.statusCode = ERROR_UNAUTHORIZED;
    next(err);
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jsonWebToken.verify(token, 'some-secret-key');
  } catch (e) {
    /* return res.status(ERROR_UNAUTHORIZED).send({ message: 'Необходима авторизация' }); */
    const err = new Error('Необходима авторизация');
    err.statusCode = ERROR_UNAUTHORIZED;
    next(err);
  }
  req.user = payload;
  next();
};
