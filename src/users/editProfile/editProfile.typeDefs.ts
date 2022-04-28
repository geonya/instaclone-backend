import { gql } from "apollo-server-express";

export default gql`
	type Mutation {
		editProfile(
			firstName: String
			lastName: String
			username: String
			email: String
			password: String
			bio: String
			avatar: Upload
		): MutationResponse!
	}
	scalar Upload
`;
