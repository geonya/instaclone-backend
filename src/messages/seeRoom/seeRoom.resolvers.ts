import { protectedResolver } from "../../users/users.utils";

export default {
	Query: {
		seeRoom: protectedResolver(
			async (_: any, { id }, { loggedInUser, client }) =>
				client.room.findFirst({
					where: { id, users: { some: { id: loggedInUser.id } } },
				})
		),
	},
};

// findUnique는 하나만 존재하는 것을 찾아주고
// findFirst 는 다수 중에 하나를 찾아줌
