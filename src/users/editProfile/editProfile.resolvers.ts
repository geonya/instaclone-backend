import * as bcrypt from "bcrypt";
import { GraphQLUpload } from "graphql-upload";
import { protectedResolver } from "../users.utils";
import { createWriteStream } from "fs";

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
				// file upload in local - 실전에서는 aws cloud 를 사용하기 때문에 다른 방법을 사용함
				let avatarUrl = null;
				if (avatar) {
					const { filename, createReadStream } = await avatar;
					const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
					const readStream = createReadStream();
					const writeStream = createWriteStream(
						process.cwd() + "/uploads/" + newFilename
					);
					readStream.pipe(writeStream);
					avatarUrl = `http://localhost:4000/static/${newFilename}`;
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
