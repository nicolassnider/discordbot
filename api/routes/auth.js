const bcrypt    = require('bcrypt')
const mongoose  = require('mongoose')
const express   = require('express')
const User      = require('../models/user')
const router    = express.Router();
const {check, validationResult} = require('express-validator');

router.post('/', [
    check('name').isLowercase(),
    check('name').isLength({ min: 8, max: 12 }),    
    check('password').not().isEmpty(),
    check('email').isEmail()
  ], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    let user = await User.findOne({email:req.body.email})

    if(!user) return res.status(400).send('Usuario/Password incorrecto')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Usuario/Password incorrecto')

    const jwtToken = await user.generateJWT()

    res.status(200).header('Authorization',jwtToken).send(user)


})

module.exports = router