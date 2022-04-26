export const makeHashtags = (caption: string) => {
	const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w-]+/g) || [];
	return hashtags.map((hashtag: string) => ({
		where: { hashtag },
		create: { hashtag },
	}));
};
