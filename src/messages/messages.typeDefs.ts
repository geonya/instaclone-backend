import { gql } from "apollo-server-express";

export default gql`
	type Message {
		id: Int!
		payload: String!
		user: User!
		room: Room!
		read: Boolean!
		createdAt: String!
		updateAt: String!
	}
	type Room {
		id: Int!
		users: [User]
		messages: [Message]
		unreadTotal: Int!
		createdAt: String!
		updateAt: String!
	}
`;
