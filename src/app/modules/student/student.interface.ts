import { Types } from "mongoose";

export type Gurdian = {
  fatherName: string;
  fatherOccupation: string;
};

export type User = {
  firsName: string;
  lastName: string;
};

export type LocalGaurdian = {
    name : string;
    address : string;
}

export type Student = {
  id: string;
  password: string;
  user: Types.ObjectId;
  name: User;
  gender: "Male" | "Female";
  dateOfBirth: string;
  email: string;
  avatar?: string;
  gurdian: Gurdian;
  localGuardian : LocalGaurdian;
  profileImg?: string;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  isDeleted : boolean
};
