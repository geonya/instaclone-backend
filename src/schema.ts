import client from "./client";

interface createMovieProps {
	title: string;
	year: number;
	genre?: string;
}

export const resolvers = {
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
