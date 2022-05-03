import { withFilter } from "graphql-subscriptions";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
	Subscription: {
		roomUpdates: {
			subscribe: async (_: any, { id }, { loggedInUser, client }) => {
				const room = await client.room.findFirst({
					where: { id, users: { some: { id: loggedInUser.id } } },
					select: { id: true },
				});
				if (!room) {
					throw new Error("You shall not see this.");
				}
				return withFilter(
					() => pubsub.asyncIterator(NEW_MESSAGE),
					async ({ roomUpdates }, { id }, { loggedInUser, client }) => {
						if (roomUpdates.roomId === id) {
							// double check
							const room = await client.room.findFirst({
								where: { id, users: { some: { id: loggedInUser.id } } },
								select: { id: true },
							});
							if (!room) {
								return false; // No update.
							}
							return true;
						}
					}
				)(_, { id }, { loggedInUser, client });
				// function 의 호출 결과를 return 해야 하기 때문
			},
		},
	},
};