import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import AppError from "../../errors/AppError";


const AcademicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    academicFaculty : {
        type: Schema.Types.ObjectId,
        ref: 'AcademicFacultyModel', // model name
        required: true
    }
  },
  { timestamps: true }
);




// akta department akbar e thakbe
// ei validation amra service e korte pari, pre hook dia korte pari abr static mehtod dia o korte pari
// AcademicDepartmentSchema.pre('save', async function(next)  {
//   const isDepartmentExist = await AcademicDepartmentModel.findOne({name: this.name});
//   if(isDepartmentExist) {
//     throw new AppError(404,'This department is already exists');
//   }
//   next();
// })

// akhon jodi ami delete kora id k update korte chai tobe seitao handle korte hobe
// er jonno query middleware use korte hobe

//  AcademicDepartmentSchema.pre('findOneAndUpdate', async function(next) {

//   const query = this.getQuery();
//   console.log(query);
//   const isDepartmentExist = await AcademicDepartmentModel.findOne(query);
//   if(!isDepartmentExist) {
//     throw new AppError(httpStatus.NOT_FOUND,"this dept is not exists")
//   }

//   //write proper code for update
//   next();
// })

export const AcademicDepartmentModel = model<TAcademicDepartment>(
  "AcademicDepartmentModel",
  AcademicDepartmentSchema
);
