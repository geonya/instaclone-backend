import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolvers: Resolvers = {
	Query: {
		seeProfile: protectedResolver((_, { username }, { client }) =>
			client.user.findUnique({
				where: {
					username,
				},
				include: {
					followers: true,
					following: true,
				},
			})
		),
	},
};

export default resolvers;
