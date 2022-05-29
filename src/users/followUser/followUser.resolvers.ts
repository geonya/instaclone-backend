import { FOLLOW } from "../../constants";
import pubsub from "../../pubsub";
import { protectedResolver } from "../users.utils";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Mutation: {
		followUser: protectedResolver(
			async (_, { username }, { loggedInUser, client }) => {
				const ok = await client.user.findUnique({
					where: {
						username,
					},
					select: { id: true },
				});
				if (!ok) {
					return {
						ok: false,
						error: "that user does not exist.",
					};
				}
				await client.user.update({
					where: {
						id: loggedInUser.id,
					},
					data: {
						following: {
							connect: {
								username,
							},
						},
					},
				});
				pubsub.publish(FOLLOW, {
					followUpdates: {
						targetName: username,
						followerName: loggedInUser.username,
						avatar: loggedInUser.avatar,
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
