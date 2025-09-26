//initialized database
const mongoose =require("mongoose");
const initData=require("./data.js");
const Listing= require("../models/listing.js"); //.. dot for access parent of parent dir

main().then(res=>{console.log("connection to DB is successfull")}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};

const initDB=async ()=>{
    await Listing.deleteMany({});//first we will delete all data,then insert
    await Listing.insertMany(initData.data);//now  inserting(initData is a object and .data is key in initData and initData in data.js )
    console.log("data was initalized")
};
initDB();