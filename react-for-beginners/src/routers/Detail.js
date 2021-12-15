import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Detail() {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState([]);
  const { id } = useParams();
  const getMovie = async () => {
    const json = await (
      await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    ).json();
    setDetail(json.data.movie);
    setLoading(false);
  };
  useEffect(() => {
    getMovie();
  }, []);
  return (
    <div>
      <form>
        {loading ? (
          <strong>Loading...</strong>
        ) : (
          <div>
            <h1>{detail.title_long}</h1>
            <h4>Rating : {detail.rating}</h4>
            <h4>Run Time : {detail.runtime}</h4>
            <div>
              <img src={detail.medium_cover_image} alt={detail.title} />
            </div>
            <div>
              <ul>
                {detail.genres.map((genre) => (
                  <li>{genre}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>{detail.description_full}</h4>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Detail;
