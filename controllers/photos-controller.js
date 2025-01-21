import Photo from "../models/Photo.js";

const photosController = {}

photosController.getAllPhotos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) ?? 0;
        const count = await Photo.countDocuments({});
        const limit = parseInt(req.query.limit) ?? count;
        const totalPages = Math.max(1, Math.ceil(count / limit));

        const queryParameterErrors = [];
        if (page < 0) queryParameterErrors.push('page number cannot be negative');
        if (limit < 0) queryParameterErrors.push('limit number cannot be negative')

        if (queryParameterErrors.length > 0) {
            return res.status(400).json({error: `Bad query parameters: ${queryParameterErrors.join(', ')}`});
        }

        const items = await Photo.find().skip((page)*limit).limit(limit);

        res.status(200).json({
            items,
            _links: {
                self: {
                    href: `${process.env.WEBSERVICE_ORIGIN}photos/`
                }
            },
            pagination: {
                currentPage: page,
                currentItems: items.length,
                totalPages,
                totalItems: count,
                _links: {
                    first: {
                        page: 0,
                        href: `${process.env.WEBSERVICE_ORIGIN}photos?limit=${limit}&page=0`
                    },
                    last: {
                        page: totalPages - 1,
                        href: `${process.env.WEBSERVICE_ORIGIN}photos?limit=${limit}&page=${totalPages - 1}`
                    },
                    previous: page === 0 || page - 1 > totalPages - 1 ? null : {
                        page: page - 1,
                        href: `${process.env.WEBSERVICE_ORIGIN}photos?limit=${limit}&page=${page - 1}`
                    },
                    next: page >= totalPages - 1 ? null : {
                        page: page + 1,
                        href: `${process.env.WEBSERVICE_ORIGIN}photos?limit=${limit}&page=${page - 1}`
                    }
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
        const result = await Photo.findOne({_id: req.params.id});
        if (result === null) return res.status(404).json({message: 'Not Found'});
        const photo = result.toJSON();
        res.status(200).json({
            ...photo,
            _links: {
                self: {
                    href: `${process.env.WEBSERVICE_ORIGIN}photos/${photo.id}`
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
        const {title, description, name} = req.body;
        if (!title) missingFields.push('title');
        if (!description) missingFields.push('description');
        if (!name) missingFields.push('name');
        if (missingFields.length > 0) {
            return res.status(400).json({error: `Missing required field(s): ${missingFields.join(', ')}`});
        }

        const newPhoto = new Photo(req.body);
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
        const {title, description, name} = req.body;
        if (!title) missingFields.push('title');
        if (!description) missingFields.push('description');
        if (!name) missingFields.push('name');
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
        console.log(await Photo.deleteOne({_id: req.params.id}));
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