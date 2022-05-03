import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Query: {
		seeRooms: protectedResolver(async (_: any, __: any, { loggedInUser }) =>
			client.room.findMany({
				where: { users: { some: { id: loggedInUser.id } } },
			})
		),
	},
};

export default resolvers;
