import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    dateCaptured: {type: Date, required: true},
    dateUploaded: {type: Date, required: true}
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            ret.imageUrl = `http://145.24.223.230/photos/${ret.id}/image/`

            ret._links = {
                self: `http://145.24.223.230/photos/${ret.id}/`,
                collection: 'http://145.24.223.230/photos/'
            }

            delete ret._id;
            delete ret.__v;
            delete ret.image;
        }
    }
});

const Photo = mongoose.model('photo', photoSchema);

export default Photo;