import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe ('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        app.close()
    })

    it('Should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
            title: 'TypeScript Gym',
            description: 'Near Gym',
            phone: '81988990011',
            latitude: -8.0478208,
            longitude: -34.8924051
        })

        await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
            title: 'JavaScript Gym',
            description: 'Far gym',
            phone: '81988990011',
            latitude: -7.7436312,
            longitude: -34.8261525
        })

        const response = await request(app.server).get('/gyms/nearby')
        .query({
            latitude: -8.0478208,
            longitude: -34.8924051
        })
        .set('Authorization', `Bearer ${token}`)
        .send()
        
        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'TypeScript Gym'
            })
        ])
    })
})
