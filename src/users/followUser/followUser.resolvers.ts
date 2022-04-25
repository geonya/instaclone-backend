import { protectedResolver } from "../users.utils";

export default {
	Mutation: {
		followUser: protectedResolver(
			async (_, { username }, { loggedInUser, client }) => {
				const ok = await client.user.findUnique({
					where: {
						username,
					},
					select: { id: true },
				});
				if (!ok) {
					return {
						ok: false,
						error: "that user does not exist.",
					};
				}
				await client.user.update({
					where: {
						id: loggedInUser.id,
					},
					data: {
						following: {
							connect: {
								username,
							},
						},
					},
				});
				return {
					ok: true,
				};
			}
		),
	},
};
