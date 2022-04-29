import { protectedResolver } from "../../users/users.utils";

export default {
	Mutation: {
		sendMessage: protectedResolver(
			async (_: any, { payload, roomId, userId }, { client, loggedInUser }) => {
				let room = null;
				if (roomId === undefined && userId === undefined) {
					return {
						ok: false,
						error: "RoomId and UserId don't exist.",
					};
				}
				if (roomId && userId) {
					return {
						ok: false,
						error: "Room Id and User Id co-exist.",
					};
				}
				if (userId) {
					const user = await client.user.findUnique({
						where: { id: userId },
						select: { id: true },
					});
					// - [ ] 맞팔 유저끼리만 대화가 가능하도록
					if (!user) {
						return {
							ok: false,
							error: "The user does not exist.",
						};
					}
					room = await client.room.create({
						data: {
							users: { connect: [{ id: userId }, { id: loggedInUser.id }] },
						},
					});
				} else if (roomId) {
					room = await client.room.findUnique({
						where: { id: roomId },
						select: { id: true },
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
