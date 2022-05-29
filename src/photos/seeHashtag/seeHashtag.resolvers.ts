import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Query: {
		seeHashtag: (_: any, { hashtag }, { client }) =>
			client.hashtag.findUnique({
				where: {
					hashtag,
				},
			}),
	},
};
export default resolvers;
