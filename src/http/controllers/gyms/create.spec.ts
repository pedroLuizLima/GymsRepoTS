import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe ('Create Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        app.close()
    })

    it('Should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const response = await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
            title: 'TypeScript Gym',
            description: 'Some Description',
            phone: '81988990011',
            latitude: -8.0478208,
            longitude: -34.8924051
        })
        
        expect(response.statusCode).toEqual(201)
    })
})
