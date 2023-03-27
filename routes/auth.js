const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { findOne } = require('../models/User');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Aadiisagoodboy';


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
// Using bcrypt.js to secure the password 
  const salt = await bcrypt.genSalt(10);
  const secPass=await bcrypt.hash(req.body.password,salt);
// Create a new user
  user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data = {
      user: {
        id : user.id
      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    res.json({authtoken})
} catch (error) {
  console.error(error.message);
  res.status(500).send("Something went wrong.");
}

})



module.exports = router;