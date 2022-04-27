import { gql } from "apollo-server-express";

export default gql`
	type Photo {
		id: Int!
		user: User!
		file: String!
		caption: String
		hashtags: [Hashtag]
		updatedAt: String!
		createdAt: String!
	}
	type Hashtag {
		id: Int!
		hashtag: String!
		photos(page: Int!): [Photo]
		totalPhotos: Int!
		createdAt: String!
		updatedAt: String!
	}
	type Like {
		id: Int!
		photo: Photo!
		updatedAt: String!
		createdAt: String!
	}
`;
