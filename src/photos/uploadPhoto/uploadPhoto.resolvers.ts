import { protectedResolver } from "../../users/users.utils";

export default {
	Mutation: {
		uploadPhoto: protectedResolver(
			async (_, { file, caption }, { loggedInUser, client }) => {
				if (caption) {
					// parse caption
					const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w-]+/g);
					// get or create hashtags -> prisma connenct of create
				}
				client.photo.create({
					data: {
						file,
						caption,
						hashtags: {
							connectOrCreate: [
								{
									where: {
										hashtag: "#food",
									},
									create: {
										hashtag: "#food",
									},
								},
							],
						},
					},
				});
				// save the photo with the parsed hashtags
				// add the photo to the hashtags
			}
		),
	},
};
