import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
	Subscription: {
		roomUpdates: {
			subscribe: async (_: any, { id }, { loggedInUser }) => {
				const room = await client.room.findFirst({
					where: { id, users: { some: { id: loggedInUser.id } } },
					select: { id: true },
				});

				if (!room) {
					throw new Error("You shall not see this.");
				}
				return withFilter(
					() => pubsub.asyncIterator(NEW_MESSAGE),
					async ({ roomUpdates }, { id }, { loggedInUser }) => {
						if (roomUpdates.roomId === id) {
							const room = await client.room.findFirst({
								where: { id, users: { some: { id: loggedInUser.id } } },
								select: { id: true },
							});
							if (!room) {
								return false;
							}
							return true;
						}
					}
				)(_, { id }, { loggedInUser });
			},
		},
	},
};
