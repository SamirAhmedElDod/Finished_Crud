const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs = require("fs");
// const users = require("../models/users");

// image Upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

// Insert an USer Into Db Router
router.post("/add", upload, (req, res) => {
  const user = new User({
    name: req.body.name,
    Phone: req.body.Phone,
    price: req.body.price,
    cv: req.body.cv,
    image: req.file.filename,
  });
  // console.log(req.body.name);
  // console.log(typeof req.body.Phone);
  // console.log(req.body.price);
  // console.log(req.body.cv);
  // console.log(req.body.filename);
  user.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "Danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "User Added Successfully",
      };
      res.redirect("/");
    }
  });
});
// Get All USers Route
router.get("/", (req, res) => {
  // res.render("index", { title: "Gym Admin" });
  User.find().exec((err, users) => {
    if (err) {
      res.json({ message: error.message });
    } else {
      res.render("index", {
        title: "Gym Admin",
        users: users,
      });
    }
  });
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id, (err, user) => {
    if (err) {
      res.redirect("/");
    } else {
      if (user == null) {
        res.redirect("/");
      } else {
        res.render("edit_users", {
          title: "Edit Trainer",
          user: user,
        });
      }
    }
  });
});

// update User Route
router.post("/update/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_image = "";
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      price: req.body.price,
      Phone: req.body.Phone,
      image: new_image,
      cv: req.body.cv,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: "User Updated Successfully",
        };
        res.redirect("/");
      }
    }
  );
});

//DELETE Trainer
router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  User.findByIdAndRemove(id, (err, result) => {
    if (result.image != "") {
      try {
        fs.unlinkSync("./uploads/" + result.image);
      } catch (err) {
        console.log(err);
      }
    }

    if (err) {
      res.json({ message: err.message });
    } else {
      req.session.message = {
        type: "info",
        message: "Trainer deleted Successfully",
      };
      res.redirect("/");
    }
  });
});
module.exports = router;
