const setCorsHeaders = (req, res, next) => {
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}

export default setCorsHeaders;