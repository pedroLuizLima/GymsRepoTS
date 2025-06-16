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

    it('Should be able to search gyms by title', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
            title: 'TypeScript Gym',
            description: 'Some Description',
            phone: '81988990011',
            latitude: -8.0478208,
            longitude: -34.8924051
        })

        await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
            title: 'JavaScript Gym',
            description: 'Some Description',
            phone: '81988990011',
            latitude: -8.0478208,
            longitude: -34.8924051
        })

        const response = await request(app.server).get('/gyms/search')
        .query({ query: 'JavaScript' })
        .set('Authorization', `Bearer ${token}`)
        .send()
        
        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym'
            })
        ])
    })
})
