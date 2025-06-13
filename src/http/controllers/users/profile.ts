import { FastifyRequest, FastifyReply} from 'fastify'
import { MakeGetUserProfileUseCase } from '../../../use-cases/factories/make-get-user-profile-use-case'

export async function profile (request: FastifyRequest, reply: FastifyReply) {
    const getUserProfile = MakeGetUserProfileUseCase()

    const { user } = await getUserProfile.execute({
        userId: request.user.sub
    })

    return reply.status(200).send({
        user:{
            ...user,
            password_hash: undefined
        }
        })
}