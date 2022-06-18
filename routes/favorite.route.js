const router = require('express').Router();
const Favorite = require("../model/favorite.model");


router.post("/favorite", (request, response) => {
    Favorite.create({
        user_id: request.body.user_id,
        tool_id: request.body.tool_id
    }).then(result => {
        return response.status(200).json(result);
    }).catch(err => {
        return response.status(500).json(err);
    });
});

router.get("/view/:uid", (request, response) => {
    Favorite.find({ user_id: request.params.uid }).populate("tool_id").then(result => {
        console.log(result);
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json(err);
    });
});


module.exports = router;