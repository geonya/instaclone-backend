export default {
	Query: {
		seeHashtag: (_: any, { hashtag }, { client }) =>
			client.hashtag.findUnique({
				where: {
					hashtag,
				},
			}),
	},
};
