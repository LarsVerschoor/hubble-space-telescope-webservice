import express from 'express';
import mongoose from 'mongoose';
import photosRouter from "./routes/photos-router.js";

await mongoose.connect(`mongodb://127.0.0.1/${process.env.DB_NAME}`);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/photos', photosRouter)

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is now listening on port ${process.env.EXPRESS_PORT}`);
});