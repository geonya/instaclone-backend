import { protectedResolver } from "../../users/users.utils";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Mutation: {
		readMessage: protectedResolver(
			async (_: any, { id }, { client, loggedInUser }) => {
				const message = await client.message.findFirst({
					where: {
						id,
						userId: {
							not: loggedInUser.id,
						},
						room: {
							users: {
								some: {
									id: loggedInUser.id,
								},
							},
						},
					},
					select: {
						id: true,
					},
				});
				if (!message) {
					return {
						ok: false,
						error: "message not found",
					};
				}
				await client.message.update({
					where: {
						id,
					},
					data: {
						read: true,
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
