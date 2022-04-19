const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const Unauthenticated = require("../errors/unauthenticated");
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/", async (req, res) => {
  const newPost = await Post.create({userId: req.user.userId, ...req.body})
  res.status(StatusCodes.ACCEPTED).json(newPost)
});


//update a post
router.patch("/:id", async (req, res) => {
  const postId = req.params.id
  const post = await Post.findById(postId)
  if(!post.userId == req.user.userId) {
    throw new Unauthenticated('not authenticated')
  }
  const updatedPost = await post.updateOne({...req.body})
  res.status(StatusCodes.ACCEPTED).json(updatedPost)
});


//delete a post
router.delete("/:id", async (req, res) => {
  const postId = req.params.id
  const post = await Post.findById(postId)
  if(!post.userId == req.user.userId) {
    throw new Unauthenticated('not authenticated')
  }
  await post.deleteOne()
  res.status(StatusCodes.OK).json('deleted postS')
});



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
});


//get a post
router.get("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
});



//get my posts
router.get("/myPosts", async (req, res) => {
    const posts = await Post.find({_id: req.user.userId})
    res.status(200).json(posts)
});


//get friend posts
router.get('/friendPosts/:id', async (req,res)=>{
    const posts = await Post.find({_id: req.params.id})
    res.status(200).json(posts)
})


module.exports = router;