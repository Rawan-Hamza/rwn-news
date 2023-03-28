# RWN News API

We will be building an API for the purpose of accessing news data programmatically. We will be building a backend service which should provide this information to the front end architecture.

Our database is built using PSQL, and we will be interacting with it using node-postgres. It contains data on users, articles, categories and comments, which are accessible via the endpoints provided and appropriate GET, POST, PATCH and DELETE methods.

## Hosted Version

To view the hosted project version of this API, please follow the link below:
https://rwn-news.onrender.com/

## Prerequisites

Please ensure the following are installed on your client as a minimum version, otherwise `npm install` will fail:

- Node: v18.10.0
- PSQL: v14.5

## Setting up

To set up your own repository, please follow the instructions below:

1. Copy the code from the repository and clone it to your client locally, using the following command:
   ```
   git clone https://github.com/Rawan-Hamza/rwn-news.git
   ```
2. Once it has been successfully cloned, access and open the directory using your code editor of choice (e.g. VSCode):
   ```
   cd rwn-news/code
   ```
3. In your editor, you will need to install all required dependencies using node package manager, using the `npm install` command.
4. The following dependencies should now be installed:
   - cors v2.8.5
   - dotenv v16.0.0
   - express v4.18.2
   - pg v8.7.3
   - pg-format v1.0.4
5. The following developer dependencies should now be installed:
   - husky v7.0.0
   - jest v27.5.1
   - jest-extended v2.0.0
   - jest-sorted v1.0.14
   - supertest v6.3.3
6. After cloning the repo locally, you will need to create the necessary environment variables in order to complete the setup and to successfully connect to both the development and test databases locally.
7. Create a couple of `.env` files:
   - `.env.test` file that will have `PGDATABASE=nc_news_test`
   - `.env.development` file that will have `PGDATABASE=nc_news`
8. Ensure both files are added to your `.gitignore` file so that they are not committed and pushed to your public repo on Github.
9. Create both databases by running the following command in your terminal:
   ```
   npm run setup-dbs
   ```
10. The console should confirm the two databases have been created. If an error occurs, please ensure you have named/set up the `.env` files as outlined in step 7, and that they are stored in the root level of your directory.
11. The development database can then be seeded by running the following command in the terminal:
    ```
    npm run seed
    ```
12. The terminal should confirm that four tables have been inserted into. If an error occurs, please ensure you have created the databases prior to seeding.
13. All that's left is to run the server locally, by using the following command:
    ```
    npm start
    ```
14. The terminal should confirm that it has started listening for requests.

## Testing

The tests created can be found in the following directory:

**tests**/app.test.js

To run the testing suite, run the following command in
