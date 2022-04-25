export default {
	Query: {
		seePhoto: (_, { id }, { client }) =>
			client.photo.findUnique({
				where: {
					id,
				},
			}),
	},
};
