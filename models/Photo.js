import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: false},
    name: {type: String, required: true},
    dateCaptured: {type: Date, required: false},
    dateUploaded: {type: Date, required: false}
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            // ret.image = `${process.env.WEBSERVICE_ORIGIN}photos/${ret.id}/image/`

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
            // delete ret.image;
        }
    }
});

const Photo = mongoose.model('photo', photoSchema);

export default Photo;