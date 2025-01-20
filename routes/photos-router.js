import express from "express";
import requireContentTypeHeader from "../middlewares/require-content-type-header.js";
import requireJsonAcceptHeader from "../middlewares/require-json-accept-header.js";
import photosController from "../controllers/photos-controller.js";

const photosRouter = express.Router();
photosRouter.use(requireJsonAcceptHeader);

photosRouter.get('/', photosController.getAllPhotos);
photosRouter.get('/:id', photosController.getOnePhoto);
photosRouter.post('/', requireContentTypeHeader, photosController.createPhoto);
photosRouter.delete('/:id', photosController.deletePhoto);
photosRouter.put('/:id', requireContentTypeHeader, photosController.putPhoto);
photosRouter.patch('/:id', requireContentTypeHeader, photosController.patchPhoto);
photosRouter.options('/', photosController.setOptionsHeaderOnAllPhotos);
photosRouter.options('/:id', photosController.setOptionsHeaderOnOnePhoto);

export default photosRouter;