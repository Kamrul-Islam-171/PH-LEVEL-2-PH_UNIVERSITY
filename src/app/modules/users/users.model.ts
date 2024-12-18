import { model, Schema } from "mongoose";
import { TUser, UserStaticModel } from "./users.interface";
import bcrypt from "bcrypt";

/*

important notes

eikhane amra user exist kore ki na ei gula check korte pari (static or pre middleware hook user kore)

jodi static use kori taile type er jaygay interface use korche hobe (check mongoose documentation)

*/

const UsersSchema = new Schema<TUser, UserStaticModel>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0, // tahole get korar time e populate korle password ta show korbe na
    },
    passwordChangeAt: {
      type: Date,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "student", "faculty"],
    },
    status: {
      type: String,
      enum: ["blocked", "in-progress"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

//document middle ware
UsersSchema.pre("save", async function (next) {
  // console.log(this, 'pre hook : we wil ssave data');
  // console.log({'userBeforeHash': this});
  this.password = await bcrypt.hash(this.password, 12);
  // console.log({'userAfterHashPass': this});
  next();
});

UsersSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

UsersSchema.statics.isUserExistsByCustomID = async function (id: string) {
  return await UserModel.findOne({ id }).select("+password");
};
UsersSchema.statics.isPasswordMatched = async function (
  plaintextPass,
  hassedPass
) {
  return await bcrypt.compare(plaintextPass, hassedPass);
};

// normarl function. karon kono promise return korbe na
UsersSchema.statics.isJWTIssuedBeforePasswordChange = function (
  passwordChangeTimeStamp: Date,
  jwtIssuedTimestamp: number
) {
  // passwordChangeTimestamp = pass kokhon change hoiche
  // jwtissuedtimestamp = jwt token kokohon create hoichilo.

  // true hoile = pass recently change hoiche
  // console.log(passwordChangeTimeStamp, jwtIssuedTimestamp);
  // return passwordChangeTimeStamp > jwtIssuedTimestamp;

  // const passChangeTimestamp = new Date(passwordChangeTimeStamp).getTime(); mili second e dibe time k
  // r jwt  second e ache. tai tar sathe 1000 dia multiply korbo
  const passChangeTimestamp = new Date(passwordChangeTimeStamp).getTime();
  jwtIssuedTimestamp = jwtIssuedTimestamp * 1000;
  // console.log(passChangeTimestamp, jwtIssuedTimestamp)
  return passChangeTimestamp > jwtIssuedTimestamp;
};
export const UserModel = model<TUser, UserStaticModel>(
  "UserModel",
  UsersSchema
);
