import { withFilter } from "graphql-subscriptions";
import { FOLLOW } from "../../constants";
import pubsub from "../../pubsub";
import { Resolvers } from "../../types";

export default {
	Subscription: {
		followUpdates: {
			subscribe: async (_: any, { id }) => {
				return withFilter(
					() => pubsub.asyncIterator(FOLLOW),
					() => true
				);
			},
		},
	},
};
