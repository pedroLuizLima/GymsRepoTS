import { it, describe, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'


let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository
        sut = new FetchNearbyGymsUseCase(gymsRepository)
    })

    it('Should be able to search gym', async () => {
        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -8.0478208,
            longitude: -34.8924051
        })
        
        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -7.7436312,
            longitude: -34.8261525
        })

        const { gyms } = await sut.execute({
            userLatitude: -8.0478208,
            userLongitude: -34.8924051
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' })
        ])
    })

    
})