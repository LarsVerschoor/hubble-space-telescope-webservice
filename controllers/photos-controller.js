import Photo from "../models/Photo.js";

const photosController = {}

photosController.getAllPhotos = async (req, res) => {
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
}

photosController.getOnePhoto = async (req, res) => {
    try {
        const item = (await Photo.findOne({_id: req.params.id})).toJSON();
        res.status(200).json({
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
}

photosController.createPhoto = async (req, res) => {
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
}

photosController.putPhoto = async (req, res) => {
    try {
        const missingFields = [];
        const {title, description, date_captured} = req.body;
        if (!title) missingFields.push('title');
        if (!description) missingFields.push('description');
        if (!date_captured) missingFields.push('date_captured');
        if (missingFields.length > 0) {
            return res.status(400).json({error: `Missing required field(s): ${missingFields.join(', ')}`});
        }
        const photo = await Photo.findOneAndUpdate({ _id: req.params.id }, req.body, { returnOriginal: false, upsert: true, includeResultMetadata: true });
        const statusCode = photo.lastErrorObject.updatedExisting ? 200 : 201;
        return res.status(statusCode).json(photo.value);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

photosController.patchPhoto = async (req, res) => {
    try {
        const photo = await Photo.findOneAndUpdate({ _id: req.params.id }, req.body, { returnOriginal: false });
        if (photo === null) return res.status(404).json({error: 'Not Found'});
        return res.status(200).json(photo);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

photosController.deletePhoto = async (req, res) => {
    try {
        await Photo.deleteOne({_id: req.params.id});
        res.status(204).json({message: 'Successfully deleted photo'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

photosController.setOptionsHeaderOnAllPhotos = (req, res) => {
    res.setHeader('Allow', 'GET,POST,OPTIONS');
    res.send();
}

photosController.setOptionsHeaderOnOnePhoto = (req, res) => {
    res.setHeader('Allow', 'GET,PUT,PATCH,DELETE,OPTIONS');
    res.send();
}

export default photosController;