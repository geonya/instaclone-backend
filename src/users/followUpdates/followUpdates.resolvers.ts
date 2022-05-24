import { withFilter } from "graphql-subscriptions";
import { FOLLOW } from "../../constants";
import pubsub from "../../pubsub";

export default {
	Subscription: {
		followUpdates: {
			subscribe: async (_: any, __: any, { loggedInUser }) => {
				if (!loggedInUser) throw new Error("You need to login");
				return withFilter(
					() => pubsub.asyncIterator(FOLLOW),
					async ({ followUpdates }, _, { loggedInUser }) => {
						if (followUpdates.targetName !== loggedInUser.username) {
							return false;
						}
						return true;
					}
				)(_, __, { loggedInUser });
			},
		},
	},
};
