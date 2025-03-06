import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFavoriteArticle } from "../../slice/favoriteSlice";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ArticleListPage = () => {
  const [categoriesData, setCategoriesData] = useState(null);
  const [articleListData, setArticleListData] = useState(null);
  const [allArticleData, setAllArticleData] = useState(null);
  axios.defaults.headers.common["Authorization"] =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJjMTEzMGE1LThkZWQtNDU1NC1iN2I2LWZhMGRiN2RmZDJhZSIsInVzZXJuYW1lIjoic21hbGxQaWdneSIsImlhdCI6MTc0MTI0NDc5MSwiZXhwIjoxNzQxMjQ4MzkxfQ.B3dEiZihp74-RUXY_RymrnGKxhSaimlxcTrhCA1QUiY";

  const dispatch = useDispatch();
  const favorite = useSelector((state) => state.favorite.favoriteArticle);
  const getFavoriteArticle = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/favorites`);
      dispatch(setFavoriteArticle(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };
  const getCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategoriesData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllArticleData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts`);
      setAllArticleData(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getArticleData = async (page = 1) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts?page=${page}`);
      setArticleListData(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFavoriteArticle();
    getCategories();
    getAllArticleData();
    getArticleData();
  }, []);
  return (
    <>
      <section>
        <div className="container pt-6 pb-3 pt-lg-17 pb-lg-10">
          <h2 className="fs-8 fs-lg-7 fw-bold text-dark mb-3">類別選擇</h2>
          <ul className="article-taglist list-unstyled d-flex flex-wrap gap-1 gap-lg-2 mb-2 mb-lg-3">
            {categoriesData?.map((categoriesDataItem) => {
              return (
                <li key={categoriesDataItem.id}>
                  <a className="article-tag lh-lg fs-9 fs-lg-8 rounded-pill">
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
              <ul className="list-unstyled mb-6 d-flex flex-column gap-3 gap-lg-6 ">
                {Array.from({ length: 3 }).map(() => {
                  return (
                    <li className="hot-article-card">
                      <a href="#" className="card border-0 gap-1 gap-lg-2">
                        <img
                          src="https://github.com/wfox5510/wordSapce-imgRepo/blob/main/articleList-hot1.png?raw=true"
                          className="card-img-top object-fit-cover"
                          alt="..."
                        />
                        <div className="card-body p-0">
                          <h3 className="card-title fw-bold text-truncate">
                            為什麼拖延症不是你的錯？心理學揭密拖延的真正原因！
                          </h3>
                          <p className="card-text text-truncate fs-9 fs-lg-8">
                            你可能認為自己只是懶惰或缺乏自制力，但心理學研究顯示，拖延的真正原因並非如此簡單...
                          </p>
                        </div>
                        <div className="card-footer border-0 p-0 bg-light">
                          <span className="me-2">陳奕文 |</span>
                          <span>心理學作家</span>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <nav className="d-none d-lg-block" aria-label="Page navigation">
                <ul class="hot-article-pagination pagination justify-content-center gap-2 mb-0">
                  <li class="page-item" disable={true}>
                    <a class="page-link material-symbols-outlined p-0 ps-1 pt-1 rounded-1">
                      arrow_back_ios
                    </a>
                  </li>
                  {Array.from({ length: 10 }).map((item, index) => {
                    if (index === 0) {
                      return (
                        <li class="page-item">
                          <a class="page-link rounded-1 active p-0" href="#">
                            {index + 1}
                          </a>
                        </li>
                      );
                    } else if (index + 1 <= 2 || 10 - (index + 1) < 2)
                      return (
                        <li class="page-item">
                          <a class="page-link rounded-1 p-0" href="#">
                            {index + 1}
                          </a>
                        </li>
                      );
                    else if (index + 1 === 3) {
                      return (
                        <li class="page-item">
                          <a class="page-link rounded-1 p-0" href="#">
                            ...
                          </a>
                        </li>
                      );
                    }
                  })}
                  <li class="page-item">
                    <a
                      class="page-link material-symbols-outlined rounded-1 p-0"
                      href="#"
                    >
                      arrow_forward_ios
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-12 col-lg-5">
              <h2 className="text-primary fs-6 fs-lg-3 fw-bold mb-3 mb-lg-7 p-0 p-lg-2">
                推薦專欄
              </h2>
              <ul className="list-unstyled d-flex flex-column gap-6">
                {Array.from({ length: 5 }).map(() => {
                  return (
                    <li className="recommend-article-card bg-light rounded-2 border-bottom border-2 border-lg-4 border-primary">
                      <a href="#" className="d-flex py-4 px-5 py-lg-7 px-lg-9">
                        <img
                          className="card-img me-3 me-lg-6 object-fit-cover"
                          src="https://github.com/wfox5510/wordSapve-imgRepo/blob/main/articleList-recommend1.png?raw=true"
                          alt=""
                        />
                        <div className="card-body d-flex flex-column gap-2 gap-lg-3">
                          <h3 className="fs-9 fs-lg-8 fw-bold">
                            【程式設計的美感】
                          </h3>
                          <h4 className="card-title text-primary fw-bold text-truncate-2lines lh-sm">
                            設計師與工程師的橋樑：讓 UI/UX 更直覺的
                            7個程式技巧！
                          </h4>
                          <p className="card-text text-truncate-2lines fs-9 fs-lg-8">
                            結合設計與開發，談如何讓網站既有視覺美感，又兼具良好使用者體驗。
                          </p>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
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
                className="text-dark p-3 border"
                name="article-list-class"
                id="article-list-class"
              >
                <option value="allArticle">全部內容</option>
                <option value="opinionsSharing">心得分享</option>
                <option value="bookReport">書籍評論</option>
              </select>
            </div>
            <button className="btn btn-lg btn-primary fw-bold lh-sm">
              新增文章
            </button>
          </div>
          <ul className="list-unstyled d-flex flex-column gap-5 px-4 px-lg-0">
            {/* {articleListData.map((articleListDataItem) => {
              <li className="rounded-2 border">
                <a
                  className="article-list-card d-flex flex-column-reverse flex-md-row justify-content-between p-5"
                  href="#"
                >
                  <div className="d-flex flex-column gap-5 me-md-6">
                    <h3 className="text-primary fs-7 fw-bold text-truncate-2lines lh-sm">
                      {articleListDataItem.title}
                    </h3>
                    <p className="text-truncate-2lines ">
                    {articleListDataItem.description}
                    </p>
                    <div className="d-flex align-items-center gap-3 mt-auto">
                      <span className="text-gray">2024/12/22</span>
                      <span className="text-gray d-flex align-items-center gap-1">
                        {articleListDataItem.likes_count}
                        <span className="material-icons-outlined">
                          favorite
                        </span>
                      </span>
                      <span className=" text-gray d-flex align-items-center gap-1">
                        16
                        <span className="material-icons-outlined">
                          chat_bubble
                        </span>
                      </span>
                      <span class="material-symbols-outlined text-primary ms-2 pb-1 icon-fill">
                        bookmark
                      </span>
                    </div>
                  </div>
                  <img
                    className="card-img object-fit-cover mb-5 mb-md-0"
                    src="https://github.com/wfox5510/wordSapce-imgRepo/blob/main/articleList-article1.png?raw=true"
                    alt=""
                  />
                </a>
              </li>;
            })} */}
            {Array.from({ length: 10 }).map(() => {
              return (
                <li className="rounded-2 border">
                  <a
                    className="article-list-card d-flex flex-column-reverse flex-md-row justify-content-between p-5"
                    href="#"
                  >
                    <div className="d-flex flex-column gap-5 me-md-6">
                      <h3 className="text-primary fs-7 fw-bold text-truncate-2lines lh-sm">
                        提升專注力的五個簡單方法，讓你事半功倍
                      </h3>
                      <p className="text-truncate-2lines ">
                        專注力是現代生活中不可或缺的能力，但往往被繁忙的生活打散。這篇文章分享五個實用又簡單的技巧，幫助你在工作和生活中找回專注，實現更高效率。
                      </p>
                      <div className="d-flex align-items-center gap-3 mt-auto">
                        <span className="text-gray">2024/12/22</span>
                        <span className="text-gray d-flex align-items-center gap-1">
                          143
                          <span className="material-icons-outlined">
                            favorite
                          </span>
                        </span>
                        <span className=" text-gray d-flex align-items-center gap-1">
                          16
                          <span className="material-icons-outlined">
                            chat_bubble
                          </span>
                        </span>
                        <span class="material-symbols-outlined text-primary ms-2 pb-1 icon-fill">
                          bookmark
                        </span>
                      </div>
                    </div>
                    <img
                      className="card-img object-fit-cover mb-5 mb-md-0"
                      src="https://github.com/wfox5510/wordSapce-imgRepo/blob/main/articleList-article1.png?raw=true"
                      alt=""
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
};

export default ArticleListPage;
