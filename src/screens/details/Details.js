import React, { useEffect, useState } from "react";
import "./Details.css";
import Header from "../../common/header/Header";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Typography from "@material-ui/core/Typography";
import YouTube from "react-youtube";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { Link } from "react-router-dom";

//DETAILS FUNCTION
export default function (props) {
	//GETTING DETAILS OF THE SELECTED MOVIE
	const [movie, setMovie] = useState();
	useEffect(() => {
		const movieId = props.match.params.id;
		const headers = {
			Accept: "application/json",
			authorization: "Bearer " + sessionStorage.getItem("access-token"),
		};

		fetch("/api/v1/admin/movies/" + movieId, { headers })
			.then((response) => {
				if (!response.ok) {
					alert("Log in to see movie details!");
					window.location = "/";
				} else {
					return response.json();
				}
			})
			.then((response) => {
				setMovie(response);
			});
	}, []);

	const [starBorderIcons, setStarBorderIcons] = useState([
		{ id: 1, color: "black" },
		{ id: 2, color: "black" },
		{ id: 3, color: "black" },
		{ id: 4, color: "black" },
		{ id: 5, color: "black" },
	]);

	//CHANGE THE COLOR OF RATING ICONS
	const rateThisMovie = (starId) => {
		let noOfStars = [];
		for (let no of starBorderIcons) {
			let temp = no;
			if (no.id <= starId) {
				temp.color = "yellow";
			} else {
				temp.color = "black";
			}
			noOfStars.push(temp);
		}
		setStarBorderIcons(noOfStars);
	};

	if (movie === undefined) {
		return <div>Loading....</div>;
	} else {
		return (
			<div>
				<Header movieId={props.match.params.id} />

				{/* BACK TO HOME BUTTON */}
				<Link to="/">
					<Typography
						style={{ marginTop: "8px", marginLeft: "24px", height: "24px" }}
					>
						&lt; Back to Home
					</Typography>
				</Link>

				<div className="movie-details">
					{/* LEFT SIDE OF DETAILS PAGE */}
					<div style={{ width: "20%", margin: "15px" }}>
						<img src={movie.poster_url} alt={movie.title} />
					</div>

					{/* MIDDLE SIDE OF DETAILS PAGE */}
					<div style={{ width: "60%" }}>
						<Typography variant="h2">{movie.title}</Typography>

						{/* GENRE */}
						<div>
							<Typography inline={true} style={{ fontWeight: "bold" }}>
								Genre:{" "}
							</Typography>
							<Typography inline={true}>{movie.genres.join()}</Typography>
						</div>

						{/* DURATION */}
						<div>
							<Typography inline={true} style={{ fontWeight: "bold" }}>
								Duration:{" "}
							</Typography>
							<Typography inline={true}>{movie.duration}</Typography>
						</div>

						{/* RELEASE DATE */}
						<div>
							<Typography inline={true} style={{ fontWeight: "bold" }}>
								Release Date:{" "}
							</Typography>
							<Typography inline={true}>
								{new Date(movie.release_date).toDateString()}
							</Typography>
						</div>

						{/* RATING */}
						<div>
							<Typography inline={true} style={{ fontWeight: "bold" }}>
								Rating:{" "}
							</Typography>
							<Typography inline={true}>{movie.critics_rating}</Typography>
						</div>
						<br />

						{/* PLOT */}
						<div>
							<Typography inline={true} style={{ fontWeight: "bold" }}>
								Plot:{" "}
							</Typography>
							<Typography inline={true}>
								(<a href={movie.wiki_url}>Wiki Link</a>){movie.storyline}
							</Typography>
						</div>
						<br />

						{/* TRAILER */}
						<div>
							<Typography style={{ fontWeight: "bold" }}>Trailer: </Typography>
							<YouTube videoId={movie.trailer_url.split("v=")[1]} />
						</div>
					</div>

					{/* RIGHT SIDE OF DETAILS PAGE */}
					<div style={{ width: "20%", margin: "15px" }}>
						{/* RATE MOVIE */}
						<Typography style={{ fontWeight: "bold" }}>
							Rate this movie:
						</Typography>
						{starBorderIcons.map((star) => (
							<StarBorderIcon
								style={{ color: star.color }}
								key={"star" + star.id}
								onClick={() => rateThisMovie(star.id)}
							/>
						))}

						{/* ARTISTS */}
						<Typography style={{ fontWeight: "bold", marginTop: "15px" }}>
							Artists:
						</Typography>
						<div style={{ marginTop: "16px" }}>
							<GridList cols={2}>
								{movie.artists.map((artist) => (
									<GridListTile
										key={artist.id}
										style={{ cursor: "pointer" }}
										onClick={() => (window.location = artist.wiki_url)}
									>
										<img
											src={artist.profile_url}
											alt={artist.first_name + artist.last_name}
										/>
										<GridListTileBar
											title={artist.first_name + " " + artist.last_name}
										/>
									</GridListTile>
								))}
							</GridList>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
