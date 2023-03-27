const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { findOne } = require('../models/User');

// create a user using post "/api/auth/createuser". No login required
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req,res)=>{
// If there is an errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
// Check whether the user with the email already exist
try {
  
  let user = await User.findOne({email : req.body.email});
  if(user){
    return res.status(400).json({error: "Sorry! A User with this email already exist."})
  }
  user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
  //   .then(user => res.json(user))
  //   .catch(err=> {console.log(err)
  // res.json({error: 'Something went wrong!!'})})
  res.json(user)
} catch (error) {
  console.error(error.message);
  res.status(500).send("Something went wrong.");
}

})



module.exports = router;