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

describe("3. GET/api/topics", () => {
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

describe("4. GET/api/articles", () => {
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

describe("5. GET/api/articles/:article_id", () => {
  test("returns status code 200", () => {
    return request(app).get("/api/articles/3").expect(200);
  });

  test("responds with a single matching article", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
          })
        );
      });
  });

  test("returns status code 404 when given non-existent article_id", () => {
    return request(app)
      .get("/api/articles/16572")
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("not found");
      });
  });

  test("returns status code 400 when given invalid article_id", () => {
    return request(app)
      .get("/api/articles/nnZnn")
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("bad request");
      });
  });
});

describe("6. GET/api/articles/:article_id/comments", () => {
  test("returns status code 200", () => {
    return request(app).get("/api/articles/3/comments").expect(200);
  });

  test("responds with a single matching article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              article_id: 3,
              body: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });

  test("responds with an empty array when an article has no comments", () => {
    return request(app).get("/api/articles/7/comments").expect(200);
  });

  test("returns comments in date order newist first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("returns status code 400 when given non-existent article_id", () => {
    return request(app)
      .get("/api/articles/5345/comments")
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("not found");
      });
  });

  test("returns status code 400 when given invalid article_id", () => {
    return request(app)
      .get("/api/articles/zzNdf/comments")
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe("bad request");
      });
  });
});

describe("7. POST/api/articles/:article_id/comments", () => {
  test("returns status 201 and the posted comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Hi this article is good",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { addedComment } = response.body;
        expect.objectContaining({
          comment_id: expect.any(Number),
          article_id: 2,
          body: "Hi this article is good",
          author: "icellusedkars",
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });

  test("returns status 404 not found", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Hi this article is good",
    };
    return request(app)
      .post("/api/articles/90/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("not found");
      });
  });

  test("returns status 400 bad request", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Hi this article is good",
    };
    return request(app)
      .post("/api/articles/nnzna/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("bad request");
      });
  });

  test("returns status 400 bad request", () => {
    const newComment = {
      car: "toyota",
      colour: "red",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("bad request");
      });
  });
});
