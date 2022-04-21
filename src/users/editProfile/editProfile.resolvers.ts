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
				const { filename, createReadStream } = await avatar;
				const readStream = createReadStream();
				const writeStream = createWriteStream(
					process.cwd() + "/uploads/" + filename
				);
				readStream.pipe(writeStream);
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
