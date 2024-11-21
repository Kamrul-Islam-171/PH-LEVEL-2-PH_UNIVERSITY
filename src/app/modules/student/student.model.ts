import { Schema, model, connect } from "mongoose";
import { Gurdian, LocalGaurdian, Student, User } from "./student.interface";
import validator from "validator";
import bcrypt from "bcrypt";
const userSchema = new Schema<User>({
  firsName: {
    type: String,
    trim: true,
    required: [true, "vai first name lagbei lagbe"],
    maxlength: [20, "Max allowed length is 20"],
    validate: {
      validator: function (value: string) {
        const firsNameStr = value.charAt(0).toUpperCase() + value.slice(1); // "Kamrul" this format
        return firsNameStr === value;
      },
      message: "{VALUE} is not capatilized format",
    },
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "vai last name lagbei lagbe"],
    maxlength: [20, "Max allowed length is 20"],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: "{VALUE} is not valid",
    },
  },
});

const gurdianSchema = new Schema<Gurdian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
});

const localguardianSchema = new Schema<LocalGaurdian>({
  name: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<Student>({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: {
    type: userSchema,
    required: true,
  },
  gender: {
    type: String,
    enum: {
      values: ["Male", "Female"],
      message: "{VALUE} is no valid",
    },
    required: true,
  },
  dateOfBirth: { type: String, required: true },
  gurdian: {
    type: gurdianSchema,
    required: true,
  },
  localGuardian: {
    type: localguardianSchema,
    required: true,
  },
  profileImg: { type: String, required: true },
  isActive: {
    type: String,
    enum: ["active", "inActive"],
    default: "active",
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: "{VALUE} is not a valid email type",
    },
  },
});

//document middle ware
studentSchema.pre("save", async function (next) {
  // console.log(this, 'pre hook : we wil ssave data');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

studentSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

//query middle ware
studentSchema.pre("find", function (next) {
  this.find({isDeleted : {$ne : true}})

  next();
});
studentSchema.pre("findOne", function (next) {
  this.find({isDeleted : {$ne : true}})

  next();
});

//aggreage middleware
studentSchema.pre("aggregate", function (next) {
  //[{$match : {isDeleted : {$ne : true}}}] ei ta add korte hobe pipeline e

  this.pipeline().unshift({$match : {isDeleted : {$ne : true}}})

  next();
});

// 3. Create a Model.
export const StudentModel = model<Student>("Student", studentSchema);
