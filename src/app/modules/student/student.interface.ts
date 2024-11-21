
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
  name: User;
  gender: "Male" | "Female";
  dateOfBirth: string;
  email: string;
  avatar?: string;
  gurdian: Gurdian;
  localGuardian : LocalGaurdian;
  profileImg?: string;
  isActive : 'active' | 'inActive';
  isDeleted : boolean
};
