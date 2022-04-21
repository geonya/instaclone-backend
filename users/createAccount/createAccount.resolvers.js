import client from "../../client";
import bcrypt from "bcrypt";

export default {
	Mutation: {
		createAccount: async (
			_,
			{ firstName, lastName, username, email, password }
		) => {
			//check if username or email are already on DB.
			try {
				const existingUser = await client.user.findFirst({
					where: {
						OR: [{ username }, { email }],
					},
				});
				if (existingUser) {
					throw new Error("This username/password is already taken.");
				}
				const uglyPassword = await bcrypt.hash(password, 10);
				// save and return user
				return client.user.create({
					data: {
						firstName,
						lastName,
						username,
						email,
						password: uglyPassword,
					},
				});
			} catch (e) {
				return e;
			}
		},
	},
};
