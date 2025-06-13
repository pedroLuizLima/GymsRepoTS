import { z } from "zod"
import { FastifyRequest, FastifyReply} from 'fastify'
import { MakeCheckInUseCase } from "../../../use-cases/factories/make-check-in-use-case"

export async function create (request: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid()
    })
    
    const createCheckInBodySchema = z.object({
        latitude: z.coerce.number().refine(value => { return Math.abs(value) <= 90 }),
        longitude: z.coerce.number().refine(value => { return Math.abs(value) <= 180 })
    })

    const { latitude, longitude } = createCheckInBodySchema.parse(request.body)
    const { gymId } = createCheckInParamsSchema.parse(request.params)

        const checkInUseCase = MakeCheckInUseCase()

        await checkInUseCase.execute({
            gymId,
            userId: request.user.sub,
            userLatitude: latitude,
            userLongitude: longitude
        })

    return reply.status(201).send()
}