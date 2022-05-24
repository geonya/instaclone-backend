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
								startsWith: keyword,
								mode: "insensitive",
							},
						},
						{
							username: {
								contains: keyword,
								mode: "insensitive",
							},
						},
						{
							username: {
								endsWith: keyword,
								mode: "insensitive",
							},
						},
						{
							firstName: {
								startsWith: keyword,
								mode: "insensitive",
							},
						},
						{
							firstName: {
								contains: keyword,
								mode: "insensitive",
							},
						},
						{
							firstName: {
								endsWith: keyword,
								mode: "insensitive",
							},
						},
						{
							lastName: {
								startsWith: keyword,
								mode: "insensitive",
							},
						},
						{
							lastName: {
								contains: keyword,
								mode: "insensitive",
							},
						},
						{
							lastName: {
								endsWith: keyword,
								mode: "insensitive",
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
