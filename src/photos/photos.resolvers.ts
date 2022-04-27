import client from "../client";

export default {
	Photo: {
		user: ({ userId }) =>
			client.user.findUnique({
				where: {
					id: userId,
				},
			}),
		hashtags: ({ id }) =>
			client.hashtag.findMany({
				where: {
					photos: {
						some: {
							id,
						},
					},
				},
			}),
		likes: ({ id }) => client.like.count({ where: { photoId: id } }),
		comments: ({ id }) =>
			client.comment.count({
				where: {
					photoId: id,
				},
			}),
		isMine: ({ userId }, _: any, { loggedInUser }) =>
			// if loggedInUser null ?
			userId === loggedInUser?.id,
	},
	Hashtag: {
		photos: ({ id }, { page }) =>
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
