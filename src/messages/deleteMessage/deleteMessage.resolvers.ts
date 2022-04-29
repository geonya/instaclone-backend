import { protectedResolver } from "../../users/users.utils";

export default {
	Mutation: {
		deleteMessage: protectedResolver(
			async (_: any, { id }, { client, loggedInUser }) => {
				const message = await client.message.findFirst({
					where: {
						id,
						read: false,
						userId: loggedInUser.id,
						room: { users: { some: { id: loggedInUser.id } } },
					},
					select: {
						id: true,
					},
				});
				if (!message) {
					return {
						ok: false,
						error: "Message not found.",
					};
				}
				await client.message.delete({ where: { id } });
				return {
					ok: true,
				};
			}
		),
	},
};
