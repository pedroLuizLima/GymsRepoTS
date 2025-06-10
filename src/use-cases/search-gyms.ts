import { Gym } from "../generated/prisma"
import { GymsRepository } from "../repositories/gyms-repository"

interface SearchGymsUseCaseRequest {
    query: string
    page: number
}

interface SearchGymsUseCaseResponse {
    gyms: Gym[]
}

export class SearchGymsUseCase {
    constructor(private gymsRespository: GymsRepository) {}

    async execute({ query, page }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
        const gyms = await this.gymsRespository.searchMany(query, page)

        return {
            gyms,
        }

    }
}
