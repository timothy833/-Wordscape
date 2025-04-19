import { useEffect, useState, useRef, useCallback, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFavoriteArticle } from "../../slice/favoriteSlice";
import { Link } from "react-router-dom";
import ArticlePagination from "../../component/ArticlePagination/ArticlePagination";
import axios from "axios";
import Swal from "sweetalert2";

import {
  alertMsgForAddFavorites,
  alertMsgForCancelFavorites,
} from "../../utils/alertMsg";
import { logError } from "../../utils/sentryHelper";
import LoadingSpinner from "../../component/LoadingSpinner/LoadingSpinner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ArticleListPage = () => {
  const { isAuthorized } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const articleListRef = useRef(null);
  const isFirstLoad = useRef(true);
  const loadingCount = useRef(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [allArticleData, setAllArticleData] = useState([]);
  const [hotArticleData, setHotArticleData] = useState([]);
  const [recommendArticleData, setRecommendArticleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //取得分類資料
  const [categoriesData, setCategoriesData] = useState(null);
  const [categoriesSelector, setCategoriesSelector] = useState("");

  const startLoading = () => {
    loadingCount.current += 1;
    setIsLoading(true);
  };

  const endLoading = () => {
    loadingCount.current -= 1;
    if (loadingCount.current === 0) {
      setIsLoading(false);
    }
  };

  const getCategories = useCallback(async () => {
    try {
      startLoading();
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategoriesData(res.data.data);
    } catch (error) {
      logError(error);
    } finally {
      endLoading();
    }
  }, []);

  const getAllArticleData = useCallback(async () => {
    try {
      startLoading();
      const res = await axios.get(`${API_BASE_URL}/posts/full`);
      const filterArticleData = res.data.data.filter(
        (item) => item.status === "published"
      );
      setAllArticleData(filterArticleData);
    } catch (error) {
      logError(error);
    } finally {
      endLoading();
    }
  }, []);

  //熱門文章 推薦文章篩選
  const filterHotArticleData = useCallback(
    (articleData) => {
      return articleData
        .slice(0, 100)
        .filter((item) => item.views_count > 5)
        .filter((item) => {
          if (categoriesSelector)
            return categoriesSelector === item.category_id;
          return true;
        });
    },
    [categoriesSelector]
  );

  const filterRecommendArticleData = useCallback(
    (articleData) => {
      return articleData
        .slice(0, 100)
        .filter((item) => item.likes_count > 0)
        .filter((item) => {
          if (categoriesSelector)
            return categoriesSelector === item.category_id;
          return true;
        });
    },
    [categoriesSelector]
  );

  const toggleCategoriesTag = (id) => {
    categoriesSelector === id
      ? setCategoriesSelector("")
      : setCategoriesSelector(id);
  };

  useEffect(() => {
    setHotArticleData(filterHotArticleData(allArticleData));
    setRecommendArticleData(filterRecommendArticleData(allArticleData));
  }, [allArticleData, filterHotArticleData, filterRecommendArticleData]);

  useEffect(() => {
    setHotArticleData(filterHotArticleData(allArticleData));
    setRecommendArticleData(filterRecommendArticleData(allArticleData));
    setCurrentPage(1);
  }, [
    categoriesSelector,
    filterHotArticleData,
    filterRecommendArticleData,
    allArticleData,
  ]);

  //下半部文章列表相關邏輯
  //取得所有文章資料後根據選擇分類篩選資料，用於渲染文章列表
  const [articleListData, setArticleListData] = useState([]);
  const [listSelector, setListSelector] = useState("allArticle");
  const [articleListPageCount, setArticleListPageCount] = useState(1);

  const getArticleListData = useCallback(async () => {
    try {
      startLoading();
      const res = await axios.get(`${API_BASE_URL}/posts/full`);
      setArticleListData(
        res.data.data.filter(
          (articleDataItem) =>
            (articleDataItem.category_id === listSelector ||
              listSelector === "allArticle") &&
            articleDataItem.status == "published"
        )
      );
      setArticleListPageCount(1);
    } catch (error) {
      logError(error);
    } finally {
      endLoading();
    }
  }, [listSelector]);

  //取得我的收藏文章，在文章列表提示是否收藏，且可直接點選icon取消
  //！！注意！！favorite資料為登入功能，待登入功能完成後需要加入相關邏輯
  const favorite = useSelector((state) => state.favorite.favoriteArticle);
  const getFavoriteArticle = useCallback(async () => {
    try {
      startLoading();
      const res = await axios.get(`${API_BASE_URL}/posts/favorites`);
      dispatch(setFavoriteArticle(res.data.data));
    } catch (error) {
      logError(error);
    } finally {
      endLoading();
    }
  }, [dispatch]);

  const postFavorites = async (id) => {
    try {
      startLoading();
      const res = await axios.post(`${API_BASE_URL}/posts/favorites/${id}`);
      res.data.favorited
        ? Swal.fire(alertMsgForAddFavorites)
        : Swal.fire(alertMsgForCancelFavorites);
      getFavoriteArticle();
      getArticleListData();
    } catch (error) {
      logError(error);
    } finally {
      endLoading();
    }
  };

  useEffect(() => {
    getCategories();
    getAllArticleData();
    getArticleListData();
  }, [getCategories, getAllArticleData, getArticleListData]);

  useEffect(() => {
    if (isAuthorized) getFavoriteArticle();
  }, [isAuthorized, getFavoriteArticle]);

  useEffect(() => {
    getArticleListData();
  }, [listSelector, getArticleListData]);

  useEffect(() => {
    if (articleListRef.current && !isFirstLoad.current) {
      articleListRef.current.scrollIntoView({ behavior: "smooth" });
    }
    isFirstLoad.current = false;
  }, [articleListPageCount]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <section>
        <div className="container pt-6 pb-3 pt-lg-10 pb-lg-10 bg-light">
          <h2 className="fs-7 fs-md-7 fw-bold text-dark">類別選擇</h2>
          <ul className="article-taglist list-unstyled d-flex flex-wrap gap-1 gap-lg-2 mb-2 mb-lg-1 pt-3">
            {categoriesData?.map((categoriesDataItem) => {
              return (
                <li key={categoriesDataItem.id}>
                  <a
                    className={`article-tag pe-open lh-lg fs-8 fs-lg-8 rounded-pill
                    ${
                      categoriesSelector === categoriesDataItem.id && "active"
                    }`}
                    onClick={() => toggleCategoriesTag(categoriesDataItem.id)}
                  >
                    {categoriesDataItem.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section className="recommend-article-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <h2 className="text-primary fs-6 fs-lg-3 fw-bold mb-3 mb-lg-7 p-0 p-lg-2">
                熱門文章
              </h2>
              {hotArticleData.length === 0 ? (
                <span className="fs-6 fw-bold text-gray">
                  目前沒有相關的熱門文章
                </span>
              ) : (
                <>
                  <ul className="list-unstyled mb-6 d-flex flex-column gap-3 gap-lg-6 ">
                    {hotArticleData
                      .slice((currentPage - 1) * 3, (currentPage - 1) * 3 + 3)
                      .map((hotArticleDataItem) => {
                        return (
                          <li
                            className="hot-article-card"
                            key={hotArticleDataItem.id}
                          >
                            <Link
                              to={`/article/${hotArticleDataItem.id}`}
                              className="card border-0 gap-1 gap-lg-2"
                            >
                              <img
                                src={
                                  hotArticleDataItem.image_url ||
                                  "https://github.com/wfox5510/wordSapce-imgRepo/blob/main/banner-1.png?raw=true"
                                }
                                className="card-img-top object-fit-cover mb-2 rounded"
                                alt="..."
                              />
                              <div className="card-body p-0">
                                <h3 className="card-title text-primary fw-bold text-truncate">
                                  {hotArticleDataItem.title}
                                </h3>
                                <p className="card-text text-truncate fs-8 fs-lg-8">
                                  {hotArticleDataItem.description}
                                </p>
                              </div>
                              <div className="card-footer border-0 p-0">
                                <span className="me-2">
                                  {hotArticleDataItem.author_name} |
                                </span>
                                <span>{hotArticleDataItem.category_name}</span>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                  </ul>

                  <ArticlePagination
                    totalItems={hotArticleData.length}
                    itemsPerPage={3}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    className="hot-article-pagination d-none d-lg-flex"
                  />
                </>
              )}
            </div>
            <div className="col-lg-5">
              <h2 className="text-primary fs-6 fs-lg-3 fw-bold mb-3 mb-lg-7 p-0 p-lg-2">
                推薦專欄
              </h2>
              {recommendArticleData.length === 0 ? (
                <span className="fs-6 fw-bold text-gray">
                  目前沒有相關的推薦文章
                </span>
              ) : (
                <ul className="list-unstyled d-flex flex-column gap-3 gap-md-6">
                  {recommendArticleData
                    .slice(0, 3)
                    .map((recommendArticleDataItem) => {
                      return (
                        <li
                          key={recommendArticleDataItem.id}
                          className="recommend-article-card rounded-2 border-bottom border-2 border-lg-4 border-primary"
                        >
                          <Link
                            to={`/article/${recommendArticleDataItem.id}`}
                            className="d-flex align-items-center py-4 px-5 py-lg-7 px-lg-9"
                          >
                            <img
                              className="card-img me-3 me-lg-6 object-fit-cover rounded"
                              src={
                                recommendArticleDataItem.image_url ||
                                "https://github.com/wfox5510/wordSapve-imgRepo/blob/main/articleList-recommend1.png?raw=true"
                              }
                              alt="recommend-article-img"
                            />
                            <div className="card-body d-flex flex-column gap-2 gap-lg-3">
                              <span className="fw-bold">
                                {recommendArticleDataItem.author_name} |
                                <span className="ms-2">
                                  {recommendArticleDataItem.category_name}
                                </span>
                              </span>

                              <h4 className="card-title fw-bold text-truncate-2lines lh-sm text-wrap">
                                {recommendArticleDataItem.title}
                              </h4>
                              <p className="card-text text-truncate-2lines fs-8 fs-lg-8">
                                {recommendArticleDataItem.description}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  {recommendArticleData
                    .slice(3, 5)
                    .map((recommendArticleDataItem) => {
                      return (
                        <li
                          key={recommendArticleDataItem.id}
                          className="d-none d-lg-block recommend-article-card rounded-2 border-bottom border-2 border-lg-4 border-primary"
                        >
                          <Link
                            to={`/article/${recommendArticleDataItem.id}`}
                            className="d-flex py-4 px-5 py-lg-7 px-lg-9"
                          >
                            <img
                              className="card-img me-3 me-lg-6 object-fit-cover rounded"
                              src={
                                recommendArticleDataItem.image_url ||
                                "https://github.com/wfox5510/wordSapve-imgRepo/blob/main/articleList-recommend1.png?raw=true"
                              }
                              alt="recommend-article-img"
                            />
                            <div className="card-body d-flex flex-column gap-2 gap-lg-3">
                              <span className="fw-bold">
                                {recommendArticleDataItem.author_name} |
                                <span className="ms-2">
                                  {recommendArticleDataItem.category_name}
                                </span>
                              </span>

                              <h4 className="card-title text-primary fw-bold text-truncate-2lines lh-sm">
                                {recommendArticleDataItem.title}
                              </h4>
                              <p className="card-text text-truncate-2lines fs-9 fs-lg-8">
                                {recommendArticleDataItem.description}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="article-list-section" ref={articleListRef}>
        <div
          className="article-list-wrap container py-8 py-lg-10 px-lg-5 rounded-2"
          style={{ backgroundColor: "#FFFDFB" }}
        >
          <h2 className="text-primary fs-6 fs-lg-3 fw-bold mb-3 mb-lg-7 p-0 p-lg-2">
            文章列表
          </h2>
          <div className="d-none d-lg-flex justify-content-between mb-5">
            <div className="article-list-select-wrap">
              <select
                className="text-dark p-3 border rounded-2"
                name="article-list-class"
                id="article-list-class"
                onChange={(e) => setListSelector(e.target.value)}
              >
                <option value="allArticle">全部內容</option>
                {categoriesData?.map((categoriesDataItem) => {
                  return (
                    <option
                      key={categoriesDataItem.id}
                      value={categoriesDataItem.id}
                    >
                      {categoriesDataItem.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          {articleListData.length > 0 ? (
            <Fragment>
              <ul className="list-unstyled d-flex flex-column gap-5 px-4 px-lg-0">
                {articleListData
                  ?.slice(
                    (articleListPageCount - 1) * 10,
                    articleListPageCount * 10
                  )
                  .map((articleListDataItem) => {
                    return (
                      <li key={articleListDataItem.id}>
                        <Link
                          to={`/article/${articleListDataItem.id}`}
                          className="article-list-card d-flex rounded-2 border flex-column-reverse flex-md-row justify-content-between p-5"
                        >
                          <div className="d-flex flex-column gap-5 me-md-6">
                            <h3 className="text-primary fs-7 fw-bold text-truncate-2lines lh-sm">
                              {articleListDataItem.title}
                            </h3>
                            <p className="text-truncate-2lines ">
                              {articleListDataItem.description}
                            </p>
                            <div className="d-flex align-items-center gap-3 mt-auto">
                              <span className="text-gray">
                                {new Date(
                                  articleListDataItem.created_at
                                ).toLocaleDateString()}
                              </span>
                              <span className="text-gray d-flex align-items-center gap-1">
                                <span className="material-icons-outlined">
                                  favorite
                                </span>
                                {articleListDataItem.likes_count}
                              </span>
                              <span className=" text-gray d-flex align-items-center gap-1">
                                <span className="material-icons-outlined">
                                  chat_bubble
                                </span>
                                {articleListDataItem.comments.length}
                              </span>
                              {isAuthorized && (
                                <span
                                  className={`${
                                    favorite.some(
                                      (favoriteItem) =>
                                        favoriteItem.id ===
                                        articleListDataItem.id
                                    )
                                      ? "text-primary"
                                      : "text-gray"
                                  } pb-1 d-flex align-items-center gap-1`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    postFavorites(articleListDataItem.id);
                                  }}
                                >
                                  <span className="material-symbols-outlined icon-fill">
                                    bookmark
                                  </span>
                                  {articleListDataItem.favorites_count}
                                </span>
                              )}
                            </div>
                          </div>
                          <img
                            className="card-img object-fit-cover mb-5 mb-md-0 rounded"
                            src={
                              articleListDataItem.image_url ||
                              "https://github.com/wfox5510/wordSapce-imgRepo/blob/main/banner-1.png?raw=true"
                            }
                            alt="article-img"
                          />
                        </Link>
                      </li>
                    );
                  })}
              </ul>
              {articleListData && (
                <ArticlePagination
                  totalItems={articleListData.length}
                  itemsPerPage={10}
                  currentPage={articleListPageCount}
                  onPageChange={(page) => setArticleListPageCount(page)}
                  className="hot-article-pagination"
                />
              )}
            </Fragment>
          ) : (
            <span className="fs-6 d-block fw-bold text-gray text-center">
              目前沒有相關的文章喔
            </span>
          )}
        </div>
      </section>
    </>
  );
};

export default ArticleListPage;
