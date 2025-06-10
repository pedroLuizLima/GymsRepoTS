import { it, describe, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'


let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository
        sut = new ValidateCheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('Should be able to validate the check-in', async () => {
        const createdCheckIn = await checkInsRepository.create({
            gymId: 'gym-1',
            userId: 'user-1',
        })
        
        
        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
    })

    it('Should not be able to validate an inexisting check-in', async () => {
        await expect(() =>
            sut.execute({
                checkInId: 'inexisting-check-in-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it('Should not be able to validate an check-in after 20 minutes', async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 13, 40))

        const createdCheckIn = await checkInsRepository.create({
            gymId: 'gym-1',
            userId: 'user-1',
        })

        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs)
        
        await expect(() =>
            sut.execute({
                checkInId: createdCheckIn.id
            })
        ).rejects.toBeInstanceOf(LateCheckInValidationError)
    })
})