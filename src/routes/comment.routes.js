const { Router } = require('express');
const { getAllComments, getComment, createComment, updateComment } = require('../controllers/comment.controller');

const router = Router();

router.get('/comment', getAllComments)

router.get('/comment/:id', getComment)

router.post('/comment', createComment)

router.put('/comment/:id', updateComment)


module.exports = router;