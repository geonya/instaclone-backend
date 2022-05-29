require("dotenv").config();
import { ApolloServer } from "apollo-server-express";
import client from "./client";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import logger from "morgan";
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
const schema = makeExecutableSchema({ typeDefs, resolvers });

const startServer = async () => {
	const app = express();
	app.use(logger("dev"));
	app.use(graphqlUploadExpress());
	app.use("/static", express.static("uploads"));
	const httpServer = createServer(app);
	const wsServer = new WebSocketServer({
		server: httpServer,
		path: "/graphql",
	});
	const getDynamicContext = async (ctx: any, msg: any, args: any) => {
		if (ctx.connectionParams.token) {
			const loggedInUser = await getUser(ctx.connectionParams.token);
			return { loggedInUser, client };
		}
		return { loggedInUser: null };
	};
	const serverCleanup = useServer(
		{
			schema,
			onConnect: async (ctx) => {
				if (!ctx.connectionParams?.token) {
					console.log(ctx.connectionParams);
					throw new Error("BACK-END ERROR : Auth token missing! T^T ~~");
				}
			},
			onDisconnect: (ctx, code, reason) => {
				console.log("DisConnected!");
			},
			context: (ctx, msg, args) => {
				return getDynamicContext(ctx, msg, args);
			},
		},
		wsServer
	);
	const server = new ApolloServer({
		schema,
		csrfPrevention: true,
		context: async ({ req }) => {
			if (req) {
				return {
					loggedInUser: await getUser(req.headers.token as string),
					client,
				};
			}
		},
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
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
	await server.start();
	server.applyMiddleware({ app });

	httpServer.listen(process.env.PORT, () => {
		console.log(
			`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath} ✅`
		);
		console.log(
			`🚀 Subscription endpoint ready at ws://localhost:${process.env.PORT}${server.graphqlPath}`
		);
	});
};

startServer();
