import { it, describe, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
            inMemoryUsersRepository = new InMemoryUsersRepository
            sut = new AuthenticateUseCase(inMemoryUsersRepository)
        })

    it('Should be able to authenticate', async () => {
        await inMemoryUsersRepository.create({
            name: 'Pedro Luiz',
            email: 'pedro123@example.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            email: 'pedro123@example.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('Should not be able to authenticate with wrong Email', async () => {
        await inMemoryUsersRepository.create({
            name: 'Pedro Luiz',
            email: 'pedro123@example.com',
            password_hash: await hash('123456', 6)
        })

        await expect(() =>
        sut.execute({
            email: 'pedro124@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('Should not be able to authenticate with wrong password', async () => {
        await inMemoryUsersRepository.create({
            name: 'Pedro Luiz',
            email: 'pedro123@example.com',
            password_hash: await hash('123456', 6)
        })

        await expect(() =>
        sut.execute({
            email: 'pedro123@example.com',
            password: '123123'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})