require('dotenv').config()
const { v1: neo4j } = require('neo4j-driver')
const { ApolloServer, makeExecutableSchema } = require('apollo-server')
const { augmentSchema } = require('neo4j-graphql-js')

const driver = neo4j.driver(
    `bolt://${process.env.NEO4J_HOST}:24787`,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
)

const typeDefs = `
type Person { name: String! }
type Planet { name: String! }
type Query {
  Person: [Person]
  Planet: [Planet]
}
`

const schema = augmentSchema(makeExecutableSchema({ typeDefs }))

new ApolloServer({
    schema,
    context: { driver }
}).listen(8000, '0.0.0.0')
  .then(({ url }) => console.log(`GraphQL API ready at ${url}`))