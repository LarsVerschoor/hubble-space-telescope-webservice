import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    distance: {type: String, required: true},
    imageFileName: {type: String, required: false},
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            ret.imageUrl = ret.imageFileName ? `${process.env.WEBSERVICE_ORIGIN}images/${ret.imageFileName}` : null;

            ret._links = {
                self: {
                    href: `${process.env.WEBSERVICE_ORIGIN}photos/${ret.id}/`
                },
                collection: {
                    href: `${process.env.WEBSERVICE_ORIGIN}photos/`
                }
            }

            delete ret._id;
            delete ret.__v;
            delete ret.imageFileName;
        }
    }
});

const Photo = mongoose.model('photo', photoSchema);

export default Photo;