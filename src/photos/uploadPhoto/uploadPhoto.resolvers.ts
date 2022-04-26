import { protectedResolver } from "../../users/users.utils";
import { makeHashtags } from "../photos.utils";

export default {
	Mutation: {
		uploadPhoto: protectedResolver(
			async (_, { file, caption }, { loggedInUser, client }) => {
				let hashtagsObjs = [];
				if (caption) {
					hashtagsObjs = makeHashtags(caption);
				}
				return client.photo.create({
					data: {
						user: {
							connect: {
								id: loggedInUser.id,
							},
						},
						file,
						caption,
						...(hashtagsObjs.length > 0 && {
							hashtags: {
								// ** 기존 데이터 중에 존재하지 않을 경우에만 생성
								connectOrCreate: hashtagsObjs,
							},
						}),
					},
				});
			}
		),
	},
};
