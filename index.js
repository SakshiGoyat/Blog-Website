const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/blogDB");

const newSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const blog = mongoose.model("blog", newSchema);

const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.set("view engine", "ejs");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutStartingContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactStartingContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get("/", (reqHome, resHome) => {
  blog.find({}, (err, foundblog) => {
    if (err) {
      console.log(err);
    } else {
      resHome.render("home", {
        homeContent: homeStartingContent,
        postTitle: foundblog,
      });
    }
  });
});

app.get("/post/:topic", (reqPost, resPost) => {
  var path = _.lowerCase(reqPost.params.topic);
  blog.find({}, (err, foundblog) => {
    if (err) {
      console.log(err);
    } else {
      foundblog.forEach((item) => {
        if (_.lowerCase(item.title) === path) {
          resPost.render("post", { title: item.title, content: item.content });
        }
      });
    }
  });
});
app.get("/about", (reqAbout, resAbout) => {
  resAbout.render("about", { aboutContent: aboutStartingContent });
});

app.get("/contact", (reqContact, resContact) => {
  resContact.render("contact", { contactContent: contactStartingContent });
});

app.get("/compose", (reqCompose, resCompose) => {
  resCompose.render("compose", {});
});

app.post("/compose", (reqCp, resCp) => {
  const blog1 = new blog({
    title: reqCp.body.postTitle,
    content: reqCp.body.postContent,
  });
  blog1.save();
  resCp.redirect("/");
});
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
