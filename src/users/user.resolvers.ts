export default {
	User: {
		totalFollowing: ({ id }, _: any, { client }) =>
			client.user.count({
				where: {
					followers: {
						some: {
							id,
						},
					},
				},
			}),
		totalFollowers: ({ id }, _: any, { client }) =>
			client.user.count({
				where: {
					following: {
						some: {
							id,
						},
					},
				},
			}),
		isMe: ({ id }, _: any, { loggedInUser }) => {
			if (!loggedInUser) return false;
			return id === loggedInUser.id;
		},
		isFollowing: async ({ id }, _: any, { loggedInUser, client }) => {
			if (!loggedInUser) return false;
			if (id === loggedInUser.id) return false;
			const exists = await client.user.count({
				where: { username: loggedInUser.username, following: { some: { id } } },
			});
			return Boolean(exists);
		},
	},
};
