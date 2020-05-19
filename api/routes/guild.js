const auth = require('../middlewares/auth')
const authorize = require('../middlewares/role')
const Role = require('../helpers/roles')
const express = require('express')
const Guild = require('../models/guild')
const router = express.Router()
const { check, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    const guilds = await Guild
        .find()
        .populate('company','name country')
    res.status(200).send(guilds)
})

router.get('/:id', async (req, res) => {
    const guild = await Guild.findById(req.params.id)
    if (!guild) return res.status(404).send('No se encuentra guild')
    res.send(guild)
})

router.post('/', [
    check('model').isLength({ min: 3 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const guild = new Guild({
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
    })

    const result = await guild.save()
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

    const guild = await Guild.findByIdAndUpdate(req.params.id, {
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

    if (!guild) {
        return res.status(404).send('no se encontró el coche')
    }
    res.status(201).send(guild)
})

router.delete('/:id', async (req, res) => {
    const guild = await Guild.findByIdAndDelete(req.params.id)
    if (!guild) {
        return res.status(404).send('no se encontró el coche')
    }
    res.status(200).send('coche borrado')
})
module.exports = router