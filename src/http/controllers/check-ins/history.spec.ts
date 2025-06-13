import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'
import { prisma } from '../../../lib/prisma'

describe ('Check-in history (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        app.close()
    })

    it('Should be able to list the history of check-ins', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user = await prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data: {
                title: 'TypeScript Gym',
                latitude: -8.0478208,
                longitude: -34.8924051
            }
        })

        await prisma.checkIn.createMany({
            data: [
                {
                    gymId: gym.id,
                    userId: user.id
                },
                {
                    gymId: gym.id,
                    userId: user.id
                }
            ]
        })

        const response = await request(app.server).get('/check-ins/history').set('Authorization', `Bearer ${token}`).send()
        
        expect(response.statusCode).toEqual(200)
        expect(response.body.checkIns).toEqual([
            expect.objectContaining({
                gymId: gym.id,
                userId: user.id
            }),
            expect.objectContaining({
                gymId: gym.id,
                userId: user.id
            })
        ])
    })
})
