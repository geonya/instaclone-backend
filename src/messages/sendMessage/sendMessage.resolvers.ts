import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Mutation: {
		sendMessage: protectedResolver(
			async (_: any, { payload, roomId, userId }, { client, loggedInUser }) => {
				let room = null;
				if (userId === undefined && roomId === undefined) {
					return {
						ok: false,
						error: "userid or roomId is required.",
					};
				}
				// userId & roomId can co-exist
				if (userId) {
					const user = await client.user.findFirst({
						where: {
							id: userId,
							followers: {
								some: {
									id: loggedInUser.id,
								},
							},
						},
						select: {
							id: true,
						},
					});
					if (!user) {
						return {
							ok: false,
							error: "user doesn't exist.",
						};
					}
					// find existing room with this user
					room = await client.room.findFirst({
						where: {
							AND: [
								{ users: { some: { id: userId } } },
								{ users: { some: { id: loggedInUser.id } } },
							],
						},
						select: {
							id: true,
						},
					});
					// if no room, create
					if (!room) {
						room = await client.room.create({
							data: {
								users: {
									connect: [{ id: userId }, { id: loggedInUser.id }],
								},
							},
						});
					}
				} else if (roomId) {
					room = await client.room.findFirst({
						where: {
							id: roomId,
							users: {
								some: {
									id: loggedInUser.id,
								},
							},
						},
						select: {
							id: true,
						},
					});
				}
				if (!room) {
					return {
						ok: false,
						error: "Room not found.",
					};
				}
				const message = await client.message.create({
					data: {
						payload,
						room: {
							connect: {
								id: room.id,
							},
						},
						user: {
							connect: {
								id: loggedInUser.id,
							},
						},
					},
				});
				pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
				return {
					ok: true,
				};
			}
		),
	},
};

export default resolvers;
