import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Query: {
		seeRoom: protectedResolver(
			async (_: any, { id }, { client, loggedInUser }) =>
				client.room.findFirst({
					where: {
						id,
						users: {
							some: {
								id: loggedInUser.id,
							},
						},
					},
				})
		),
	},
};

export default resolvers;
