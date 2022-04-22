export default {
	Query: {
		searchUsers: async (_: any, { keyword, lastId }, { client }) => {
			if (keyword.length < 2)
				return {
					ok: false,
					error: "Searching keyword length should be more than 2",
				};
			const users = await client.user.findMany({
				where: {
					OR: [
						{
							username: {
								startsWith: keyword.toLowerCase(),
							},
						},
						{
							firstName: {
								startsWith: keyword.toLowerCase(),
							},
						},
						{
							lastName: {
								startsWith: keyword.toLowerCase(),
							},
						},
					],
				},
				take: 5,
				skip: lastId ? 1 : 0,
				...(lastId && { cursor: { id: lastId } }),
			});
			return {
				ok: true,
				users,
			};
		},
	},
};
