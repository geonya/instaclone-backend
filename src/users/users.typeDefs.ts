import { gql } from "apollo-server-express";

export default gql`
	type User {
		id: Int!
		firstName: String!
		lastName: String
		username: String!
		email: String!
		createdAt: String!
		updatedAt: String!
		bio: String
		avatar: String
		photos: [Photo]
		following: [User]
		followers: [User]
		totalFollowing: Int!
		totalFollowers: Int!
		isFollowing: Boolean!
		isMe: Boolean!
	}
`;
