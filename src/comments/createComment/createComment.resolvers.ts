import { protectedResolver } from "../../users/users.utils";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Mutation: {
		createComment: protectedResolver(
			async (_, { photoId, payload }, { client, loggedInUser }) => {
				const ok = await client.photo.findUnique({
					where: {
						id: photoId,
					},
					// 모든 photo data를 가져올 필요 없다.
					select: {
						id: true,
					},
				});
				if (!ok)
					return {
						ok: false,
						error: "Photo not found.",
					};
				const newComment = await client.comment.create({
					data: {
						payload,
						photo: {
							connect: {
								id: photoId,
							},
						},
						user: {
							connect: {
								id: loggedInUser.id,
							},
						},
					},
				});
				return {
					ok: true,
					id: newComment.id,
				};
			}
		),
	},
};
export default resolvers;
