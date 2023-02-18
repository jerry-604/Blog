//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require('lodash')
const truncate = require(__dirname + '/truncate.js')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin-jerry:test123@cluster0.awnf5og.mongodb.net/blogDB?retryWrites=true&w=majority')



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.listen(3000, function () {
  console.log("Server started on port 3000");
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const posts = []
const tposts = []

const postSchema = {
  title: String,
  post: String,

}
const homeSchema = {
  title: String,
  post: String,
  tag: String

}

const Post = mongoose.model('Post', postSchema)
const Home = mongoose.model('Home', homeSchema)



app.get('/', (req, res) => {

  Home.find((err, records) => {
    if (err) { console.log(err) }
    else {
      res.render('home', { homeText: homeStartingContent, postArray: records })
    }

  })


})
app.get('/about', (req, res) => {
  res.render('about', { aboutText: aboutContent })
})
app.get('/contact', (req, res) => {
  res.render('contact', { contactText: contactContent })
})
app.get('/compose123', (req, res) => {
  res.render('compose')
})
app.get('/posts/:topic', (req, res) => {
  let topic = lodash.lowerCase(req.params.topic)

  Post.find((err, records) => {
    if (err) {
      console.log(err)
    }

    else {
      records.forEach(element => {
        let post = lodash.lowerCase(element.title)
        if (topic === post) { res.render('post', { header: element.title, body: element.post }) }
      })
      // res.render('post', { header: element.title, body: element.post })

    }
  })
  // posts.forEach(element => {
  //   let post = lodash.lowerCase(element.title)
  //   if (topic === post) { res.render('post', { header: element.title, body: element.post }) }
  // })

})
app.post('/compose', (req, res) => {
  const content = new Post({
    title: req.body.title,
    post: req.body.post,
  })
  content.save()

  const tcontent = new Home({
    title: req.body.title,
    post: truncate.truncateHTML(req.body.post, 100),
    tag: lodash.kebabCase(req.body.title)

  })
  tcontent.save()

  res.redirect('/')
})














