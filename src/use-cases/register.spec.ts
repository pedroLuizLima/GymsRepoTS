import { it, describe, expect, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UserAlredyExistsError } from './errors/user-alredy-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository
        sut = new RegisterUseCase(inMemoryUsersRepository)
    })



    it('Should be able to resgister', async () => {
        const { user } = await sut.execute({
            name: 'Pedro Luiz',
            email: 'pedro123@example.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('Should hash users password upon registration', async () => {
        const { user } = await sut.execute({
            name: 'Pedro Luiz',
            email: 'pedro123@example.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash
        )

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('Should not be able to resgister the same email twice', async () => {
        const { user } = await sut.execute({
            name: 'Pedro Luiz',
            email: 'pedro123@example.com',
            password: '123456'
        })

        await expect(() => 
        sut.execute({
            name: 'Pedro Luiz',
            email: 'pedro123@example.com',
            password: '123456'
        })
        ).rejects.toBeInstanceOf(UserAlredyExistsError)
    })
})