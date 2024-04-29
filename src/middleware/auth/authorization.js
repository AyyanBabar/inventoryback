const ApiResponse = require('../../Response/api.resposne')

function isAdmin(req, res, next){
    try{
        if(req.user.role == 'admin'){
            next()
        }else{
            return ApiResponse(res, 401, {status: false, msg : 'unAuthorized', data: null})
        }
    }catch(err){

    }
}