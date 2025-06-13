import { z } from "zod"
import { FastifyRequest, FastifyReply} from 'fastify'
import { MakeFetchUserCheckInsHistoryUseCase } from "../../../use-cases/factories/make-fetch-user-check-ins-history"

export async function history (request: FastifyRequest, reply: FastifyReply) {
    const checkInsHistoryQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1)
    })

    const { page } = checkInsHistoryQuerySchema.parse(request.query)
        const fetchUserCheckInsHistoryUseCase = MakeFetchUserCheckInsHistoryUseCase()

        const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
            userId: request.user.sub,
            page
        })

    return reply.status(200).send({
        checkIns
    })
}