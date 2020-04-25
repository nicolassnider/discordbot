//export SECRET_KEY_JWT_CAR_API=password
const jwt = require('jsonwebtoken')
function auth(req, res, next) {
    const jwtToken = req.header('Authorization')
    if (!jwtToken) return res.status(401).send('Acceso denegado. no existe token')
    try {
        //console.log(process.env.SECRET_KEY_JWT_CAR_API)
        var SECRET_KEY_JWT_CAR_API = "password"
        const payload = jwt.verify(jwtToken, SECRET_KEY_JWT_CAR_API)
        req.user = payload
        next()
    } catch (error) {
        res.status(400).send('Acceso denegado. Token inválido')
    }

}
module.exports = auth
