import { protectedResolver } from "../../users/users.utils";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Mutation: {
		editComment: protectedResolver(
			async (_, { id, payload }, { client, loggedInUser }) => {
				const comment = await client.comment.findUnique({
					where: {
						id,
					},
					select: {
						userId: true,
					},
				});
				if (!comment) {
					return {
						ok: false,
						error: "Comment not found.",
					};
				} else if (comment.userId !== loggedInUser.id) {
					return {
						ok: false,
						error: "Not authorized.",
					};
				} else {
					await client.comment.update({
						where: {
							id,
						},
						data: {
							payload,
						},
					});
					return {
						ok: true,
					};
				}
			}
		),
	},
};
export default resolvers;
