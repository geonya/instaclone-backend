export default {
	Query: {
		searchPhotos: (_: any, { keyword }, { client }) =>
			client.photo.findMany({
				where: {
					caption: {
						startsWith: keyword,
					},
				},
			}),
	},
};
