//1st way to custom error handling

// function wrapAsync(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }
// module.exports=wrapAsync;

//2nd way

module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);

    };
};
