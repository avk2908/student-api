const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const port = 4000;

/* =========================
   GraphQL Schema
========================= */
const schema = buildSchema(`
  type Book {
    id: ID
    title: String
    author: String
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
  }
`);

/* =========================
   Sample Data
========================= */
let books = [
  { id: 1, title: "GraphQL Basics", author: "John" },
  { id: 2, title: "Node.js Guide", author: "Alice" }
];

/* =========================
   Resolvers
========================= */
const root = {
  books: () => books,

  book: ({ id }) => {
    return books.find(book => book.id == id);
  },

  addBook: ({ title, author }) => {
    const newBook = {
      id: books.length + 1,
      title,
      author
    };
    books.push(newBook);
    return newBook;
  }
};

/* =========================
   GraphQL Server
========================= */
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/graphql`);
});