import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { makeHashtags } from "../photos.utils";

const resolvers: Resolvers = {
	Mutation: {
		editPhoto: protectedResolver(
			async (_: any, { id, caption }, { client, loggedInUser }) => {
				const oldPhoto = await client.photo.findFirst({
					where: { id, userId: loggedInUser.id },
					include: {
						hashtags: {
							select: {
								hashtag: true,
							},
						},
					},
				});
				if (!oldPhoto) return { ok: false, error: "Photo not found!" };
				let hashtagsObjs: any[] = [];
				if (caption) {
					hashtagsObjs = makeHashtags(caption);
				}
				await client.photo.update({
					where: { id },
					data: {
						caption,
						hashtags: {
							disconnect: oldPhoto.hashtags,
							connectOrCreate: hashtagsObjs,
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
export default resolvers;
