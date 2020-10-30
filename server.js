require('dotenv').config()
var express =   require("express");
var multer  =   require('multer');
var app         =   express();



var storage =   multer.diskStorage({   
	destination: function (req, file, callback) {
		callback(null, './uploads');   
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());   
	} 
}); 

var upload = multer({ storage : storage}).single('userVideo');

app.get('/',function(req,res){
	res.sendFile(__dirname + "/index.html"); });

app.post('/api/upload',function(req,res){	
	upload(req,res,function(err) {
		if(err) {
			console.error(err);
			return res.end("Error uploading file.");
		}
		var Vimeo = require('vimeo').Vimeo;
		var client = new Vimeo(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.ACCESS_TOKEN);
		client.upload(
			req.file,
			function(uri){
				res.end('Vimeo URI is:', uri)
			},
			function() {},
			function(error){
				res.end('Failed because: ' + error)
			}
			)
	});
});


app.listen(3000,function(){
	console.log("Working on port 3000");
});
