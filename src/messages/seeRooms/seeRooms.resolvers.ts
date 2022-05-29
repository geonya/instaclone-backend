import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { Resolvers } from "../../types";

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
