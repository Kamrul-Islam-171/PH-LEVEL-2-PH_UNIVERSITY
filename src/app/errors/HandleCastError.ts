import mongoose from "mongoose";
import { TerrorSourse, TGenericErrorResponse } from "../interface/error";


const HandleCastError = (err: mongoose.Error.CastError) : TGenericErrorResponse => {

    const statusCode = 400;
    const errorSources : TerrorSourse = [{
        path: err?.path,
        message: err?.message
    }]
    // const errorSources  = Object.values(err?.errors);
    // console.log(errorSources);


    return {
        statusCode,
        message : 'Invalid id',
        errorSources
    }
}


export default HandleCastError;