import jwt from "jsonwebtoken";
import client from "../client";
import { Resolver } from "../types";

export const getUser = async (token: string) => {
	try {
		if (!token) {
			return null;
		}
		const verifiedToken: any = jwt.verify(token, process.env.SECRET_KEY!);
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
	(ourResolver: Resolver) =>
	(root: any, args: any, context: any, info: any) => {
		if (!context.loggedInUser) {
			const isQueries = info.operation.operation === "query";
			if (isQueries) {
				return null;
			} else {
				return {
					ok: false,
					error: "You need to Login!",
				};
			}
		}

		return ourResolver(root, args, context, info);
	};
