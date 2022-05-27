import { gql } from "apollo-server-express";

export default gql`
	type Message {
		id: Int!
		payload: String!
		user: User!
		room: Room!
		read: Boolean!
		isMine: Boolean!
		createdAt: String!
		updatedAt: String!
	}
	type Room {
		id: Int!
		unreadTotal: Int!
		users: [User]
		messages: [Message]
		createdAt: String!
		updatedAt: String!
	}
`;
