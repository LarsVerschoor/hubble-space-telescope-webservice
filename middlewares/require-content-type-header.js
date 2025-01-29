const requireContentTypeHeader = (req, res, next) => {
    const contentType = req.headers["content-type"];

    if (contentType && (contentType.startsWith("application/json") || contentType.startsWith("application/x-www-form-urlencoded") || contentType.startsWith("multipart/form-data"))) {
        return next();
    }

    return res.status(415).json({
        error: "The Content-Type header must be application/json, application/x-www-form-urlencoded, or multipart/form-data",
    });
};

export default requireContentTypeHeader;