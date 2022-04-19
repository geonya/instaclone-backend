import { PrismaClient } from "@prisma/client";
import { ApolloServer, gql } from "apollo-server";

const client = new PrismaClient();

interface createMovieProps {
	title: string;
	year: number;
	genre?: string;
}

const typeDefs = gql`
	type Movie {
		id: Int!
		title: String!
		year: Int!
		genre: String
		createdAt: String!
		updatedAt: String!
	}
	type Query {
		movies: [Movie]
		movie(id: Int!): Movie
	}
	type Mutation {
		createMovie(title: String!, year: Int!, genre: String): Movie
		deleteMovie(id: Int!): Movie
		updateMovie(id: Int!, year: Int!): Movie
	}
`;

const resolvers = {
	Query: {
		movies: () => client.movie.findMany(),
		movie: (_: any, { id }: { id: number }) =>
			client.movie.findUnique({ where: { id } }),
	},
	Mutation: {
		createMovie: (_: any, { title, year, genre }: createMovieProps) =>
			client.movie.create({
				data: {
					title,
					year,
					genre,
				},
			}),
		deleteMovie: (_: any, { id }: { id: number }) =>
			client.movie.delete({
				where: {
					id,
				},
			}),
		updateMovie: (_: any, { id, year }: { id: number; year: number }) =>
			client.movie.update({
				where: { id },
				data: { year },
			}),
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
