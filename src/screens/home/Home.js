import React, { useEffect, useState } from "react";
import Header from "../../common/header/Header";
import "./Home.css";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { GridListTileBar } from "@material-ui/core";

export default function Home() {
	//Getting upcoming movies from the DB
	const [upcomingMoviesList, setUpcomingMoviesList] = useState([]);
	useEffect(() => {
		getUpcomingMoviesList();
	});

	async function getUpcomingMoviesList() {
		const response = await fetch("/api/v1/movies?status=PUBLISHED");
		const responseBody = await response.json();
		setUpcomingMoviesList(responseBody.movies);
	}

	return (
		<div>
			<Header />
			<div className="upcomingMoviesHeading">Upcoming Movies</div>

			{/* Gridlist of Upcoming Movies */}
			<GridList cols={6} style={{ flexWrap: "nowrap" }}>
				{upcomingMoviesList.map((movie) => (
					<GridListTile key={movie.id} style={{ height: "250px" }}>
						<img src={movie.poster_url} alt={movie.title} />
						<GridListTileBar title={movie.title} />
					</GridListTile>
				))}
			</GridList>
		</div>
	);
}
