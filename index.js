const express = require("express");
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
app.use(express.json());

let db;
MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true })
  .then(client => {
db = client.db('charity');
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

const schema = buildSchema(`
  type Campaign {
    id: ID!
    title: String!
    goal: Int!
  }
  type Query {
    campaigns: [Campaign]
    campaign(id: ID!): Campaign
  }
`);

const root = {
  campaigns: async () =>
    await db.collection("campaigns").find().toArray(),
  campaign: async ({ id }) =>
    await db.collection("campaigns").findOne({ id }),
};

app.use(
  "/graphql",
  graphqlHTTP({ schema, rootValue: root, graphiql: true })
);
app.get("/ping", (_, res) => res.send("pong"));
app.get("/health", (_, res) => res.json({ status: "ok" }));
app.get("/metrics", async (_, res) => {
  const count = await db.collection('campaigns').countDocuments();
  res.json({ campaigns: count });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Campaign service running on ${PORT}`));