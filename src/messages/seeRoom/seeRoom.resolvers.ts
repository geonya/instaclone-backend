import { protectedResolver } from "../../users/users.utils";

import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Query: {
		seeRoom: protectedResolver(
			async (_: any, { id }, { loggedInUser, client }) =>
				client.room.findFirst({
					where: { id, users: { some: { id: loggedInUser.id } } },
				})
		),
	},
};

export default resolvers;
