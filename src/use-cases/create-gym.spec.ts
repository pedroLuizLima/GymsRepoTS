import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository
        sut = new CreateGymUseCase(gymsRepository)
    })



    it('Should be able to create gym', async () => {
        const { gym } = await sut.execute({
            title: 'NextJs Gym',
            description: null,
            phone: null,
            latitude: -8.0478208,
            longitude: -34.8924051
            
        })

        expect (gym.id).toEqual(expect.any(String))
    })
})