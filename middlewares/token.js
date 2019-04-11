import jwt from 'jsonwebtoken'
import config from '../config/config'

const createToken = (id) =>{
    return  jwt.sign({
        id: id
    }, config.token.serect, { expiresIn: config.token.time});
}

const decodeToken = (token) =>{
    return jwt.decode(token, config.token.serect);

}
export {
    createToken,
    decodeToken
}
