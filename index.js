const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

let campaigns = [
  { id: '1', title: 'Clean Water', goal: 10000 },
  { id: '2', title: 'Books for Children', goal: 5000 }
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
  campaign: ({ id }) => campaigns.find(c => c.id === id)
};

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

app.get('/metrics', (_, res) => res.json({ campaigns: campaigns.length }));
app.get('/health', (_, res) => res.send('ok'));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Campaign service running on ${PORT}`));
