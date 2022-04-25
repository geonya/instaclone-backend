import * as jwt from "jsonwebtoken";
import client from "../client";
import { Resolver } from "../types";

export const getUser = async (token: string) => {
	try {
		if (!token) {
			return null;
		}
		const verifiedToken: any = await jwt.verify(token, process.env.SECRET_KEY);
		if ("id" in verifiedToken) {
			const user = await client.user.findUnique({
				where: { id: verifiedToken["id"] },
			});

			if (user) {
				return user;
			}
		}
		return null;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const protectedResolver =
	(ourResolver: Resolver) => (root, args, context, info) => {
		if (!context.loggedInUser) {
			return {
				ok: false,
				error: "You need to Login!",
			};
		}
		return ourResolver(root, args, context, info);
	};
