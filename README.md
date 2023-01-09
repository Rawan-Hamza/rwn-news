Welcome to RWN News repo

to view the hosted project: 
https://rwn-news.onrender.com/

This is a news project built on JS, React that allows the user to read write and delete articles.

- fork the repo into your GitHub account
- clone the repo into your local machine

- install the following depenencies by running the code for each one.  
    1- cors : $ npm i cors 
    2- dotenv: $ npm i dotenv
    3- express: $ npm i express
    4- jest-sorted: $ npm i jest-sorted
    5- pg: $ npm i pg
    6- supertest: $ npm i supertest


- to run the tests: $ npm test app.test.js

- create a couple of .env files:
    1: .env.test file that will have PGDATABASE=nc_news_test
    2: .env.development file that will have PGDATABASE=nc_news

- to seed the data: $ npm run seed

minimum versions required to to run this project: 
node.js: v18.10.0
Postgres: v14.5