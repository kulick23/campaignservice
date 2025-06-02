const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
app.use(express.json());

let campaigns = [
  { id: '1', title: 'Clean Water Project', goal: 10000 },
  { id: '2', title: 'Education for All', goal: 20000 },
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
  campaign: ({ id }) => campaigns.find(c => c.id === id),
};

app.get('/campaigns', (_, res) => res.json(campaigns));

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log('Campaign service running on port', PORT);
});
