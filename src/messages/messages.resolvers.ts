import { Resolvers } from "../types";

const resolvers: Resolvers = {
	Room: {
		users: ({ id }, _: any, { client }) =>
			client.room.findFirst({ where: { id } }).users(),
		messages: ({ id }, _: any, { client }) =>
			client.message.findMany({
				where: {
					roomId: id,
				},
			}),
		unreadTotal: ({ id }, _: any, { client, loggedInUser }) => {
			if (!loggedInUser) {
				return 0;
			}
			return client.message.count({
				where: {
					read: false,
					roomId: id,
					user: {
						id: {
							not: loggedInUser.id,
						},
					},
				},
			});
		},
	},
	Message: {
		user: ({ id }, _: any, { client }) =>
			client.message.findUnique({ where: { id } }).user(),
	},
};

export default resolvers;
