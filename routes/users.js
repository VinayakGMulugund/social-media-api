const User = require("../models/User");
const router = require("express").Router();
const Unauthenticated = require("../errors/unauthenticated")
const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../errors/bad-request");
const customApiError = require("../errors/customapi");
const upload = require('../middleware/upload')


//update user
router.patch("/:id",upload.single('image'), async (req, res) => {
    const id = req.params.id
    if(req.user.userId === id || req.user.isAdmin) {
        console.log(req.user.userId)
        if(req.file.buffer) {
            const user = await User.findByIdAndUpdate(req.user.userId, {
                $set: {img:{data: req.file.buffer, contentType: 'image/jpg'},...req.body}
              }, {new:true})
        }
        else {
            const user = await User.findByIdAndUpdate(req.user.userId, {
                $set: req.body
              }, {new:true})
        }
        return res.status(StatusCodes.OK).json({msg: 'account updated', user})
    }
    throw new Unauthenticated('unauthenticated')
})


//delete user
router.delete("/", async (req, res) => {
    const id = req.params.id
    if(req.user.userId === id || req.user.isAdmin) {
        await User.findByIdAndDelete(req.user.userId);
        res.status(200).json("Account has been deleted")
    }
    throw new Unauthenticated('unauthenticated')
})


//get a user
router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id)
    if(!user) {
        throw new BadRequestError('user does not exist')
    }
    const { password, updatedAt, ...other } = user._doc
    res.status(200).json(other)
})



//follow a user
router.patch("/:id/follow", async (req, res) => {
    const follow_id = req.params.id
    const curr_id = req.user.userId
    if(follow_id == curr_id) {
        throw new customApiError('cannot follow yourself')
    }
    const curr_user = await User.findById(curr_id)
    const follow_user = await User.findById(follow_id)
    if(!curr_user.followings.includes(follow_id)) {
        await curr_user.updateOne({$push: {followings: follow_id}})
        await follow_user.updateOne({$push: {followers: curr_id}})
        return res.status(StatusCodes.ACCEPTED).json('follow successful')
    }
    throw new BadRequestError('you already follow this user')
});



//unfollow a user
router.patch("/:id/unfollow", async (req, res) => {
    const follow_id = req.params.id
    const curr_id = req.user.userId
    if(curr_id == follow_id) {
        throw new customApiError('cannot unfollow yourself')
    }
    const curr_user = await User.findById(curr_id)
    const follow_user = await User.findById(follow_id)
    if(!curr_user.followings.includes(follow_id)) {
        throw new BadRequestError('you do not follow this user')
    }
    await curr_user.updateOne({$pull: {followings: follow_id}})
    await follow_user.updateOne({$pull: {followers: curr_id}})
    return res.status(StatusCodes.ACCEPTED).json('unfollow successful')
    
});

//get all followers 
router.get('/:id/followers', async (req,res)=>{
    const user = await User.findById(req.params.id)
    const followersList = await User.find({_id: {$in: user.followers}})
    res.status(StatusCodes.OK).json(followersList)
})


//get all followings
router.get('/:id/followers', async (req,res)=>{
    const user = await User.findById(req.params.id)
    const followingList = await User.find({_id: {$in: user.followings}})
    res.status(StatusCodes.OK).json(followingList)
})



module.exports = router;