import express from 'express';
import mongoose from 'mongoose';
import Photo from "./models/Photo.js";
import requireJsonAcceptHeader from "./middlewares/requireJsonAcceptHeader.js";
import requireContentTypeHeader from "./middlewares/requireContentTypeHeader.js";

mongoose.connect(`mongodb://127.0.0.1/${process.env.DB_NAME}`);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(requireJsonAcceptHeader);

app.get('/photos', async (req, res) => {
    try {
        const items = await Photo.find();
        res.status(200).json({
            items,
            _links: {
                self: {
                    href: `${process.env.WEBSERVICE_ORIGIN}photos/`
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.get('/photos/:id', async (req, res) => {
    try {
        const item = (await Photo.findOne({_id: req.params.id})).toJSON();
        res.json({
            ...item,
            _links: {
                self: {
                    href: `${process.env.WEBSERVICE_ORIGIN}photos/${item.id}`
                },
                collection: {
                    href: `${process.env.WEBSERVICE_ORIGIN}photos/`
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.post('/photos', requireContentTypeHeader, async (req, res) => {
    try {
        const missingFields = [];
        const {title, description, date_captured} = req.body;
        if (!title) missingFields.push('title');
        if (!description) missingFields.push('description');
        if (!date_captured) missingFields.push('date_captured');
        if (missingFields.length > 0) {
            return res.status(400).json({error: `Missing required field(s): ${missingFields.join(', ')}`});
        }

        const newPhoto = new Photo({title, description, dateCaptured: date_captured, dateUploaded: new Date(), image: 'test.png'});
        await newPhoto.save();
        res.status(201).json({message: 'Successfully saved photo'})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

app.post('/photos/seed', async (req, res) => {
    const item = new Photo({
        title: 'test title',
        description: 'test description',
        image: 'test image',
        dateCaptured: new Date(),
        dateUploaded: new Date()
    });
    await item.save();
    res.status(201).json(item);
});

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is now listening on port ${process.env.EXPRESS_PORT}`);
});