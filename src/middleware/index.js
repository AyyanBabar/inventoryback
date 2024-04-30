const middleware = {
    isAuthencticated: require('../middleware/auth/authenticaion'),
    isAdmin: require('../middleware/auth/authorization')
}
module.exports = middleware