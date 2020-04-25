const mongoose = require('mongoose')
const express = require('express')
const Company = require('../models/company')
const router = express.Router()
const { check, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    const companies = await Company.find()
    res.status(200).send(companies)
})

router.get('/:id', async (req, res) => {
    const company = await Company.findById(req.params.id)
    if (!company) return res.status(404).send('No se encuentra company')
    res.send(company)
})

router.post('/', async (req, res) => {
    
    const company = new Company({
        name: req.body.name,
        country: req.body.country
    })

    const result = await company.save()
    res.status(201).send(result)
})

router.put('/:id',async (req, res) => {
    

    const company = await Company.findByIdAndUpdate(req.params.id, {
        company: req.body.company,
        country: req.body.country        
    },
        {
            new: true
        })

    if (!company) {
        return res.status(404).send('no se encontró el coche')
    }
    res.status(201).send(company)
})

router.delete('/:id',async(req,res)=>{
    const company = await Company.findByIdAndDelete(req.params.id)
    if (!company) {
        return res.status(404).send('no se encontró el coche')
    }
    res.status(200).send('coche borrado')
})
module.exports = router