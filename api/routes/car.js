const auth = require('../middlewares/auth')
const authorize = require('../middlewares/role')
const Role = require('../helpers/roles')
const express = require('express')
const Car = require('../models/car')
const router = express.Router()
const { check, validationResult } = require('express-validator');

router.get('/',[auth,authorize(Role.Admin,Role.User)], async (req, res) => {
    const cars = await Car
        .find()
        .populate('company','name country')
    res.status(200).send(cars)
})

router.get('/:id', async (req, res) => {
    const car = await Car.findById(req.params.id)
    if (!car) return res.status(404).send('No se encuentra auto')
    res.send(car)
})

router.post('/', [
    check('model').isLength({ min: 3 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const car = new Car({
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
    })

    const result = await car.save()
    res.status(201).send(result)
})

router.put('/:id', [
    check('company').isLength({ min: 3 }),
    check('model').isLength({ min: 3 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const car = await Car.findByIdAndUpdate(req.params.id, {
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
    },
        {
            new: true
        })

    if (!car) {
        return res.status(404).send('no se encontró el coche')
    }
    res.status(201).send(car)
})

router.delete('/:id', async (req, res) => {
    const car = await Car.findByIdAndDelete(req.params.id)
    if (!car) {
        return res.status(404).send('no se encontró el coche')
    }
    res.status(200).send('coche borrado')
})
module.exports = router