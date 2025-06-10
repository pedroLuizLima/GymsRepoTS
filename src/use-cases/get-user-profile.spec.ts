import { it, describe, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
            inMemoryUsersRepository = new InMemoryUsersRepository
            sut = new GetUserProfileUseCase(inMemoryUsersRepository)
        })

    it('Should be able to get user profile by id', async () => {
        const createdUser = await inMemoryUsersRepository.create({
            name: 'Pedro Luiz',
            email: 'pedro123@example.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            userId: createdUser.id
        })

        expect(user.name).toEqual('Pedro Luiz')
    })

    it('Should not be able to get user profile with wrong id', async () => {
        await expect(() =>
        sut.execute({
            userId: 'non-existing-id'
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})