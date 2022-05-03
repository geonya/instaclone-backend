import { gql } from "apollo-server-express";

export default gql`
	type Mutation {
		deleteMessage(id: Int!): MutationResponse
	}
`;
