import * as bcrypt from "bcrypt";
import { GraphQLUpload } from "graphql-upload";
import { protectedResolver } from "../users.utils";
import { createWriteStream } from "fs";
import { uploadPhoto } from "../../shared/shared.utils";

export default {
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
					avatarUrl = await uploadPhoto(avatar, loggedInUser.id);
					// upload in local ->
					/* 		const { filename, createReadStream } = await avatar;
					const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
					const readStream = createReadStream();
					const writeStream = createWriteStream(
						process.cwd() + "/uploads/" + newFilename
					);
					readStream.pipe(writeStream);
					avatarUrl = `http://localhost:4000/static/${newFilename}`; */
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
	Upload: GraphQLUpload,
};
