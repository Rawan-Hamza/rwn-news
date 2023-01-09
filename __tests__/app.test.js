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

  test("responds with the comments of a single matching article", () => {
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

  test("returns status 400 bad request with invalid article_id", () => {
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

  test("returns status 400 bad request when sending invalid data", () => {
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

describe("8. PATCH/api/articles/:article_id", () => {
  test("returns status 200 and the updated article with increased votes", () => {
    const updatedVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/2")
      .send(updatedVotes)
      .expect(200)
      .then((response) => {
        const { updatedArticle } = response.body;
        expect(updatedArticle).toMatchObject({
          article_id: 2,
          votes: 1,
        });
      });
  });

  test("returns status 200 and the updated article with decreased votes", () => {
    const updatedVotes = { inc_votes: -25 };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVotes)
      .expect(200)
      .then((response) => {
        const { updatedArticle } = response.body;
        expect(updatedArticle).toMatchObject({
          article_id: 1,
          votes: 75,
        });
      });
  });

  test("returns status 400 bad request when the path is invalid", () => {
    const updatedVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/nnzna")
      .send(updatedVotes)
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("bad request");
      });
  });

  test("returns status 400 bad request when the inc_votes value is invalid", () => {
    const updatedVotes = { inc_votes: "banana" };
    return request(app)
      .patch("/api/articles/2")
      .send(updatedVotes)
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("bad request");
      });
  });

  test("returns status 400 bad request when the inc_votes key is misspelled", () => {
    const updatedVotes = { Binc_Dotes: 1 };
    return request(app)
      .patch("/api/articles/2")
      .send(updatedVotes)
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("9. GET/api/users", () => {
  test("returns status code 200", () => {
    return request(app).get("/api/users").expect(200);
  });

  test("returns an array", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body;
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBe(4);
      });
  });
  test("returns an array of topic objects, each of which has a slug and a description property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body;
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("10. GET /api/articles (queries)", () => {
  test("returns status codes 200, accepts a topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((articles) => {
        expect(articles.body).toBeInstanceOf(Array);
        expect(articles.body.length).toBe(1);
      });
  });

  test("returns status codes 200, accepts a sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then((articles) => {
        expect(articles.body).toBeSortedBy("comment_count", {
          descending: true,
        });
      });
  });

  test("returns 400, when given an invalid query", () => {
    return request(app).get("/api/articles?sort_by=INVALIDQUERY").expect(400);
  });
});

describe("11. GET /api/articles/:article_id (comment count)", () => {
  test("responds with a single matching article containing the comment_count", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 3,
            comment_count: expect.any(Number),
          })
        );
      });
  });
});

describe("12. DELETE /api/comments/:comment_id", () => {
  test("returns status 204 no content", () => {
    return request(app).delete("/api/comments/4").expect(204);
  });

  test("returns status 404 not found when passed a non-existent comment_id", () => {
    return request(app).delete("/api/comments/99").expect(404);
  });
});

describe("13. GET /api", () => {
  test("returns an endpoints JSON with all the available endpoints", () => {
    return request(app).get("/api").expect(200);
  });
});
