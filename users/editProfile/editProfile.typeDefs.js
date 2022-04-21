import { gql } from "apollo-server";

export default gql`
	type EditProileResult {
		ok: Boolean!
		error: String
	}
	type Mutation {
		editProfile(
			firstName: String
			lastName: String
			username: String
			email: String
			password: String
		): EditProileResult
	}
`;
