const requireJsonAcceptHeader = (req, res, next) => {
    if (req.headers['accept'] !== 'application/json') {
        return res.status(406).json({error: 'The Accept header must have the value application/json'});
    }
    next();
}

export default requireJsonAcceptHeader