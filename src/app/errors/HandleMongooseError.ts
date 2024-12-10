import mongoose from "mongoose";
import { TerrorSourse, TGenericErrorResponse } from "../interface/error";


// kew jate onno type er variable pass na korte pare
// type TGenericErrorResponse = {
//     statusCode: number;
//     message: string;
//     errorSources: TerrorSourse
// }

const HandleMongooseError = (err: mongoose.Error.ValidationError) : TGenericErrorResponse => {
    const statusCode = 400;
    const errorSources : TerrorSourse = Object.values(err?.errors).map((val : mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
        return {
            path: val?.path,
            message: val?.message
        }
    })
    // const errorSources  = Object.values(err?.errors);
    // console.log(errorSources);
    
    
    
    return {
        
        statusCode,
        message: 'Validation Error!!',
        errorSources
    }
}


export default HandleMongooseError ;