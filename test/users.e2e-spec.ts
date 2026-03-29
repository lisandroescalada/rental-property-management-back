import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'

describe('Users (E2E)', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('GET /users', () => {
        it('responds with 200 and an array', () => {
            return request(app.getHttpServer())
                .get('/users')
                .expect(200)
                .expect(res => {
                    expect(Array.isArray(res.body)).toBe(true)
                })
        })

        it('accepts pagination query params', () => {
            return request(app.getHttpServer())
                .get('/users?page=1&limit=5')
                .expect(200)
        })
    })

    describe('GET /users/:id', () => {
        it('responds with 400 if the id is not a number', () => {
            return request(app.getHttpServer())
                .get('/users/abc')
                .expect(400)
        })

        it('responds with 404 if the user does not exist', () => {
            return request(app.getHttpServer())
                .get('/users/999999')
                .expect(404)
        })
    })

    describe('POST /users', () => {
        it('responds with 400 if required fields are missing', () => {
            return request(app.getHttpServer())
                .post('/users')
                .send({ name: 'No email' })
                .expect(400)
        })

        it('responds with 400 if the email is invalid', () => {
            return request(app.getHttpServer())
                .post('/users')
                .send({ name: 'Test', email: 'not-an-email', password: 'pass1234' })
                .expect(400)
        })
    })

    describe('PATCH /users/:id', () => {
        it('responds with 404 if the user does not exist', () => {
            return request(app.getHttpServer())
                .patch('/users/999999')
                .send({ name: 'New Name' })
                .expect(404)
        })
    })

    describe('DELETE /users/:id', () => {
        it('responds with 404 if the user does not exist', () => {
            return request(app.getHttpServer())
                .delete('/users/999999')
                .expect(404)
        })
    })
})
