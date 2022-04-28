import { gql } from "apollo-server-express";

export default gql`
	type DeleteCommentResult {
		ok: Boolean!
		error: String
	}
	type Mutation {
		deleteComment(id: Int!): DeleteCommentResult
	}
`;
