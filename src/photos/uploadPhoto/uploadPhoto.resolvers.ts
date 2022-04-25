import { protectedResolver } from "../../users/users.utils";

export default {
	Mutation: {
		uploadPhoto: protectedResolver(
			async (_, { file, caption }, { loggedInUser, client }) => {
				let hashtagsObjs = [];
				if (caption) {
					// parse caption
					const parsedHashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w-]+/g);
					hashtagsObjs = parsedHashtags.map((hashtag: string) => ({
						where: { hashtag },
						create: { hashtag },
					}));
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
				// save the photo with the parsed hashtags
				// add the photo to the hashtags
			}
		),
	},
};
