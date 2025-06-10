import { hash } from "bcryptjs"
import { UsersRepository } from "../repositories/users-repository"
import { UserAlredyExistsError } from "./errors/user-alredy-exists-error"
import { User } from "../generated/prisma"

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(private usersRespository: UsersRepository) {}

    async execute({ name, email, password }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const password_hash = await hash(password, 6)

        const userWithSameEmail = await this.usersRespository.findUserByEmail(email)

        if (userWithSameEmail) {
            throw new UserAlredyExistsError()
        }

        const user = await this.usersRespository.create({
            name,
            email,
            password_hash
        })

        return {
            user,
        }

    }
}
