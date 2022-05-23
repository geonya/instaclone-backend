import { protectedResolver } from "../../users/users.utils";

export default {
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
