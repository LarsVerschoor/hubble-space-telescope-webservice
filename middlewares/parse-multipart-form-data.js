import multer from 'multer';
import crypto from 'crypto';

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        const uniqueSuffix = crypto.randomUUID();
        const extension = file.originalname.split('.').pop();
        const filename = `${uniqueSuffix}.${extension}`;
        cb(null, filename);
    }
});

const upload = multer({ storage });

const parseMultipartFormData = (req, res, next) => {
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.startsWith('multipart/form-data')) {
        return next();
    }

    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        next();
    });
}

export default parseMultipartFormData;