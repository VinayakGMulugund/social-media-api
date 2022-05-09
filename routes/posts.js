const router = require("express").Router()
const { StatusCodes } = require("http-status-codes")
const Unauthenticated = require("../errors/unauthenticated")
const Post = require("../models/Post")
const User = require("../models/User")
const upload = require('../middleware/upload')

//create a post
router.post("/", upload.single('image'), async (req, res) => {
  console.log(req.file)
  const newPost = await Post.create({userId: req.user.userId,img:{data: req.file.buffer, contentType: 'image/jpg'},...req.body})
  res.status(StatusCodes.ACCEPTED).json(newPost)
})


//update a post
router.patch("/:id",upload.single('image'), async (req, res) => {
  const postId = req.params.id
  const post = await Post.findById(postId)
  if(!post.userId == req.user.userId) {
    throw new Unauthenticated('not authenticated')
  }

  const updatedPost = await post.updateOne({img:{data: req.file.buffer, contentType: 'image/jpg'},...req.body})
  res.status(StatusCodes.ACCEPTED).json(updatedPost)
})


//delete a post
router.delete("/:id", async (req, res) => {
  const postId = req.params.id
  const post = await Post.findById(postId)
  if(!post.userId == req.user.userId) {
    throw new Unauthenticated('not authenticated')
  }
  await post.deleteOne()
  res.status(StatusCodes.OK).json('deleted postS')
})



//like / dislike a post
router.put("/:id/like", async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
})


//get a post
router.get("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
})



//timeline posts
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const userPosts = await Post.find({ userId: currentUser._id })
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId })
      })
    );
    res.json(userPosts.concat(...friendPosts))
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router;