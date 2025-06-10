import { it, describe, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-in History Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository
        sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
    })

    it('Should be able to fetch check-in history', async () => {
        await checkInsRepository.create({
            gymId: 'Gym-1',
            userId: 'user-1'
        })
        
        await checkInsRepository.create({
            gymId: 'Gym-2',
            userId: 'user-1'
        })

        const { checkIns } = await sut.execute({
            userId: 'user-1',
            page: 1
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gymId: 'Gym-1' }),
            expect.objectContaining({ gymId: 'Gym-2' })
        ])
    })

    it('Should be able to fetch paginated check-in history', async () => {  
        for (let i = 1; i <= 22 ; i++) {
            await checkInsRepository.create({
            gymId: `Gym-${i}`,
            userId: 'user-1'
        })
        }

        const { checkIns } = await sut.execute({
            userId: 'user-1',
            page: 2
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gymId: 'Gym-21' }),
            expect.objectContaining({ gymId: 'Gym-22' })
        ])
    })
})