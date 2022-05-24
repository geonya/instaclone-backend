require("dotenv").config();
import { ApolloServer } from "apollo-server-express";
import client from "./client";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";
import * as express from "express";
import * as logger from "morgan";
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const startServer = async () => {
	const app = express();
	app.use(logger("dev")); // logger should be on top
	app.use(graphqlUploadExpress());
	app.use("/static", express.static("uploads"));
	const schema = makeExecutableSchema({ typeDefs, resolvers });
	const httpServer = createServer(app);
	const wsServer = new WebSocketServer({
		server: httpServer,
		path: "/graphql",
	});

	const serverCleanup = useServer(
		{
			schema,
		},
		wsServer
	);

	const apolloServer = new ApolloServer({
		schema,
		context: async ({ req }) => {
			if (req) {
				return {
					loggedInUser: await getUser(req.headers.token),
					client,
				};
			}
		},
		plugins: [
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose();
						},
					};
				},
			},
		],
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({ app });
	httpServer.listen(process.env.PORT, () =>
		console.log(
			`🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath} ✅`
		)
	);
};
startServer();
