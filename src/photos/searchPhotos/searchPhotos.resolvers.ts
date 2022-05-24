export default {
	Query: {
		searchPhotos: (_: any, { keyword }, { client }) =>
			client.photo.findMany({
				where: {
					OR: [
						{
							caption: {
								startsWith: keyword,
								mode: "insensitive",
							},
						},
						{
							caption: {
								contains: keyword,
								mode: "insensitive",
							},
						},
						{
							caption: {
								endsWith: keyword,
								mode: "insensitive",
							},
						},
					],
				},
			}),
	},
};
