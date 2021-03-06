import bcrypt from "bcrypt";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Mutation: {
		createAccount: async (
			_: any,
			{ firstName, lastName, username, email, password },
			{ client }
		) => {
			//check if username or email are already on DB.
			try {
				const existingUser = await client.user.findFirst({
					where: {
						OR: [{ username }, { email }],
					},
				});
				if (existingUser) {
					return {
						ok: false,
						error: "Username or Email is already taken.",
					};
				}
				const uglyPassword = await bcrypt.hash(password, 10);
				// save and return user
				await client.user.create({
					data: {
						firstName,
						lastName,
						username,
						email,
						password: uglyPassword,
					},
				});
				return {
					ok: true,
				};
			} catch (e) {
				console.log(e);
				return {
					ok: false,
					error: "Can't create account.",
				};
			}
		},
	},
};

export default resolvers;
