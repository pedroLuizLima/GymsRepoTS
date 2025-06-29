import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'
import { prisma } from '../../../lib/prisma'

describe ('Validate Check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        app.close()
    })

    it('Should be able to validate a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        const user = await prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data: {
                title: 'TypeScript Gym',
                latitude: -8.0478208,
                longitude: -34.8924051
            }
        })

        let checkIn = await prisma.checkIn.create({
            data: {
                gymId: gym.id,
                userId: user.id
            }
        })

        const response = await request(app.server).patch(`/check-ins/${checkIn.id}/validate`).set('Authorization', `Bearer ${token}`).send()
        
        expect(response.statusCode).toEqual(204)

        checkIn = await prisma.checkIn.findUniqueOrThrow({
            where: {
                id: checkIn.id
            }
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
    })
})
