require("dotenv").config();
import { ApolloServer } from "apollo-server-express";
import client from "./client";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";
import * as express from "express";
import * as logger from "morgan";

const PORT = process.env.PORT;
const startServer = async () => {
	const app = express();
	app.use(logger("tiny"));
	app.use(graphqlUploadExpress());
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req }) => {
			return {
				loggedInUser: await getUser(req.headers.token),
				client,
			};
		},
	});
	await server.start();
	server.applyMiddleware({ app });
	await new Promise<void>((resolve) => app.listen({ port: PORT }, resolve));
	console.log(
		`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath} ✅`
	);
};
startServer();
