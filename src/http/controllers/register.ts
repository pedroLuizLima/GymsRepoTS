import { z } from "zod"
import { FastifyRequest, FastifyReply} from 'fastify'
import { UserAlredyExistsError } from "../../use-cases/errors/user-alredy-exists-error"
import { MakeRegisterUseCase } from "../../use-cases/factories/make-register-use-case"

export async function register (request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
        const registerUseCase = MakeRegisterUseCase()

        await registerUseCase.execute({
            name,
            email,
            password
        })
    } catch (err) {
        if(err instanceof UserAlredyExistsError){
            return reply.status(409).send({ message: err.message })
        }
        return reply.status(500).send()
    }

    return reply.status(201).send()
}