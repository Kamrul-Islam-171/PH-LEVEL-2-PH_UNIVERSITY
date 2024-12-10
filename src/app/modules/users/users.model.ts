import { model, Schema } from "mongoose";
import { TUser } from "./users.interface";
import  bcrypt  from 'bcrypt';

const UsersSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UsersSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

export const UserModel = model<TUser>("UserModel", UsersSchema);
