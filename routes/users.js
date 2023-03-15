const router = require('express').Router();
const {
  getUsers, getUser, patchUser, patchUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/me', getUser);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchUserAvatar);

module.exports = router;
