import bcrypt from "bcrypt";
import { GraphQLUpload } from "graphql-upload";
import { protectedResolver } from "../users.utils";
import { uploadToS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";

const resolver: Resolvers = {
	Mutation: {
		editProfile: protectedResolver(
			async (
				_,
				{
					firstName,
					lastName,
					username,
					email,
					password: newPassword,
					bio,
					avatar,
				},
				{ loggedInUser, client }
			) => {
				let avatarUrl = null;
				if (avatar) {
					avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
				}
				let uglyPassword = null;
				if (newPassword) {
					uglyPassword = await bcrypt.hash(newPassword, 10);
				}
				const updatedUser = await client.user.update({
					where: {
						id: loggedInUser.id,
					},
					data: {
						firstName,
						lastName,
						username,
						email,
						bio,
						...(uglyPassword && { password: uglyPassword }),
						...(avatarUrl && { avatar: avatarUrl }),
					},
				});
				if (updatedUser.id) {
					return {
						ok: true,
					};
				} else {
					return {
						ok: false,
						error: "Could not update profile",
					};
				}
			}
		),
	},
	Upload: GraphQLUpload as any,
};

export default resolver;
