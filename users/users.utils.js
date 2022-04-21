import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
	try {
		if (!token) {
			return null;
		}
		const { id } = await jwt.verify(token, process.env.SECRET_KEY);
		const user = await client.user.findUnique({ where: { id } });
		if (user) {
			return user;
		} else {
			return null;
		}
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const protectedResolver =
	(ourResolver) => (root, args, context, info) => {
		if (!context.loggedInUser) {
			return {
				ok: false,
				error: "You need to Login!",
			};
		}
		return ourResolver(root, args, context, info);
	};
