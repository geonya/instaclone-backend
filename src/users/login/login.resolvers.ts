import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Mutation: {
		login: async (_: any, { username, password }, { client }) => {
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
			const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY!);
			return {
				ok: true,
				token,
			};
		},
	},
};

export default resolvers;
