const router = require('express').Router();
const Review = require('../model/review.model');



router.post('/send', async(request, response) => {
    Review.create({ user: request.body.id, feedback: request.body.feedback }).then(result => {
        return response.status(200).json(result);
    }).catch(err => {
        return response.status(404).json(err);
    })

})
module.exports = router;