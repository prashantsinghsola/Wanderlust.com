const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8081;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate"); //ejs-mate help to create template.  
const wrapAsync=require("./utils/wrapAsync.js");//for custom error handling
const ExpressError=require("./utils/ExpressError.js")



main()
  .then((res) => {
    console.log("connection to DB is successfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate); //defining engine for ejs-mate.
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req, res) => {
  res.send("Root is working");
});

//index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));


//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show Route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
}));
//create route
app.post("/listings",wrapAsync(async (req,res,next)=>{ //post req come from new.ejs ,,<!-- listing is object, now title is [key], it is used to on place that
    // let {title,description,price,locaiton,country}=req.body;
    if(!req.body.listing){
      throw new ExpressError(400,"send valid data for listing");
    }
    
    let listing=req.body.listing;
    const newListing=new Listing(listing);  //inserting data in new collection named Listing
    await newListing.save();
    res.redirect("/listings");
    
})
);

//Edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{ //get(edit req.) req. come from  <a href="...."> in show.ejs 
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id",wrapAsync(async (req,res)=>{ //put req. come from edit.ejs
   if(!req.body.listing){
      throw new ExpressError(400,"send valid data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
  let {id}=req.params;
  let deletedListing=await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect('/listings');
}));

// app.get("/testListing",async (req,res)=>{
//     let sampleListing =new Listing ({ //Listing is model/collection
//         title:"my new villa",
//         description:"by the beach",
//         price:12000,
//         location:"goa",
//         country:"india",
//     });
//     await sampleListing.save();
//     console.log("sample data was saved");
//     res.send("testing is success");
// });



// const handleValidationErr=(err)=>{
//   console.log("this was a validation error please follow rule");
//   console.dir(err.message);
//   return err;
// };
// app.use((err,req,res,next)=>{
//   console.log(err.name);
//   res.send("this was a validation error please follow rule");
//   if(err.name==="validationError"){
//     err=handleValidationErr(err);
//   }
//   next(err);
// });

// Handle validation & cast errors from mongoose
const handleValidationErr = (err) => {
  err.message = "Invalid data. Please follow the rules!";
  err.statusCode = 400;
  return err;
};

//use ExpressError 

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found !"));
});


// General error handler (final middleware)
app.use((err, req, res, next) => {
  console.log(err.name); // debugging

  // Normalize mongoose errors
   if (err.name === "ValidationError" || err.name === "CastError") {
     err = handleValidationErr(err);
    }

  let { statusCode = 500, message = "Something went wrong" } = err;
 // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });//error page used from views/error.ejs
});


// //error handling middleware
// app.use((err,req,res,next)=>{
//   let { statusCode=500,message="somthing went to wrong"}=err;
//   res.status(statusCode).send(message);
// });

app.listen(port, () => {
  console.log(`app is linstening on port ${port} `);
});
