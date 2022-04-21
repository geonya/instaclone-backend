import client from "../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
		login: async (_, { username, password }) => {
			// find user with args.username
			const user = await client.user.findFirst({ where: { username } });
			if (!user) {
				return {
					ok: false,
					error: "User not found.",
				};
			}
			const passwordOk = await bcrypt.compare(password, user.password);
			if (!passwordOk) {
				return {
					ok: false,
					error: "Incorrect Password",
				};
			}
			// issue a token and send it to the user
			const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
			return {
				ok: true,
				token,
			};
		},
	},
};
