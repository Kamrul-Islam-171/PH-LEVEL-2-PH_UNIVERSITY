/*

important notes

eikhane amra user exist kore ki na ei gula check korte pari (static or pre middleware hook user kore)

jodi static use kori taile type er jaygay interface use korche hobe (check mongoose documentation)

*/

import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
  id: string;
  email: string;
  password: string;
  passwordChangeAt:Date;
  needsPasswordChange?: boolean;
  role: "admin" | "student" | "faculty";
  isDeleted: boolean;
  status: "blocked" | "in-progress"; // user jodi blocked hoy taile r login korte dibo na
}

export interface UserStaticModel extends Model<TUser> {
  // akhon ei khane amra validation er jonno akta method declare korbo
  isUserExistsByCustomID(id: string): Promise<TUser>;

  isPasswordMatched(plaintextPass:string, hassedPass:string) :Promise<boolean>; 

  //pass change hoile token k invalid korte hobe
  isJWTIssuedBeforePasswordChange(passwordChangeTimeStamp:Date, jwtIssuedTimestamp: number): boolean;
  // promise return korbe
}

// export type NewUser = {
//     password : string;
//     role:string;
//     id: string;
// }

export type TUserRole = keyof typeof USER_ROLE;
