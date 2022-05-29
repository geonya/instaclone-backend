import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Query: {
		seeFollowers: async (_: any, { username, page }, { client }) => {
			const ok = await client.user.findUnique({
				where: { username },
				select: {
					id: true,
				},
			});
			if (!ok) {
				return {
					ok: false,
					error: "User doesn't exist",
				};
			}
			const followers = await client.user
				.findUnique({ where: { username } })
				.followers({
					take: 5,
					skip: (page - 1) * 5,
				});
			const totalFollowers = await client.user.count({
				where: { following: { some: { username } } },
			});
			return {
				ok: true,
				followers,
				totalPages: Math.ceil(totalFollowers / 5),
			};
		},
	},
};
export default resolvers;
