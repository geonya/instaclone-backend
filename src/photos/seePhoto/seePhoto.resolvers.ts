export default {
	Query: {
		seePhoto: (_: any, { id }, { client }) =>
			client.photo.findUnique({
				where: {
					id,
				},
			}),
	},
};
