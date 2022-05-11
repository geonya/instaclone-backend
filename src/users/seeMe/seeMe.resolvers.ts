import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolvers: Resolvers = {
	Query: {
		seeMe: protectedResolver(
			async (_: any, __: any, { client, loggedInUser }) =>
				client.user.findUnique({
					where: {
						id: loggedInUser.id,
					},
				})
		),
	},
};

export default resolvers;
