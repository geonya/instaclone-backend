import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
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
					// 내가 그 사람을 follow하고 있는 경우에만 방을 만들 수 있음
					const user = await client.user.findFirst({
						where: { id: userId, followers: { some: { id: loggedInUser.id } } },
						select: { id: true },
					});
					if (!user) {
						return {
							ok: false,
							error: "The user does not exist.",
						};
					}

					// 방이 이미 존재하는지 확인
					const existRoom = await client.room.findFirst({
						where: {
							id: roomId,
							users: {
								some: {
									id: userId,
								},
							},
						},
						select: {
							id: true,
						},
					});
					if (existRoom) {
						return {
							ok: false,
							error: "The Room already exist.",
						};
					}
					// --------------------
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
