import NewPostModal from "../BlogPage/CreatePostModal";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { logError } from "../../utils/sentryHelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
    
  useEffect(()=>{
    const fetchArticle = async()=>{
      try {
        const res = await axios.get(`${API_BASE_URL}/posts`);
        setArticles(res.data.data);
      } catch (error) {
        logError("❌ 文章獲取失敗:", error);
      }
    };

    fetchArticle();
  }, []);

  return (
    <div className="container mt-4">
      <h1>部落格文章</h1>
      {articles.length === 0 ? <p>載入中...</p>: (
        <ul className="list-group">
          {articles.map((article)=>(
            <li key={article.id} className="list-group-item">
              <Link to={`/testArticle/${article.id}`} className="text-decoration-none">
                <h3>{article.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      )}
      
      {/* <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newPostModal"  >
        新增文章
      </button> */}

      <NewPostModal  />
    </div>
  );
};

export default BlogPage;
