import { Resolvers } from "../types";

const resolvers: Resolvers = {
	Room: {
		users: ({ id }, _: any, { client }) =>
			client.room.findUnique({ where: { id } }).users(),
		messages: ({ id }, _: any, { client }) =>
			client.message.findMany({
				where: {
					roomId: id,
				},
			}),
		unreadTotal: () => 0,
	},
};

export default resolvers;
