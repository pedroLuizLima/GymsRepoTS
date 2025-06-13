import { randomUUID } from "node:crypto";
import { Prisma, User } from "../../generated/prisma";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
    public items: User [] = []

    async findUserById(id: string) {
        const user = this.items.find(item => item.id == id)

        if (!user) {
            return null
        }

        return user
    }

    async findUserByEmail(email: string) {
        const user = this.items.find(item => item.email == email)

        if (!user) {
            return null
        }

        return user
    }

    async create(data: Prisma.UserCreateInput) {
        const user = {
                id: randomUUID(),
                name: data.name,
                email: data.email,
                password_hash: data.password_hash,
                created_at: new Date()
            }
            
            this.items.push(user)

            return user
    }    
}