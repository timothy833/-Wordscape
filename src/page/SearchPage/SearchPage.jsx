import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from 'axios';
import { useEffect, useState,useCallback } from 'react';
import LoadingSpinner from '../../component/LoadingSpinner/LoadingSpinner';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Swal from 'sweetalert2';
import { alertMsgForAdminInfo } from "../../utils/alertMsg";
import { alertMsgForAdminError } from "../../utils/alertMsg";
import { logError } from '../../utils/sentryHelper';

const SearchPage = () => {
  const [isLoading,setIsLoading] = useState(false);
  const { isAuthorized } = useSelector(state => state.auth);
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");

  const fetchSearchResults = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/posts/full`);
      const filteredPosts = res.data.data.filter(post =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredPosts);
    } catch (error) {
      logError("搜尋失敗", error);
    }finally{
      setIsLoading(false);
    }
  }, [searchQuery]); 

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery,fetchSearchResults]);


  // 收藏
  const [isFavorite, setIsFavorite] = useState({});

  const checkIsFavorites = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/favorites`);
      const favoriteArticles = res.data.data.map((item) => item.id);

      setIsFavorite(() => {
        const updatedFavorites = {};
        searchResults.forEach((post) => {
          updatedFavorites[post.id] = favoriteArticles.includes(post.id);
        });
        return updatedFavorites;
      });
    } catch (error) {
      logError("取得收藏文章失敗", error);
    }
  };

  const postFavorites = async (id) => {
    try {
      setIsLoading(true);
      await axios.post(`${API_BASE_URL}/posts/favorites/${id}`);
      checkIsFavorites();
      fetchSearchResults();
      Swal.fire(alertMsgForAdminInfo);
    } catch (error) {
      Swal.fire(alertMsgForAdminError);
      logError("收藏操作失敗", error);
    }finally{
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (isAuthorized) {
      checkIsFavorites();
    }
  }, [isAuthorized, searchResults]);

  return (
    <>
    {isLoading && <LoadingSpinner />}
    <div className='container'>
      {searchResults.length ? (
        <>
          <h1 className='text-primary fs-6 fs-lg-3 fw-bold mb-3 p-0 p-lg-2'>搜尋結果 - {searchQuery}</h1>
          <ul className="list-unstyled d-flex flex-column gap-5 px-4 px-lg-0">
            {searchResults.map(post => (
              <li key={post.id} className="rounded-2 border">
                <Link
                  to={`/article/${post.id}`}
                  className="article-list-card d-flex flex-column-reverse flex-md-row justify-content-between p-5"
                >
                  <div className="d-flex flex-column gap-5 me-md-6">
                    <h3 className="text-primary fs-7 fw-bold text-truncate-2lines lh-sm">
                      {post.title}
                    </h3>
                    <p className="text-truncate-2lines ">
                      {post.description}
                    </p>
                    <div className="d-flex align-items-center gap-3 mt-auto">
                      <span className="text-gray">
                        {new Date(
                          post.created_at
                        ).toLocaleDateString()}
                      </span>
                      <span className="text-gray d-flex align-items-center gap-1">
                        {post.likes_count}
                        <span className="material-icons-outlined">
                          favorite
                        </span>
                      </span>
                      <span className=" text-gray d-flex align-items-center gap-1">
                        {post.comments.length}
                        <span className="material-icons-outlined">
                          chat_bubble
                        </span>
                      </span>
                      {isAuthorized && (
                        <span
                          className={`${isFavorite[post.id] ? "text-primary" : "text-gray"} pb-1 d-flex align-items-center gap-1`}
                          onClick={(e) => {
                            e.preventDefault();
                            postFavorites(post.id);
                          }}
                        >
                          {post.favorites_count}
                          <span className="material-symbols-outlined icon-fill">bookmark</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <img
                    className="card-img object-fit-cover mb-5 mb-md-0"
                    src={
                      post.image_url ||
                      "https://github.com/wfox5510/wordSapce-imgRepo/blob/main/banner-1.png?raw=true"
                    }
                    alt="article-img"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className='text-primary fs-6 fs-lg-4 fw-bold mb-3 p-0 p-lg-2'>未找到相關文章</p>
      )}
    </div>
    </>
  );
};

export default SearchPage;
