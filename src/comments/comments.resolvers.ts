import { Resolvers } from "../types";

const resolvers: Resolvers = {
	Comment: {
		isMine: ({ userId }, _: any, { loggedInUser }) =>
			userId === loggedInUser?.id,
	},
};

export default resolvers;
