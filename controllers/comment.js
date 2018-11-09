const {CommentUser} = require('../models/commentModel');

module.exports = {
    createComment: createComment
}

function createComment(req, res, next){
    body = req.body;
    CommentUser.create(body).then(()=>{
        return res.status(200).send("Sucessful Creation of Comment");
    });
}