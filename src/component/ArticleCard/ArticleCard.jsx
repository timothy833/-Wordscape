import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
      console.log(error);
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
                src={autherData?.profile_picture}
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
                {articleData?.likes_count}
                <span className="material-icons-outlined">favorite</span>
              </span>
              <span className=" text-gray d-flex align-items-center gap-1">
                {articleData?.comments.length}
                <span className="material-icons-outlined">chat_bubble</span>
              </span>
            </div>
          </div>
        </div>
      </Link>

  );
};

export default ArticleCard;
