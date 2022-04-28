import { gql } from "apollo-server-express";

export default gql`
	type EditCommentResult {
		ok: Boolean!
		error: String
	}
	type Mutation {
		editComment(id: Int!, payload: String!): EditCommentResult
	}
`;
