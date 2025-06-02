const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
app.use(express.json());

let campaigns = [
  { id: "1", title: "Clean Water", goal: 1000 },
  { id: "2", title: "Education", goal: 2000 },
];

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
  campaigns: () => campaigns,
  campaign: ({ id }) => campaigns.find((c) => c.id === id),
};

app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));
app.get("/ping", (_, res) => res.send("pong"));
app.get("/health", (_, res) => res.json({ status: "ok" }));
app.get("/metrics", (_, res) => res.json({ campaigns: campaigns.length }));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Campaign service running on ${PORT}`));