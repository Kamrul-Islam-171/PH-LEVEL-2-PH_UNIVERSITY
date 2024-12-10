

export type TUser = {
    id: string;
    password: string;
    needsPasswordChange: boolean;
    role : 'admin' | 'student' | 'faculty';
    isDeleted : boolean;
    status : 'blocked' | 'in-progress'; // user jodi blocked hoy taile r login korte dibo na
}

// export type NewUser = {
//     password : string;
//     role:string; 
//     id: string;
// }