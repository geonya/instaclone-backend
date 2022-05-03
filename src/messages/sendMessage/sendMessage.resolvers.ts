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
						error: "userid, roomid are undefined.",
					};
				}
				if (userId && roomId) {
					return {
						ok: false,
						error: "userid roomid can't co-exist",
					};
				}
				if (userId) {
					const user = await client.user.findUnique({
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
								id: roomId,
							},
						},
						user: {
							connect: {
								id: userId,
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
