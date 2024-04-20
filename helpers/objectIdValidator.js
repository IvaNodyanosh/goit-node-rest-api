import { isValidObjectId } from "mongoose";
import HttpError from "./HttpError.js";

export const objectIdValidator = (req, __, next) => {

    const { id } = req.params;
    if (isValidObjectId(id)) {
        next()
    } else {
        throw HttpError(400, 'invalid id')
    }
}