import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LeftArrow from "../assets/images/left-arrow.png";
import "./ShowDetails.css";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import { useFavorite } from "../Contexts/FavoriteContext";

interface ShowDetailsData {
  name: string;
  image: { original: string };
  premiered: string;
  summary: string;
  network: { country: { name: string } };
  genres: string[];
}

function ShowDetails() {
  const { id } = useParams<{ id: string }>();
  const [show, setMovie] = useState<ShowDetailsData | null>(null);
  const { favorites, setFavorites } = useFavorite();
  const MovieSummary = ({ summary }: { summary: string }) => {
    return <div>{parse(summary)}</div>;
  };

  useEffect(() => {
    if (id) {
      fetch(`https://api.tvmaze.com/shows/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setMovie(data);
        });
    }
  }, [id]);

  if (!show) {
    return <p>Loading...</p>;
  }

  const toggleFavorite = (showId: number) => {
    if (favorites.includes(showId)) {
      setFavorites(favorites.filter((id) => id !== showId));
    } else {
      setFavorites([...favorites, showId]);
    }
  };
  const showId = id ? Number(id) : null;

  const isFavorite = showId !== null && favorites.includes(showId);
  return (
    <section className="show-details">
      <section className="show-card">
        <img
          src={show.image.original}
          alt={show.name}
          className="show-poster"
        />
        <div className="show-info">
          <h1>{show.name}</h1>
          <p>
            <strong>Release date :</strong>{" "}
            {new Date(show.premiered).getFullYear()}
          </p>
          <p>
            <strong>Country :</strong> {show.network?.country.name}
          </p>
          <p>
            <strong>Genres :</strong> {show.genres.join(", ")}
          </p>
          <div id="star-position">
            <p id="summary">
              <MovieSummary summary={show.summary} />
            </p>

            <button
              type="button"
              id="star-button"
              onClick={() => toggleFavorite(Number(id))}
            >
              {isFavorite ? "⭐" : "☆"}
            </button>
          </div>
        </div>
      </section>
      <section id="back-button-section">
        <Link to="/" style={{ textDecoration: "none" }}>
          <button type="button">
            <img src={LeftArrow} alt="Retour en arrière" id="back-button" />
          </button>
        </Link>
      </section>
    </section>
  );
}

export default ShowDetails;