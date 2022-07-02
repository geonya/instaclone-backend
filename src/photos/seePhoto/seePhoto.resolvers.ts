import { Resolvers } from "../../types";

export const resolvers: Resolvers = {
	Query: {
		seePhoto: (_, { id }, { client }) =>
			client.photo.findUnique({
				where: {
					id,
				},
			}),
	},
};
