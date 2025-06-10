import { it, describe, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository
        sut = new GetUserMetricsUseCase(checkInsRepository)
    })

    it('Should be able to get check-ins count from metrics', async () => {
        await checkInsRepository.create({
            gymId: 'Gym-1',
            userId: 'user-1'
        })
        
        await checkInsRepository.create({
            gymId: 'Gym-2',
            userId: 'user-1'
        })

        const { checkInsCount } = await sut.execute({
            userId: 'user-1'
        })

        expect(checkInsCount).toEqual(2)
    })
})