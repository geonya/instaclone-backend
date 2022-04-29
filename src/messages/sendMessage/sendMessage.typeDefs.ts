import { gql } from "apollo-server-express";

export default gql`
	type Mutation {
		sendMessage(payload: String!, roomId: Int, userId: Int): MutationResponse
	}
`;

// roomId 가 없을 수도 있다 왜냐하면 최초 메시지는 아직 방이 만들어지기 전이라 user에게 바로 메시지만 보내는 개념이고 그 이후에 방이 만들어진다. 따라서 처음에는 userId만 필요하고 roomId과 userId는 not required 하다.
