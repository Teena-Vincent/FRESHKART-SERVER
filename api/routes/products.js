const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');//


router.get('/',(req,res,next)=>{ //so here we dont have to use /products so then it wil become /products/products 
    //console.log("Working");
    Product.find()//
    .exec()
    .then(docs=>{
        console.log(docs);
         res.status(200).json(docs);
    })    .catch(err=>{
        console.log(err)
        res.status(500).json({error:err})
    })
});   

router.post('/',(req,res,next)=>{  
const product = new Product({ //
       _id:new mongoose.Types.ObjectId(),
       name: req.body.name,//
       price:req.body.price
});
product.save().then(result =>{
   console.log(result);
   res.status(201).json({
       message:"Handling POST requests to /products.",
       createdProduct: result
   });
})
.catch(err =>{
   console.log(err);
   res.status(500).json({error:err})
})    
});

router.get('/:productId',(req,res,next)=>{       //inorder to extract the id we have to put ':' infront of the id
const id =req.params.productId;
Product.findById(id) //
.exec()
.then(doc=>{
   console.log("from database",doc);
   if(doc){
       res.status(200).json(doc)
   }else{
       res.status(404).json({message:"no valid entry for provided id"})
   }
})
.catch(err=>{
   console.log(err)
   res.status(500).json({error:err})});
})

router.patch('/:productId',(req,res,next)=>{
const id =req.params.productId
const updateOps={};
for (const ops of req.body){//here as looping occurs,we prefer array as input in body postman
   updateOps[ops.propName]=ops.value;
}
Product.updateOne({_id:id},{$set: updateOps}) //
.exec()
.then(result =>{
   console.log(result);
   res.status(200).json(result)
})
.catch(err=>{
   console.log(err)
   res.status(500).json({
       error:err
   })
})
});
router.delete('/:productId',(req,res,next)=>{
const id =req.params.productId
Product.remove({_id:id}).exec() //
.then(result=>{
   res.status(200).json(result)
})
.catch(err=>{
   console.log(err)
   res.status(500).json({error:err})
});
});




module.exports = router;