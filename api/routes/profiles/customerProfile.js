const express = require('express');
const router = express.Router();
const CustomerProfile = require('../../models/profiles/customerProfile');
const User = require('../../models/user');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../../middleware/check-auth');

router.get('/list', (req, res, next) => {
  CustomerProfile.find()
  .select('userId firstName lastName email contactNumber')
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      profiles: docs.map(doc =>{
        return {
          userId: doc.userId,
          firstName: doc.firstName,
          lastName: doc.lastName,
          address: doc.address,
          country: doc.country,
          state: doc.state,
          city: doc.city,
          zipCode: doc.zipCode,
          email: doc.email,
          contactNumber: doc.contactNumber,
          request:{
            type: 'GET',
            url: 'http://localhost:5000/customerProfile/' + doc.userId
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

router.post("/", (req, res, next) => {
  User.findById(req.body.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }else if(user.role !== "customer"){
        try{
          return res.status(401).json({
            message: "Unautorized User"
          });
        }catch(err){
          console.log(err);
        }
        next();
      }
      const customerProfile = new CustomerProfile({
        userId: req.body.userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        contactNumber: req.body.contactNumber
      });
      return customerProfile.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "CustomerProfile Saved!",
        createdProfile: {
          userId: result.userId,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          contactNumber: result.contactNumber
        },
        request: {
          type: "GET",
          url: "http://localhost:5000/customerProfile/" + result._id
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

router.get('/:userId', (req, res, next) =>{
  const id = req.params.userId;
  CustomerProfile.find({userId: id})
  .select('userId firstName lastName email contactNumber')
  .exec()
  .then(doc => {
    console.log(doc);
    if(doc){
      res.status(200).json({
        product: doc,
        request: {
          type: 'GET',
          description: 'Get all profiles',
          url: 'http://localhost/customerProfile'
        }
      });
    } else {
      res.status(404)
      .json({
        message: "No valid entry found for the userId"
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  });
});

router.patch('/:userId', (req, res, next) =>{
  const id = req.params.userId;
  const updateOps = {};
  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  CustomerProfile.update({_id: id}, {$set: updateOps})
  .exec()
  .then(result => {
    res.status(200).json({
        message: 'Profile updated',
        request: {
          type: 'GET',
          url: 'http://localhost:5000/customerProfile/' + id
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

router.delete("/:userId", (req, res, next) => {
  CustomerProfile.remove({ userId: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
