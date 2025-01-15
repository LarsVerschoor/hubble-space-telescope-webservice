import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is now listening on port ${process.env.EXPRESS_PORT}`);
});