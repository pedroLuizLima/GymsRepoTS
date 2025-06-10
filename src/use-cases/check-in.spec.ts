import { it, describe, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '../generated/prisma/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository
        gymsRepository = new InMemoryGymsRepository
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        await gymsRepository.create({
            id: 'gym-1',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -8.0478208,
            longitude: -34.8924051
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('Should be able to Check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-1',
            userId: 'user-1',
            userLatitude: -8.0478208,
            userLongitude: -34.8924051
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('Should not be able to Check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-1',
            userId: 'user-1',
            userLatitude: -8.0478208,
            userLongitude: -34.8924051
        })

        await expect(() => sut.execute({
            gymId: 'gym-1',
            userId: 'user-1',
            userLatitude: -8.0478208,
            userLongitude: -34.8924051
        })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('Should be able to Check in twice in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-1',
            userId: 'user-1',
            userLatitude: -8.0478208,
            userLongitude: -34.8924051
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: 'gym-1',
            userId: 'user-1',
            userLatitude: -8.0478208,
            userLongitude: -34.8924051
        })

        expect(checkIn.userId).toEqual(expect.any(String))
    })

    it('Should not be able to Check in on distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-2',
            title: 'Python Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-7.9766273),
            longitude: new Decimal(-34.8459269)
        })
        
        await expect(() => sut.execute({
            gymId: 'gym-2',
            userId: 'user-1',
            userLatitude: -8.0478208,
            userLongitude: -34.8924051
        })).rejects.toBeInstanceOf(MaxDistanceError)
    })
})