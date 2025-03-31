import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { logError } from "../../utils/sentryHelper";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ArticleCard = ({ articleData }) => {
  const [autherData , setAutherData] = useState(null)
  const getAutherData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/users/${articleData?.user_id}`
      );
      setAutherData(res.data);
    } catch (error) {
      logError(error);
    }
  };
  useEffect(()=>{
    getAutherData();
  },[])
  return (
      <Link to={`/article/${articleData?.id}`} className="article-card card p-3 shadow rounded-3">
        <img
          src={
            articleData?.image_url ||
            "https://github.com/wfox5510/wordSapce-imgRepo/blob/main/banner-1.png?raw=true"
          }
          className="card-img card-img-top rounded-1 mb-5 object-fit-cover"
          alt="articleImg"
        />
        <div className="card-body p-0">
          <h5 className="card-title text-truncate-2lines fw-bold mb-3 text-primary">
            {articleData?.title}
          </h5>
          <p className="card-text mb-5 text-truncate-2lines">
            {articleData?.description}
          </p>
          <div className="d-flex justify-content-between">
            <div
              className="d-flex align-items-center"
              style={{ maxWidth: "55%" }}
            >
              <img
                src={autherData?.profile_picture || "https://raw.githubusercontent.com/wfox5510/wordSapce-imgRepo/695229fa8c60c474d3d9dc0d60b25f9539ac74d9/default-avatar.svg"}
                className="me-2 object-fit-cover rounded-pill"
                alt="avartar"
                width="40px"
                height="40px"
              />
              <span
                className="text-nowrap"
                style={{ textOverflow: "ellipsis", overflow: "hidden" }}
              >
                {articleData?.author_name}
              </span>
            </div>
            <div className="d-flex gap-2">
              <span className="text-gray d-flex align-items-center gap-1">
                <span className="material-icons-outlined">favorite</span>
                {articleData?.likes_count}
              </span>
              <span className=" text-gray d-flex align-items-center gap-1">
                <span className="material-icons-outlined">chat_bubble</span>
                {articleData?.comments.length}
              </span>
            </div>
          </div>
        </div>
      </Link>

  );
};

ArticleCard.propTypes = {
  articleData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    author_name: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    likes_count: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
  }).isRequired,
};

export default ArticleCard;
