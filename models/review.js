const  mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createAt:{
        type:Date,
        default:Date.now(0)
    }
});

module.exports=mongoose.model("Review",reviewSchema);