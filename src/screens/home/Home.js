import React, { useEffect, useState } from "react";
import Header from "../../common/header/Header";
import "./Home.css";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { GridListTileBar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { Card } from "@material-ui/core";
import { CardContent } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { Input } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import { MenuItem } from "@material-ui/core";
import { Select } from "@material-ui/core";

//STYLES FOR FILTER MOVIE PANEL
const styles = (theme) => ({
	heading: {
		margin: theme.spacing.unit,
		color: theme.palette.primary.light,
	},
	cardComponent: {
		margin: theme.spacing.unit,
		minWidth: 240,
		maxWidth: 240,
	},
});

//HOME FUNCTION
function Home(props) {
	const { classes } = props;

	//GETTING LIST OF UPCOMING MOVIES FROM THE DB
	const [upcomingMoviesList, setUpcomingMoviesList] = useState([]);
	useEffect(() => {
		getUpcomingMoviesList();
	}, []);

	async function getUpcomingMoviesList() {
		const response = await fetch("/api/v1/movies?status=PUBLISHED");
		const responseBody = await response.json();
		setUpcomingMoviesList(responseBody.movies);
	}

	//GETTING RELEASED MOVIES FROM THE DB
	const [releasedMoviesList, setReleasedMoviesList] = useState([]);
	useEffect(() => {
		getReleasedMoviesList();
	}, []);

	async function getReleasedMoviesList() {
		const response = await fetch("/api/v1/movies?status=RELEASED");
		const responseBody = await response.json();
		setReleasedMoviesList(responseBody.movies);
	}

	//GETTING LIST OF GENRES FROM THE DB
	const [genresList, setGenresList] = useState([]);
	async function getAllGenres() {
		const response = await fetch("/api/v1/genres");
		const responseBody = await response.json();
		setGenresList(responseBody.genres);
	}

	//GETTING LIST OF ARTISTS FROM THE DB
	const [artistsList, setArtistsList] = useState([]);
	async function getAllArtists() {
		const response = await fetch("/api/v1/artists?page=1&limit=20");
		const responseBody = await response.json();
		setArtistsList(responseBody.artists);
	}

	//HANDLE MOVIE FILTERS
	const [movieName, setMovieName] = useState("");
	const [genres, setGenres] = useState([]);
	const [artists, setArtists] = useState([]);
	const [releaseDateStart, setReleaseDateStart] = useState("");
	const [releaseDateEnd, setReleaseDateEnd] = useState("");

	async function applyFilterHandler(e) {
		e.preventDefault();
		const headers = {
			Accept: "application/json",
			authorization: "Bearer " + sessionStorage.getItem("access-token"),
		};
		const response = await fetch(
			"/api/v1/admin/movies?" + getFilterQueryString(),
			{
				headers,
			}
		);
		if (!response.ok) {
			alert("Sign In to filter Movies!");
		} else {
			const responseBody = await response.json();
			updateFilteredMoviesList(responseBody.movies);
		}
	}

	function getFilterQueryString() {
		let filterQueryString = "status=RELEASED";
		if (movieName.length > 0) {
			filterQueryString += "&title=" + encodeURIComponent(movieName);
		}
		if (genres.length > 0) {
			filterQueryString += "&genre=" + encodeURIComponent(genres);
		}
		if (artists.length > 0) {
			filterQueryString += "&artists=" + encodeURIComponent(artists);
		}
		if (releaseDateStart.length > 0) {
			filterQueryString += "&start_date=" + releaseDateStart;
		}
		if (setReleaseDateEnd.length > 0) {
			filterQueryString += "&end_date=" + releaseDateEnd;
		}
		return filterQueryString;
	}

	//OPENS CLICKED MOVIE'S DETAILS
	const handleMovieClick = (movieId) => {
		props.history.push("/movie/" + movieId);
	};

	//UPDATES MOVIES LIST WHEN FILTERS ARE APPLIED
	function updateFilteredMoviesList(movies) {
		setReleasedMoviesList(movies);
	}

	return (
		<div>
			<Header />
			<div className="upcomingMoviesHeading">Upcoming Movies</div>

			{/* GRIDLIST OF UPCOMING MOVIES */}
			<GridList cols={6} style={{ flexWrap: "nowrap" }}>
				{upcomingMoviesList.map((movie) => (
					<GridListTile key={movie.id} style={{ height: "250px" }}>
						<img src={movie.poster_url} alt={movie.title} />
						<GridListTileBar title={movie.title} />
					</GridListTile>
				))}
			</GridList>

			{/* GRIDLIST OF RELEASED MOVIES */}
			<div className="released-movies-and-filters-container">
				<div style={{ width: "76%", margin: "16px" }}>
					<GridList cols={4}>
						{releasedMoviesList.map((movie) => (
							<GridListTile
								onClick={() => handleMovieClick(movie.id)}
								key={"grid" + movie.id}
								style={{ height: "350px", cursor: "pointer" }}
							>
								<img src={movie.poster_url} alt={movie.title} />
								<GridListTileBar
									title={movie.title}
									subtitle={
										<span>
											Release Date:{" "}
											{new Date(movie.release_date).toDateString()}
										</span>
									}
								/>
							</GridListTile>
						))}
					</GridList>
				</div>
				<div style={{ width: "24%", margin: "16px" }}>
					{/*  FILTER PANEL */}
					<Card>
						<CardContent>
							<div className={classes.heading}>FIND MOVIES BY:</div>
							<form
								id="movie-filter-form"
								onSubmit={(e) => {
									applyFilterHandler(e);
								}}
							>
								<FormControl className={classes.cardComponent}>
									<InputLabel htmlFor="movieName">Movie Name</InputLabel>
									<Input
										id="movieName"
										type="text"
										value={movieName}
										onChange={({ target }) => setMovieName(target.value)}
									/>
								</FormControl>
								<FormControl className={classes.cardComponent}>
									<InputLabel htmlFor="genres">Genres</InputLabel>
									<Select
										id="genres"
										multiple={true}
										value={genres}
										onChange={({ target }) => setGenres(target.value)}
										renderValue={(selected) => selected.join(",")}
										onFocus={getAllGenres}
									>
										{genresList.map((genre) => (
											<MenuItem value={genre.genre} key={genre.id}>
												<Checkbox checked={genres.indexOf(genre.genre) > -1} />
												<ListItemText primary={genre.genre} />
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<FormControl className={classes.cardComponent}>
									<InputLabel htmlFor="artists">Artists</InputLabel>
									<Select
										id="artists"
										multiple={true}
										value={artists}
										onChange={({ target }) => setArtists(target.value)}
										renderValue={(selected) => selected.join(",")}
										onFocus={getAllArtists}
									>
										{artistsList.map((artist) => (
											<MenuItem
												value={artist.first_name + " " + artist.last_name}
												key={artist.id}
											>
												<Checkbox
													checked={
														artists.indexOf(
															artist.first_name + " " + artist.last_name
														) > -1
													}
												/>
												<ListItemText
													primary={artist.first_name + " " + artist.last_name}
												/>
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<FormControl className={classes.cardComponent}>
									<InputLabel htmlFor="release-date-start" shrink={true}>
										Release Date Start
									</InputLabel>
									<Input
										id="release-date-start"
										type="date"
										value={releaseDateStart}
										onChange={({ target }) => setReleaseDateStart(target.value)}
									/>
								</FormControl>
								<FormControl className={classes.cardComponent}>
									<InputLabel htmlFor="release-date-end" shrink={true}>
										Release Date End
									</InputLabel>
									<Input
										id="release-date-end"
										type="date"
										value={releaseDateEnd}
										onChange={({ target }) => setReleaseDateEnd(target.value)}
									/>
								</FormControl>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									className={classes.cardComponent}
								>
									APPLY
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
export default withStyles(styles)(Home);
