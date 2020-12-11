const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("./middleware/auth");
const User = require("./models/User");
const Profile = require("./models/Profile");
const Post = require("./models/Post");


//@route POST api/posts
//@desc  post a new Post
//@access private
router.post("/",[auth,[
    check("text","text is required").not().isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        const user = await User.findById(req.user.id).select('-password'); // get the user without password
        const newPost = new Post({
            user:req.user.id,
            name:user.name,
            avatar:user.avatar,
            text:req.body.text,    
        });

         post = new Post(newPost);
         await post.save();
        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});

//@route GET api/posts
//@desc  get posts
//@access private
router.get("/",auth,async(req,res)=>{
    try {
        const posts = await Post.find().sort({date:-1});
        if(!posts){
            return res.status(400).json({msg:"there is no posts belong to this user"});
        }
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");        
    }
});

//@route GET api/posts/:id
//@desc  find post by id post
//@access private
router.get("/:id",auth,async(req,res)=>{
    try {
        const posts = await Post.findById(req.params.id);
        if(!posts){
            return res.status(400).json({msg:"there is no posts belong to this user"});
        }
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        if(error.kind == 'ObjectId'){
            return res.status(404).json({msg:"post not found"});
        }

        res.status(500).send("server error");        
    }
});

//@route DELETE posts/post/:id
//@desc  delete post
//@access private
router.delete("/post/:id",auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({msg:"there is no posts"});
        }
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'not authorized'});
        }
        await post.remove();
        res.json({msg:"post removed"});
    } catch (error) {
        console.error(error.message);
        if(error.kind == 'ObjectId'){
            return res.status(404).json({msg:"post not found"});
        }
        res.status(500).send("server error");        
    }
});


//@route PUT api/posts/like/:id
//@desc  delete post
//@access private
router.put("/like/:id",auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({msg:"there is no posts"});
        }
        if(post.likes.filter(like => like.user.toString() == req.user.id).length > 0){
            return res.status(400).json({msg:'user already liked the post'});
        }
        post.likes.unshift({user:req.user.id});
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        if(error.kind == 'ObjectId'){
            return res.status(404).json({msg:"post not found"});
        }
        res.status(500).send("server error");        
    }
});

//@route PUT api/posts/unlike/:id
//@desc  delete post
//@access private
router.put("/unlike/:id",auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({msg:"there is no posts"});
        }
        if(post.likes.filter(like => like.user.toString() == req.user.id).length === 0){
            return res.status(400).json({msg:'post not liked yet'});
        }
        const removeIndex = post.likes.map(like => like.user.toString).indexOf(req.user.id);
        post.likes.splice(removeIndex,1);
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        if(error.kind == 'ObjectId'){
            return res.status(404).json({msg:"post not found"});
        }
        res.status(500).send("server error");        
    }
});

//@route POST api/posts/comment/:id
//@desc  comment on a Post
//@access private

router.post("/comment/:id",[auth,[
    check("text","text is required").not().isEmpty()
]], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        const user = await User.findById(req.user.id).select('-password'); // get the user without password
        const post = await Post.findById(req.params.id);     
        const newComment = new Post({
            user:req.user.id,
            name:user.name,
            avatar:user.avatar,
            text:req.body.text,    
        });

        post.comments.unshift(newComment);
         await post.save();
        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});

//@route POST api/posts/comment/:id/:commentId
//@desc  delete a comment in a Post
//@access private

router.delete("/comment/:id/:commentId",auth, async (req,res)=>{

    try {
        
        const post = await Post.findById(req.params.id);     
        if(!post){
            res.status(400).json({msg:"post not found"});
        }

        const comment = post.comments.find(comment => comment.id === req.params.commentId);
        if(!comment){
            return res.status(404).json({msg:"comment not found"});

        }

        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg:"not authorized to delete this comment"});
        }
        const indexToRemove = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(indexToRemove,1);
        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});

// //@route find posts by user a new Post
// //@desc  Test Route
// //@access private
// router.get("/",auth,async(req,res)=>{
//     try {
//         const posts = await Post.findOne({user:req.user.id}).sort({date:-1});
//         if(!posts){
//             res.status(400).json({msg:"there is no posts belong to this user"});
//         }
//         res.json(posts);
//     } catch (error) {
//         console.error(error.message);
//         res.status(400).send("server error");        
//     }
// });

module.exports = router;