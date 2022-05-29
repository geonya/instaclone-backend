import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Query: {
		seePhoto: (_: any, { id }, { client }) =>
			client.photo.findUnique({
				where: {
					id,
				},
			}),
	},
};
export default resolvers;
