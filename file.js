var express = require('express')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
 
var app = express()
app.get('/getFileInfo' ,function(req, res) {
    console.log("Im here");
    //res.sendFile(__dirname + "/" + 'file.html' );
    
}) ;
app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file 
  // req.body will hold the text fields, if there were any 
})
 
app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files 
  // req.body will contain the text fields, if there were any 
})
 
var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files 
  // 
  // e.g. 
  //  req.files['avatar'][0] -> File 
  //  req.files['gallery'] -> Array 
  // 
  // req.body will contain the text fields, if there were any 
})
//In case you need to handle a text-only multipart form, you can use any of the multer methods (.single(), .array(), fields()). Here is an example using .array():

// var express = require('express')
// var app = express()
// var multer  = require('multer')
// var upload = multer()
 
// app.post('/profile', upload.array(), function (req, res, next) {
//   // req.body contains the text fields 
// })