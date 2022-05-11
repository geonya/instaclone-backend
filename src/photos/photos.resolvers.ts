import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
	Photo: {
		user: ({ userId }, _: any, { client }) =>
			client.user.findUnique({
				where: {
					id: userId,
				},
			}),
		hashtags: ({ id }, _: any, { client }) =>
			client.hashtag.findMany({
				where: {
					photos: {
						some: {
							id,
						},
					},
				},
			}),
		likes: ({ id }, _: any, { client }) =>
			client.like.count({ where: { photoId: id } }),
		comments: ({ id }, _: any, { client }) =>
			client.comment.count({
				where: {
					photoId: id,
				},
			}),
		isMine: ({ userId }, _: any, { loggedInUser }) => {
			if (!loggedInUser) return false;
			return userId === loggedInUser?.id;
		},
		isLiked: async ({ id }, _: any, { loggedInUser }) => {
			if (!loggedInUser) return false;
			const ok = await client.like.findUnique({
				where: { photoId_userId: { photoId: id, userId: loggedInUser.id } },
				select: {
					id: true,
				},
			});
			if (ok) return true;
			return false;
		},
	},
	Hashtag: {
		photos: ({ id }, { page }, { client }) =>
			client.hashtag
				.findUnique({
					where: {
						id,
					},
				})
				.photos({
					take: 10,
					skip: (page - 1) * 10,
				}),
		totalPhotos: ({ id }, _: any, { client }) =>
			client.photo.count({
				where: {
					hashtags: {
						some: {
							id,
						},
					},
				},
			}),
	},
};
export default resolvers;
