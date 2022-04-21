require("dotenv").config();
import { ApolloServer } from "apollo-server";
import client from "./client";
import schema from "./schema";
import { getUser } from "./users/users.utils";
const PORT = process.env.PORT;

const server = new ApolloServer({
	schema,
	context: async ({ req }) => {
		return {
			loggedInUser: await getUser(req.headers.token),
			client,
		};
	},
});

server
	.listen(PORT)
	.then(() => console.log(`🚀 Server ready at http://localhost:${PORT} ✅`));
