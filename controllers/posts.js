const cloudinary = require("../middleware/cloudinary");
// const Post = require("../models/Post");
const Barista = require("../models/Barista")
const User = require("../models/User")

module.exports = {
  getDashboard: async (req, res) => {
    try {
      // const posts = await Post.find({ user: req.user.id });
      if (req.user.userType == 'barista') {
        res.render("dashboard_barista.ejs", { user: req.user });
      } else {
        res.render("dashboard_cafeOwner.ejs", { user: req.user });
      }

    } catch (err) {
      console.log(err);
    }
  },
  getProfile: async (req, res) => {
    // console.log(req.user._id)
    try{
      const userData = await User.findById(req.user._id)
      console.log(userData)
      if (req.user.userType == 'barista') {
        res.render("profile_barista.ejs", { user: userData });
      } else {
        res.render("profile_cafeOwner.ejs", { user: userData });
      }
      // res.render('profile_barista.ejs', { user: userData })
    }catch(err){
      console.log(err)
  }
  },
  updateProfile: async (req, res) => {
    // console.log(req)
    try {
      // const photo = await cloudinary.uploader.upload(req.file.path);
      await User.findOneAndUpdate(
        { _id: req.user._id },{
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          // photo: photo.secure_url,
          // cloudinaryId: photo.public_id,
          ig: req.body.ig,
          exp: req.body.exp,
          more: req.body.more,
          notification: req.body.notification
        }
      );
      console.log("profile updated!")
      res.redirect('profile_barista.ejs', { user: req.user })
    } catch (err) {
      console.log(err)
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("baristafeed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/dashboard_barista");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/dashboard_barista");
    } catch (err) {
      res.redirect("/dashboard_barista");
    }
  },
};
