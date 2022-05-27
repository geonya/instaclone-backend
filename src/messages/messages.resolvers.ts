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
							// 내가 만든 메시지는 제외
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
		isMine: ({ userId }, _: any, { loggedInUser }) =>
			loggedInUser ? loggedInUser.id === userId : false,
	},
};

export default resolvers;
