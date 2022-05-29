import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Query: {
		seeFeed: protectedResolver((_: any, { offset }, { client, loggedInUser }) =>
			client.photo.findMany({
				take: 2,
				skip: offset,
				where: {
					OR: [
						{
							user: {
								followers: {
									some: {
										id: loggedInUser.id,
									},
								},
							},
						},
						{
							userId: loggedInUser.id,
						},
					],
				},
				orderBy: {
					createdAt: "desc",
				},
			})
		),
	},
};
export default resolvers;
