import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFavoriteArticle } from "../../slice/favoriteSlice";
import { Link } from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";

import {
  alertMsgForAddFavorites,
  alertMsgForCancelFavorites,
} from "../../utils/alertMsg";
import { logError } from "../../utils/sentryHelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ArticleListPage = () => {
  const { isAuthorized } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [allArticleData, setAllArticleData] = useState([]);
  const [hotArticleData, setHotArticleData] = useState([]);
  const [recommendArticleData, setRecommendArticleData] = useState([]);

  //取得分類資料
  const [categoriesData, setCategoriesData] = useState(null);
  const [categoriesSelector, setCategoriesSelector] = useState([]);
  const getCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategoriesData(res.data.data);
    } catch (error) {
      logError(error);
    }
  };

  const getAllArticleData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/full`);
      const filterArticleData = res.data.data.filter(
        (item) => item.status == "published"
      );
      setAllArticleData(filterArticleData);
    } catch (error) {
      logError(error);
    }
  };

  //熱門文章 推薦文章篩選
  const filterHotArticleData = (articleData) => {
    return articleData
      .slice(0, 100)
      .filter((articleDataItem) => articleDataItem.views_count > 5)
      .filter((articleDataItem) => {
        if (categoriesSelector && categoriesSelector.length !== 0)
          return categoriesSelector.some(
            (categoriesSelectorItem) =>
              categoriesSelectorItem === articleDataItem.category_id
          );
        return true;
      });
  };
  const filterRecommendArticleData = (articleData) => {
    return articleData
      .slice(0, 100)
      .filter((articleDataItem) => articleDataItem.likes_count > 0)
      .filter((articleDataItem) => {
        if (categoriesSelector && categoriesSelector.length !== 0)
          return categoriesSelector.some(
            (categoriesSelectorItem) =>
              categoriesSelectorItem === articleDataItem.category_id
          );
        return true;
      });
  };
  const toggleCategoriesTag = (id) =>
    categoriesSelector.includes(id)
      ? setCategoriesSelector((prev) => prev.filter((item) => item !== id))
      : setCategoriesSelector((prev) => [...prev, id]);

  useEffect(() => {
    setHotArticleData(filterHotArticleData(allArticleData));
    setRecommendArticleData(filterRecommendArticleData(allArticleData));
  }, [allArticleData]);
  useEffect(() => {
    setHotArticleData(filterHotArticleData(allArticleData));
    setRecommendArticleData(filterRecommendArticleData(allArticleData));
    setCurrentPage(1);
  }, [categoriesSelector]);

  //下半部文章列表相關邏輯
  //取得所有文章資料後根據選擇分類篩選資料，用於渲染文章列表
  const [articleListData, setArticleListData] = useState(null);
  const [listSelector, setListSelector] = useState("allArticle");
  const [articleListPageCount, setArticleListPageCount] = useState(1);

  const getArticleListData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/full`);
      setArticleListData(
        res.data.data.filter(
          (articleDataItem) =>
            (articleDataItem.category_id === listSelector ||
              listSelector === "allArticle") &&
            articleDataItem.status == "published"
        )
      );
    } catch (error) {
      logError(error);
    }
  };
  //取得我的收藏文章，在文章列表提示是否收藏，且可直接點選icon取消
  //！！注意！！favorite資料為登入功能，待登入功能完成後需要加入相關邏輯
  const favorite = useSelector((state) => state.favorite.favoriteArticle);
  const getFavoriteArticle = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/favorites`);
      dispatch(setFavoriteArticle(res.data.data));
    } catch (error) {
      logError(error);
    }
  };

  const postFavorites = async (id) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/posts/favorites/${id}`);
      res.data.favorited
        ? Swal.fire(alertMsgForAddFavorites)
        : Swal.fire(alertMsgForCancelFavorites);
      getFavoriteArticle();
      getArticleListData();
    } catch (error) {
      logError(error);
    }
  };
  //文章列表沒有paganation，用滾動至底部作為新增資料的判斷
  // useEffect(() => {
  //   const handleScroll = () => {
  //     //當滑動到底部，且顯示文章數量少於文章列表資料數量
  //     window.innerHeight + window.scrollY >=
  //       document.documentElement.scrollHeight &&
  //       articleListData?.length > articleListPageCount &&
  //       setArticleListPageCount((prev) => {
  //         return prev + 10;
  //       });
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [articleListData]);

  useEffect(() => {
    getCategories();
    getAllArticleData();
    getArticleListData();
  }, []);

  useEffect(() => {
    isAuthorized && getFavoriteArticle();
  }, [isAuthorized]);
  useEffect(() => {
    getArticleListData();
  }, [listSelector]);

  return (
    <>
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
                      categoriesSelector.some(
                        (categoriesSelectorItem) =>
                          categoriesSelectorItem === categoriesDataItem.id
                      ) && "active"
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
            <div className="col-12 col-lg-7">
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
                                <h3 className="card-title fw-bold text-truncate">
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
                  <nav
                    className="d-none d-lg-block"
                    aria-label="Page navigation"
                  >
                    <ul className="hot-article-pagination pagination justify-content-center gap-2 mb-0">
                      <li className="page-item">
                        <a
                          className={`page-link material-symbols-outlined p-0 ps-1 pt-1 rounded-1 ${
                            currentPage === 1 && "disabled"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage - 1);
                          }}
                        >
                          arrow_back_ios
                        </a>
                      </li>
                      {Array.from({
                        length: Math.ceil(hotArticleData.length / 3),
                      }).map((item, index) => {
                        const totalPage = Math.ceil(hotArticleData.length / 3);
                        if (
                          currentPage - index - 1 <= 2 &&
                          currentPage - index - 1 >= -2
                        )
                          return (
                            <li className="page-item" key={index}>
                              <a
                                className={`page-link rounded-1 p-0 ${
                                  currentPage === index + 1 && "active"
                                }`}
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(index + 1);
                                }}
                              >
                                {index + 1}
                              </a>
                            </li>
                          );
                        else if (
                          currentPage < totalPage - 2 &&
                          index + 1 === totalPage
                        )
                          return (
                            <Fragment key={index}>
                              <li className="page-item">
                                <a
                                  className={`page-link rounded-1 p-0`}
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  ...
                                </a>
                              </li>
                              <li className="page-item">
                                <a
                                  className={`page-link rounded-1 p-0 ${
                                    currentPage === index + 1 && "active"
                                  }`}
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(index + 1);
                                  }}
                                >
                                  {index + 1}
                                </a>
                              </li>
                            </Fragment>
                          );
                        else if (currentPage > 3 && index === 0)
                          return (
                            <Fragment key={index}>
                              <li className="page-item">
                                <a
                                  className={`page-link rounded-1 p-0 ${
                                    currentPage === index + 1 && "active"
                                  }`}
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(index + 1);
                                  }}
                                >
                                  {index + 1}
                                </a>
                              </li>
                              <li className="page-item">
                                <a
                                  className={`page-link rounded-1 p-0`}
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  ...
                                </a>
                              </li>
                            </Fragment>
                          );
                      })}
                      <li className="page-item">
                        <a
                          className={`page-link material-symbols-outlined rounded-1 p-0 ${
                            currentPage ===
                              Math.ceil(hotArticleData.length / 3) && "disabled"
                          }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage + 1);
                          }}
                        >
                          arrow_forward_ios
                        </a>
                      </li>
                    </ul>
                  </nav>
                </>
              )}
            </div>
            <div className="col-12 col-lg-5">
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
                              alt=""
                            />
                            <div className="card-body d-flex flex-column gap-2 gap-lg-3">
                              <span className="fw-bold">
                                {recommendArticleDataItem.author_name} |
                                <span className="ms-2">
                                  {recommendArticleDataItem.category_name}
                                </span>
                              </span>

                              <h4 className="card-title text-primary fw-bold text-truncate-2lines lh-sm text-wrap">
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
                              alt=""
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
      <section className="article-list-section">
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
                                    favoriteItem.id === articleListDataItem.id
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
            <ul className="hot-article-pagination pagination justify-content-center gap-2 mb-0">
              <li className="page-item">
                <a
                  className={`page-link material-symbols-outlined p-0 ps-1 pt-1 rounded-1 ${
                    currentPage === 1 && "disabled"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setArticleListPageCount(articleListPageCount - 1);
                  }}
                >
                  arrow_back_ios
                </a>
              </li>
              {Array.from({
                length: Math.ceil(articleListData.length / 10),
              }).map((item, index) => {
                const totalPage = Math.ceil(articleListData.length / 10);
                if (
                  articleListPageCount - index - 1 <= 2 &&
                  articleListPageCount - index - 1 >= -2
                )
                  return (
                    <li className="page-item" key={index}>
                      <a
                        className={`page-link rounded-1 p-0 ${
                          articleListPageCount === index + 1 && "active"
                        }`}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setArticleListPageCount(index + 1);
                        }}
                      >
                        {index + 1}
                      </a>
                    </li>
                  );
                else if (
                  articleListPageCount < totalPage - 2 &&
                  index + 1 === totalPage
                )
                  return (
                    <Fragment key={index}>
                      <li className="page-item">
                        <a
                          className={`page-link rounded-1 p-0`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          ...
                        </a>
                      </li>
                      <li className="page-item">
                        <a
                          className={`page-link rounded-1 p-0 ${
                            articleListPageCount === index + 1 && "active"
                          }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setArticleListPageCount(index + 1);
                          }}
                        >
                          {index + 1}
                        </a>
                      </li>
                    </Fragment>
                  );
                else if (articleListPageCount > 3 && index === 0)
                  return (
                    <Fragment key={index}>
                      <li className="page-item">
                        <a
                          className={`page-link rounded-1 p-0 ${
                            articleListPageCount === index + 1 && "active"
                          }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setArticleListPageCount(index + 1);
                          }}
                        >
                          {index + 1}
                        </a>
                      </li>
                      <li className="page-item">
                        <a
                          className={`page-link rounded-1 p-0`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          ...
                        </a>
                      </li>
                    </Fragment>
                  );
              })}
              <li className="page-item">
                <a
                  className={`page-link material-symbols-outlined rounded-1 p-0 ${
                    articleListPageCount ===
                      Math.ceil(articleListData.length / 10) && "disabled"
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setArticleListPageCount(articleListPageCount + 1);
                  }}
                >
                  arrow_forward_ios
                </a>
              </li>
            </ul>
          )}
        </div>
      </section>
    </>
  );
};

export default ArticleListPage;
