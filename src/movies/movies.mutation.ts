import client from "src/client";

interface createMovieProps {
	title: string;
	year: number;
	genre?: string;
}

export default {
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
