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
				if (userId) {
					// room 이 아직 만들어지기 전
					if (!roomId) {
						const user = await client.user.findFirst({
							where: {
								id: userId,
								// 내가 follow 한 user 에게만 message를 보낼 수 있음
								followers: { some: { id: loggedInUser.id } },
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
					}
					// 기존에 room 이 존재하는 경우
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
				// room을 찾았으므로 message를 생성한다.
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
