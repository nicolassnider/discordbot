const mongoose = require('mongoose')
const express = require('express')
const app = express()
const car = require('./routes/car')

app.use(express.json())
app.use('/api/cars/', car)
//app.use('/api/auth/', auth)
const port = process.env.PORT || 3003
app.listen(port, () => console.log('Escuchando Puerto: ' + port))

mongoose.connect('mongodb://localhost/cardb', { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex:true})
    .then(() => console.log('Conectado a MongoDB'))
    .catch(() => console.log('Error de conexión a MongoDB'))