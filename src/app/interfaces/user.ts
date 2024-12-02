import { Role } from "./role";


export interface User {
    userId: number,
    name: string,
    email: string,
    role?: Role,
    isAdmin?: boolean,
    image: string
}