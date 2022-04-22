import { gql } from "apollo-server-express";

export default gql`
	type SearchUsersResult {
		ok: Boolean!
		error: String
		users: [User]
	}
	type Query {
		searchUsers(keyword: String!, lastId: Int): SearchUsersResult
	}
`;
