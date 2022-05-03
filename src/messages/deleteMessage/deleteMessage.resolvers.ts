import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Mutation: {
		deleteMessage: protectedResolver(
			async (_: any, { id }, { client, loggedInUser }) => {
				const message = await client.message.findFirst({
					where: {
						id,
						userId: loggedInUser.id,
						read: false,
						room: { users: { some: { id: loggedInUser.id } } },
					},
				});
				if (!message) {
					return {
						ok: false,
						error: "Message not found.",
					};
				}
				await client.message.delete({
					where: {
						id,
					},
				});
				return {
					ok: true,
				};
			}
		),
	},
};

export default resolvers;
