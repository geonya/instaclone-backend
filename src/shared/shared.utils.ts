import * as AWS from "aws-sdk";

AWS.config.update({
	credentials: {
		accessKeyId: process.env.AWS_KEY,
		secretAccessKey: process.env.AWS_SECRET,
	},
});

export const uploadPhoto = async (file: any, userId: number) => {
	const { filename, createReadStream } = await file;
	const readStream = createReadStream();
	const objectName = `${userId}-${Date.now()}-${filename}`;
	const { Location } = await new AWS.S3()
		.upload({
			Bucket: "instaclone-uploadssssssssss",
			Key: objectName,
			ACL: "public-read",
			Body: readStream,
		})
		.promise();
	return Location;
};
