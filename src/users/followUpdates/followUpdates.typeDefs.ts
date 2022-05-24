import { gql } from "apollo-server-express";

export default gql`
	type followUpdatesResult {
		targetName: String!
		followerName: String!
		avatar: String
	}
	type Subscription {
		followUpdates: followUpdatesResult
	}
`;
