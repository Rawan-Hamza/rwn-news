const app = require("../app");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");


afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("* GET/api/topics", () => {
  test("404: non-existent route", () => {
    return request(app)
      .get("/api/topicsss")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path not found");
      });
  });

  test("returns status code 200", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("returns an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((topics) => {
        expect(topics.body).toBeInstanceOf(Array);
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
  test("404: non-existent route", () => {
    return request(app)
      .get("/api/articels")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path not found");
      });
  });

  test("returns status code 200", () => {
    return request(app).get("/api/articles").expect(200);
  });

  test("returns an array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((articles) => {
        expect(articles.body).toBeInstanceOf(Array);
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
        expect(articles.body).toBeSortedBy("created_at", {descending: true});
      });
  });

  test("returns an array of article objects,each containing a comments quantity property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((articles) => {
        articles.body.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              comment_count: expect.any(Number),
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

});
