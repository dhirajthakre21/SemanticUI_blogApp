// install npm by npm init
// install packages
// install method override for update and delete request   

var express= require("express");
var app=express();
var methodOverride = require('method-override');
var bodyparser=require("body-parser");
var mongoose = require("mongoose");

//connecting to server 
app.listen(process.env.PORT , process.env.IP , function(){
	console.log("Hey Server is connected") ;
});

// mongoose connection 
const connect = mongoose.connect('mongodb://localhost:27017/Blog', { useNewUrlParser: true  , useUnifiedTopology: true });
//confirm the connection 
connect.then((db)=>{
	console.log('Succesfully Connected the mongoose server ');
} , (err) =>{
	console.log(err);	
})
//Memories this line 
app.use(bodyparser.urlencoded({extended : true }));

// setting files of view as a .ejs file
app.set('view engine', 'ejs')
app.use(express.static('public')) ;
app.use(methodOverride("_method")) ;

//make a schema for it 
var BlogSchema= mongoose.Schema({
	title : String , // Capital S is needed in String 
	image : String  , 
	body : String ,
	created : { type : Date , default :  Date.now}
	
});
var Blog = mongoose.model('Blog' , BlogSchema);

/*Blog.create({ // Enter data into it collection 'Campground'
	title : 'Panda' ,
	image : 'https://lh3.googleusercontent.com/proxy/GBlKxhnnt0ecTrwnhg0NKesoEJenZa5givFEd3hiQFoSxmVPrx3Hqk6X4JH6KkxdpCiMH5fw1LS6lHm-6DA-AZS2uZ_6LfuZzOKJPUq4B804Q_XV8y3bZ-tr66mu2x1TDaxeMDfVTWa08zH9UDl6SwGDFu6sQhb31Dga' , 
	body : 'A cute Panda '	
}); */

//make model 'Blog ' in which you are going to store the data  // this is collection in short 
var Blog =mongoose.model('Blog' , BlogSchema);

// landing page here ; 
app.get("/" , function (req , res)
	{
	//Go to the landing.ejs file on route '/'
	res.render("landing");
	});

app.get("/blogs" , function(req , res )
{ 
	Blog.find({} , function ( err , blogs )	
	{
		if(err)
			{
	 console.log('Error');
			}
		else 
			{
				res.render('index' , {blogs : blogs })
			}
});
});
//Here it the post method to '/blog' returned from form 
// the data returned from form is stored in the list 'blog'
// so we can use blog completely as req.body.blog instead of separated req.body.title etc 
app.post('/blogs', function(req , res )
{ // create a new document for the data sent by form in body i.e req.body.blog 
	// Blog is a collections
	// then there is callback function 
	Blog.create( req.body.blog , function (err , newBlog)
				{
				if(err)
					{
						console.log("We have got error ");
					}
				else 
					{
						res.redirect('/blogs')
				}
});
});
app.get ('/blogs/new' , function (req , res)
		{ 
	res.render('new') ; 
		});
app.get ('/blogs/:id' ,function (req , res )
		{ // to get rout of id we use req.params.id
		Blog.findById( req.params.id , function(err , blogInfo ) // will return document of that id 
					 { 
						if (err)
						 { 
							 console.log('Error is here')
						}
					 	else 
						 {
							 res.render ('show' , { blog : blogInfo }) ; 
						}
		});
});
//  route to edit the blog 
app.get('/blogs/:id/edit' , function (req , res)
	   { 
			Blog.findById( req.params.id , function(err,FoundBlog)
					 {
			if(err)
				{ console.log('error');
				}
			else 
				{
				  res.render('edit' , { blog : FoundBlog})
				}
});
});
//update 
// this is so important 
app.put('/blogs/:id' , function(req, res)
	   { 
		Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err , UpdateBlog){
			if(err)
				{ console.log('We have got error') ;
				}
			else 
				{
				 res.redirect('/blogs/'+req.params.id)
				}
});
 });

//delete 
// delete by findByIdAndRemove method 
app.delete('/blogs/:id' , function (req , res)
		  {
			Blog.findByIdAndRemove(req.params.id , function(err )
			{ if(err)
				{ console.log('Error while deleting ');
				}
			else 
				{
				 res.redirect('/blogs')
				}
				
			});
		});




