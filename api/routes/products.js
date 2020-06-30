const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype == 'image/jpeg' || 'image/png' || 'video/webm'){
    cb(null, true);
  }else{
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

router.get('/', (req, res, next) => {
  Product.find()
  .select('category description price')
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      products: docs.map(doc =>{
        return {
          _id: doc._id,
          category: doc.category,
          description: doc.description,
          price: doc.price,
          request:{
            type: 'GET',
            url: 'http://localhost:5000/products/' + doc._id
          }
        }
      })
    };
    console.log(response);
    res.status(200).json(response);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    category: req.body.category,
    description: req.body.description,
    price: req.body.price
    //productImage: req.file.path
  });
  product.save()
  .then(result => {
    console.log(result);
    res.status(201).json({
      message: "Created Product Successfully",
      createdProduct: {
        _id: result._id,
        category: result.category,
        description: result.description,
        price: result.price,
        //productImage: result.productImage,
        request: {
          type: 'GET',
          url: 'http://localhost:5000/products/' + result._id
        }
      }
    });
  })
  .catch(err => {
    console.log(err),
    res.status(500).json({
      error: err
    });
  });
});

router.get('/:productId', (req, res, next) =>{
  const id = req.params.productId;
  Product.findById(id)
  .select('category description quantity price progress')
  .exec()
  .then(doc => {
    console.log(doc);
    if(doc){
      res.status(200).json({
        product: doc,
        request: {
          type: 'GET',
          description: 'Get all products',
          url: 'http://localhost/products'
        }
      });
    } else {
      res.status(404)
      .json({
        message: "No valid entry found for the product id"
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  });
});

router.patch('/:productId', (req, res, next) =>{
  const id = req.params.productId;
  const updateOps = {};
  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id: id}, {$set: updateOps})
  .exec()
  .then(result => {
    res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:5000/products/' + id
        }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});


router.delete('/:productId', (req, res, next) =>{
  const id = req.params.productId;
  Product.remove({_id: id})
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json({
      message: "Entry with " + req.params.productId + " successfully deleted!",
      request: {
        type: 'POST',
        url: 'http://localhost:5000/products',
        body: {
          name: 'String',
          price: 'Number'
        }
      }
    });
    //res.status(200).json(result);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error : err
    });
  });
});
module.exports = router;

/*
    _id: mongoose.Schema.Types.ObjectId,
    category: { type: String, required: true },
    description: { type: Number, required: true },
    date: {type: String, required: true},
    location: {type: String, required: true},
    price: {type: String, required: true}
*/