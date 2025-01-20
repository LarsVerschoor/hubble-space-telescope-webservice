const requireContentTypeHeader = (req, res, next) => {
    if (req.headers['accept'] !== 'application/json' && req.headers['accept'] !== 'application/x-www-form-urlencoded') {
        return res.status(415).json({error: 'The Content-Type header must have the value application/json or application/x-www-form-urlencoded'});
    }
    next();
}

export default requireContentTypeHeader;