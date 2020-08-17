const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./api/routes/user');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const adminProfileRoutes = require('./api/routes/profiles/adminProfile');
const customerProfileRoutes = require('./api/routes/profiles/customerProfile');
const contractorProfileRoutes = require('./api/routes/profiles/contractorProfile');
const vendorProfileRoutes = require('./api/routes/profiles/vendorPofile');
require('dotenv').config();

mongoose.connect(process.env.MONGO_ATLAS_PROJECT
+ process.env.MONGO_ATLAS_PASSWORD +
process.env.MONGO_ATLAS_DB,
{
  useMongClient: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

app.use(morgan('dev')); //for logging
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false})); //for parsing response object
app.use(bodyParser.json());

app.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Reqeusted-With, Content-Type, Accept, Authorization');
  if(req.method === "OPTIONS"){
    res.header('Access-Control-Allow-Methods','PUT, POST, GET, DELETE, PATCH');
    return res.status(200).json({});
  }
  next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.use('/adminProfile', adminProfileRoutes);
app.use('/customerProfile', customerProfileRoutes);
app.use('/contractorProfile', contractorProfileRoutes);
app.use('/vendorProfile', vendorProfileRoutes);

app.use((req, res, next) =>{
  const error = new Error('Not Found');
  error.status= 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  });
});

module.exports = app;
