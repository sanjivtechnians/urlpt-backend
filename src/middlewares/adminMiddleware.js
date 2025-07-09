
const ErrorHandler = require("../utils/errorHandler");

const isAdmin = (req, res, next)=>{
    try {
        const user = req.user
        if(!user){
            return next(new ErrorHandler('Unauthorized', 401))
        }

        if(user.role !== 'admin'){
            return next(new ErrorHandler('You are not admin', 401))
        }
        next()
    } catch (error) {
        return next(error)
    }
}

module.exports = isAdmin
 