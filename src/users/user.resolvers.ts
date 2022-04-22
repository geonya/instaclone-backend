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
	},
};
