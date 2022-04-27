export default {
	Query: {
		seePhotoLikes: async (_: any, { id }, { client }) => {
			const likes = await client.like.findMany({
				where: {
					photoId: id,
				},
				select: {
					user: true,
				},
			});
			return likes.map((like: any) => like.user);
		},
	},
};
