import { gql } from "apollo-server-express";

export default gql`
	type MutationResponse {
		ok: Boolean!
		error: String
	}
	type Mutation {
		editPhoto(id: Int!, caption: String!): MutationResponse!
	}
`;
