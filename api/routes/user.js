
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const express = require('express')
const User = require('../models/user')
const router = express.Router()
const { check, validationResult } = require('express-validator')

router.get('/', async (req, res) => {
  const users = await User.find()
  res.status(200).send(users)
})

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).send('No se encuentra user')
  res.send(user)
})

router.post('/', [
  check('name').isLowercase(),
  check('name').isLength({ min: 8, max: 12 }),
  check('isCustomer').not().isEmpty(),
  check('password').not().isEmpty(),
  check('email').isEmail()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send('usuario existe')


  const salt= await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  user = new User({
    name: req.body.name,
    isCustomer: req.body.isCustomer,
    password: hashPassword,
    email: req.body.email,
    isAdmin:req.body.isAdmin
  })

  const result= await user.save()

  const jwtToken= await user.generateJWT()

  res.status(201).header('Authorization',jwtToken).send({
    //se encuentra en el token
    _id: user.id,
    name: user.name,
    email: user.email
  })

  /*user.save(function (err) {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate username
        console.log(err)
        return res.status(422).send({ succes: false, message: err.errmsg });
      }

      // Some other error
      return res.status(422).send(err);
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email      
    });

  });*/
})

router.put('/:id', [
  check('name').isLowercase(),
  check('name').isLength({ min: 8, max: 12 }),
  check('isCustomer').not().isEmpty(),
  check('email').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    isCustomer: req.body.isCustomer,
    email: req.body.email
  },
    {
      new: true
    })

  if (!user) {
    return res.status(404).send('no se encontró el usuario')
  }
  res.status(201).send(user)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) return res.status(404).send('No se encuentra user')
  res.send(user)
})

module.exports = router