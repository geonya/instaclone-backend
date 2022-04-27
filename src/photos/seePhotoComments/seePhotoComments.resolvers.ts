export default {
	Query: {
		seePhotoComments: (_: any, { id, lastId }, { client }) =>
			client.comment.findMany({
				where: {
					photoId: id,
				},
				orderBy: {
					createdAt: "desc",
				},
				take: 10,
				skip: lastId ? 1 : 0,
				...(lastId && { cursor: { id: lastId } }),
			}),
	},
};
