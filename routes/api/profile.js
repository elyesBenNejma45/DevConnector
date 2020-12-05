const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("config");
const auth = require ("./middleware/auth.js");
const Profile = require ("./models/Profile.js");
const User = require("./models/User.js");
const  { check, validationResult } = require('express-validator');
const { json, response } = require("express");


//@route GET api/profile
//@desc  get the profile to a a specific user
//@access Public
router.get("/me",auth, async (req,res) =>{
    try {
         const profile = await Profile.findOne({user: req.user.id}).populate("user",['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:"there is no profile for this user"});
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
    
});

//@route POST api/profile
//@desc  post a new profile
//@access Private

router.post("/",[auth,[
    check('status','status is required').not().isEmpty(),
    check('skills','skills is required').not().isEmpty(),
]],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty){
            return res.status(400).json({errors:errors.array()});
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubUsername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        const profileFields = {};
        profileFields.user = req.user.id;
        if(company){  profileFields.company = company;}
        if(website){  profileFields.website = website;}
        if(location){  profileFields.location = location;}
        if(bio){  profileFields.bio = bio;}
        if(status){  profileFields.status = status;}
        if(githubUsername){  profileFields.githubUsername = githubUsername;}
        if(skills){profileFields.skills = skills.split(",").map(skills=>skills.trim());}
        console.log(profileFields.skills);

        profileFields.social = {};
        profileFields.social.facebook=facebook;
        profileFields.social.youtube=youtube;
        profileFields.social.twitter=twitter;
        profileFields.social.instagram=instagram;
        profileFields.social.linkedin=linkedin;

        try {
            let profile = await Profile.findOne({user:req.user.id});
            if(profile){
                //update profile
                profile = await Profile.findOneAndUpdate(
                    {user:req.user.id},
                    {$set: profileFields},
                    {new: true}
                );
                return res.json(profile);
            }
            //create
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.error(error);
            res.status(500).send("server error");
            
        }
})


//@route Get api/profile/
//@desc  get all profiles
//@access public
router.get("/",async(req,res)=>{
    try {
        profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);  
    } catch (error) {
        console.error(error.message);
        res.status(500).json('server Error');

    }
})

//@route Get api/profile/:user_id
//@desc  get Profie by user Id
//@access public
router.get("/user/:user_id",async(req,res)=>{
    try {
        profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile){
           return res.status(400).json({msg:"there is no profile for this user"});
        }
        res.json(profile);  
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({msg:"there is no profile"});
        }
        res.status(500).json('server Error');
    }
})
module.exports = router;


//@route Delete api/profile/
//@desc  Delete a profile
//@access private
router.delete("/",auth,async(req,res)=>{
    try {
        await Profile.findOneAndRemove({user:req.user.id});
        await User.findOneAndRemove({_id:req.user.id}); 
        res.json({msg:"user fucking deleted"});

    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({msg:"there is no profile"});
        }
        res.status(500).json('server Error');

    }
})
 
//@route update api/profile/experience
//@desc  update experience for a user profile
//@access private

router.put('/experience',[auth,[
    check('title','company is required').not().isEmpty(),
    check('company','company is required').not().isEmpty(),
    check('from','from is required').not().isEmpty(),

]], async(req,res)=> {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({msg:"status has error"});
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    } = req.body;

    let newExp = {};
    newExp.title = title;
    newExp.company = company;
    newExp.location = location;
    newExp.from = from;
    newExp.to = to;
    newExp.current = current;
    newExp.description = description;
    try {
        profile = await Profile.findOne({user:req.user.id});
        if(!profile) {
        return res.status(400).json({msg:"profile does not exist"});
        }

        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg:'status  have error'});
    }

})

//@route Remove api/profile/experience
//@desc  update experience for a user profile
//@access private

router.delete('/experience/:expId',auth, async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});
        const experienceIndex = profile.experience.map(item => item.id).indexOf(req.params.expId);
        profile.experience.splice(experienceIndex,1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("status error");
    }
})


// //@route update api/profile/experience
// //@desc  update experience for a user profile
// //@access private

// router.put('/experience/:expId',auth, async(req,res)=>{
//     try {
//         const {
//             title,
//             company,
//             location,
//             from,
//             to,
//             current,
//             description,
//         } = req.body;
    
//         let newExp = {};
//         newExp.title = title;
//         newExp.company = company;
//         newExp.location = location;
//         newExp.from = from;
//         newExp.to = to;
//         newExp.current = current;
//         newExp.description = description;
//             const profile = await Profile.findOne({user:req.user.id});
//             const profileExp = await profile.experience.findOne({exp:req.params.expId},
//                 {$set: newExp},
//                 {new: true}
//             );

//         await profile.save();
//         res.json(profileExp);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json("status error");
//     }
// })


//@route update api/profile/education
//@desc  update education for a user profile
//@access private

router.put('/education',[auth,[
    check('school','school is school').not().isEmpty(),
    check('degree','degree is required').not().isEmpty(),
    check('fieldOfStudy','fieldOfStudy is required').not().isEmpty(),

]], async(req,res)=> {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({msg:"status has error"});
    }
    const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description,
    } = req.body;

    let newEduc = {};
    newEduc.school = school;
    newEduc.degree = degree;
    newEduc.fieldOfStudy = fieldOfStudy;
    newEduc.from = from;
    newEduc.to = to;
    newEduc.current = current;
    newEduc.description = description;
    try {
        profile = await Profile.findOne({user:req.user.id});
        if(!profile) {
        return res.status(400).json({msg:"profile does not exist"});
        }

        profile.education.unshift(newEduc);
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg:'status  have error'});
    }

})

//@route Remove api/profile/experience
//@desc  update experience for a user profile
//@access private

router.delete('/education/:educId',auth, async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});
        const educationIndex = profile.experience.map(item => item.id).indexOf(req.params.educId);
        profile.education.splice(educationIndex,1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("status error");
    }
})

//@route get api/profile/github/:username
//@desc  get github username
//@access private

router.get('/github/:username',auth, async(req,res)=>{
    try {
        const options = {
            uri:`http://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${
                config.get("gitHubSecret")}`,
            method:'GET',
            headers:{'user-agent':'node.js'}    
        }
        request(options,(error,response,body)=>{
            if(error){
                console.error(error);
            }
            if(response.statusCode!==200){
                res.status(404).json("not github Profile");
            }
            res.json(JSON.parse(body));
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json("status error");
    }
})