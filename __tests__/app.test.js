const app = require("../app")
const request = require("supertest")
const db = require ("../db/connection.js")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")
const { string } = require("pg-format")

afterAll(() => db.end())
beforeEach(() => seed(testData))


describe("* GET/api/topics", () => {
    test('404: non-existent route', () => {
        return request(app)
            .get('/api/topicsss')
            .expect(404)
            .then(({body: { msg }}) => {
                expect(msg).toBe("path not found")
            })
    });

    test("returns status code 200", () => {
        return request(app).get("/api/topics").expect(200)
      })

      test("returns an array", () => {
        return request(app).get("/api/topics").expect(200)
        .then((topics) => {
            expect(topics.body).toBeInstanceOf(Array)
        })
      })
      test("returns an array of topic objects, each of which has a slug and a description property", () => {
        return request(app).get("/api/topics").expect(200)
        .then((topics) => {
            expect(topics.body).toEqual([
                { slug: 'mitch', description: 'The man, the Mitch, the legend' },
                { slug: 'cats', description: 'Not dogs' },
                { slug: 'paper', description: 'what books are made of' }
              ])
        })
      })
})

