const app = require("../app");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("/* non-existing endpoints", () => {
  test("404: non-existent route", () => {
    return request(app)
      .get("/non-existing")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path not found");
      });
  });
});

describe("* GET/api/topics", () => {
  test("returns status code 200", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("returns an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((topics) => {
        expect(topics.body).toBeInstanceOf(Array);
        expect(topics.body.length).toBe(3);
      });
  });
  test("returns an array of topic objects, each of which has a slug and a description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((topics) => {
        topics.body.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("* GET/api/articles", () => {
  test("returns status code 200", () => {
    return request(app).get("/api/articles").expect(200);
  });

  test("returns an array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((articles) => {
        expect(articles.body).toBeInstanceOf(Array);
        expect(articles.body.length).toBe(12);
      });
  });

  test("returns an array of article objects, each containing several properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((articles) => {
        articles.body.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });

  test("returns an array of article objects,ordered by date, Newist first", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((articles) => {
        expect(articles.body).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("returns an array of article objects,each containing a comments quantity property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((articles) => {
        articles.body.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({ comment_count: expect.any(Number) })
          );
        });
      });
  });
});
