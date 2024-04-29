module.exports = (res, apiStatus, msg, data,  status ) => {
    const responseData = {
        status: status,
        msg: msg,
        data: data,
    }
    return res.status(apiStatus).json(responseData)
}