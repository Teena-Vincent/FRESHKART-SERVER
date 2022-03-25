const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');

mongoose.connect("mongodb://localhost:27017/fkdb", { useNewUrlParser: true }, (error) => {
    if(!error)
    {
        console.log("success connected");
    }
    else
    {
        console.log("error connecting to database");
    }
})

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-requested-With,Content-Type,Accept,Authorization');

    if(req.method =='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,GET,DELETE');
        return res.status(200).json({})
    }
    next();
});


app.use('/products',productRoutes);

app.use((req,res,next) =>
{
    const error = new Error('not found');
    error.status = 404;
    next(error);    
    });

app.use((error,req,res,next) =>
    {
        res.status(error.status || 500);
        res.json({
            error:{message : error.message}
        });
        });
    



module.exports = app; 