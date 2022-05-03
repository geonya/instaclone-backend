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
				if (userId && !roomId) {
					const user = await client.user.findFirst({
						where: {
							id: userId,
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
					room = await client.room.create({
						data: {
							users: {
								connect: [{ id: userId }, { id: loggedInUser.id }],
							},
						},
					});
				} else if (roomId) {
					room = await client.room.findUnique({
						where: {
							id: roomId,
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
				await client.message.create({
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
				return {
					ok: true,
				};
			}
		),
	},
};

export default resolvers;
