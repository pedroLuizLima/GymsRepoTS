import { Prisma, User } from "../generated/prisma";


export interface UsersRepository {
    findUserById(id: string): Promise <User | null>
    findUserByEmail(email: string): Promise <User | null>
    create(data: Prisma.UserCreateInput): Promise <User>
}