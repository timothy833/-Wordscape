import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import ArticleCard from "../../component/ArticleCard/ArticleCard";
import CommentBox from "../../component/CommentBox/CommentBox";
import CommentReply from "../../component/CommentReply/CommentReply";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DOMParserReact from "dom-parser-react";
import Swal from "sweetalert2";
import {
  alertMsgForVerify,
  alertMsgForAddFavorites,
  alertMsgForCancelFavorites,
  alertMsgForSuccess,
} from "../../utils/alertMsg";
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import SponsorModal from "../../component/SponsorModal/SponsorModal";
import { logError } from "../../utils/sentryHelper";

const ArticlePage = () => {
  const { id: articleId } = useParams();
  const { isAuthorized, id: userId } = useSelector((state) => state.auth);

  const [articleData, setArticleData] = useState(null);
  const [autherData, setAutherData] = useState(null);
  const [commentData, setCommentData] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  // 登入相關狀態
  const [isLike, setIsLike] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(null);


  const getArticle = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/${articleId}`);
      setArticleData(res.data.data);
    } catch (error) {
      logError(error);
    }
  };
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
  //留言相關功能(需登入)
  const getComment = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/comments/${articleId}`);
      setCommentData(res.data.data);
    } catch (error) {
      logError(error);
    }
  };
  const postComment = async () => {
    try {
      await axios.post(`${API_BASE_URL}/comments`, {
        post_id: articleId,
        content: commentInput,
      });
      setCommentInput("");
      getComment();
    } catch (error) {
      logError(error);
    }
  };
  //訂閱相關功能(需登入)
  const checkIsSubscribed = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/subscriptions`);
      setIsSubscribed(
        res.data.data.some(
          (subscribedData) => subscribedData.user_id === articleData?.user_id
        )
      );
    } catch (error) {
      logError(error);
    }
  };
  const postSubscribed = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/subscriptions/${articleData.user_id}`
      );
      res.data.subscribed
        ? Swal.fire({...alertMsgForSuccess,title:"已成功追蹤"})
        : Swal.fire({...alertMsgForSuccess,title:"已取消追蹤"});
      checkIsSubscribed();
    } catch (error) {
      logError(error);
    }
  };
  //點讚相關功能(需登入)
  const checkIsLikeArticle = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/posts/post_likes/${articleId}`
      );
      setIsLike(res.data.data.some((likeData) => likeData.id === userId));
    } catch (error) {
      logError(error);
    }
  };
  const postArticleLike = async () => {
    try {
      //可以加入動畫增加使用體驗，次要
      await axios.post(
        `${API_BASE_URL}/posts/post_likes/${articleId}`
      );
      getArticle(); //為了取得讚數在進行一次get文章資料，是否可以進行優化
      checkIsLikeArticle();
    } catch (error) {
      logError(error);
    }
  };
  //收藏相關功能(需登入)
  const checkIsFavorites = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/favorites`);
      setIsFavorite(
        res.data.data?.some(
          (favoritesDataItem) => favoritesDataItem.id === articleId
        )
      );
    } catch (error) {
      logError(error);
    }
  };
  const postFavorites = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/posts/favorites/${articleId}`
      );
      res.data.favorited
        ? Swal.fire(alertMsgForAddFavorites)
        : Swal.fire(alertMsgForCancelFavorites);
      checkIsFavorites();
    } catch (error) {
      logError(error);
    }
  };
  //用於處理推薦文章
  const [allArticleData, setAllArticleData] = useState([]);
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
  // ✅ 顯示距離現在多久
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffMs = now - createdAt;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    return diffDays > 0 ? `${diffDays} 天前` : diffHours > 0 ? `${diffHours} 小時前` : "剛剛";
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getArticle();
    getComment();
    getAllArticleData();
  }, [articleId]);
  //判斷訂閱需要取得articleData中作者的資料，用useEffect確保setState的值正確取得
  useEffect(() => {
    if (articleData) {
      getAutherData();
      isAuthorized && checkIsSubscribed();
    }
  }, [articleData]);
  useEffect(() => {
    if (isAuthorized) {
      checkIsLikeArticle();
      checkIsFavorites();
      checkIsSubscribed();
    } else if (!isAuthorized) {
      setIsLike(null);
      setIsFavorite(false);
      setIsSubscribed(null);
    }
  }, [isAuthorized, articleId]);

  return (
    <>
      <header>
        <div className="container">
          <div className="pt-10 pt-lg-15 pb-5 pb-lg-10 z-3">
            <div className="d-flex gap-2 mb-5">
              {articleData?.tags.map((tagItem) => {
                return (
                  <a
                    className="badge rounded-pill bg-primary-hover lh-base"
                    style={{ cursor: "pointer", fontSize: ".9rem" }}
                    key={tagItem.id}
                  >
                    #{tagItem.name}
                  </a>
                );
              })}
            </div>
            <div className="text-primary fs-md-6 fs-4 fs-lg-1 fw-bold mb-5">
              {articleData?.title}
            </div>
            <div className="d-flex gap-3 flex-column flex-lg-row">
              <div className="d-flex align-items-center gap-4">
                <Link
                  to={`/blog/${autherData?.id}`}
                  className="d-flex align-items-center"
                >
                  <img
                    className="avatar object-fit-cover rounded-pill me-2"
                    src={
                      autherData?.profile_picture ||
                      "https://raw.githubusercontent.com/wfox5510/wordSapce-imgRepo/695229fa8c60c474d3d9dc0d60b25f9539ac74d9/default-avatar.svg"
                    }
                    alt="avatar"
                  />
                  <span>{autherData?.username}</span>
                </Link>
                {/* 當目前user為作者時，不顯示追蹤按鈕 */}
                {userId !== articleData?.user_id && (
                  <a
                    className={`me-1 ${
                      isSubscribed ? "text-primary" : "text-gray"
                    } d-flex align-items-center`}
                    onClick={(e) => {
                      e.preventDefault();
                      isAuthorized
                        ? postSubscribed()
                        : Swal.fire(alertMsgForVerify);
                    }}
                    href="#"
                  >
                    {isSubscribed ? (
                      <>
                        <span className="material-symbols-outlined">
                          notifications
                        </span>
                        追蹤中
                      </>
                    ) : (
                      <>追蹤</>
                    )}
                  </a>
                )}
              </div>
              <div className="d-flex align-items-center gap-4">
                {isAuthorized && <SponsorModal />}
                <a
                  href="#"
                  className={`btn ${
                    isFavorite
                      ? "btn-primary btn-click"
                      : "btn-outline-primary border border-primary-hover btn-click"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    isAuthorized
                      ? postFavorites()
                      : Swal.fire(alertMsgForVerify);
                  }}
                >
                  {isFavorite ? "已收藏" : "收藏"}
                </a>
                <a
                  className={`user-select-none pe-open d-flex align-items-center gap-1 btn-click ${
                    isLike ? "text-primary" : "text-gray"
                  } `}
                  onClick={() =>
                    isAuthorized
                      ? postArticleLike()
                      : Swal.fire(alertMsgForVerify)
                  }
                >
                  <span className="material-symbols-outlined icon-fill">
                    favorite
                  </span>
                  {articleData?.likes_count}
                </a>
                <span className="text-gray">
                  {articleData?.created_at !== undefined &&
                    `發佈於 ${new Date(
                      articleData?.created_at
                    ).toLocaleDateString()}`}
                </span>
              </div>
            </div>
          </div>
        </div>
        <img
          src={
            articleData?.image_url ||
            "https://github.com/wfox5510/wordSapce-imgRepo/blob/main/banner-1.png?raw=true"
          }
          className="w-100 object-fit-cover article-banner"
          alt="banner"
        />
      </header>
      <section>
        <div className="container">
          {/* DOMParserReact套件用來渲染文章內容，避免XSS攻擊 */}
          <div className="article-wrap d-flex flex-column gap-2 border-bottom pt-5 pt-lg-10 pb-10 pb-lg-15">
            <DOMParserReact source={articleData?.content} />
          </div>
        </div>
      </section>
      <section>
        <div className="container py-10 py-lg-15 border-bottom">
          <h3 className="fs-5 fs-lg-3 text-primary fw-bold mb-5">
            快來分享你的想法
          </h3>
          {commentData?.map((commentItem) => {
            return (
              <CommentBox
                key={commentItem.id}
                loginUserId={userId}
                commentData={commentItem}
                articleId={articleId}
                getComment={getComment}
                formatTimeAgo={formatTimeAgo}
                isAuthorized={isAuthorized}
                isAuther={commentItem.user_id === articleData?.user_id}
                isCurrentUser={commentItem.user_id === userId}
                hasReplie={commentItem.replies.some(
                  (repliesItem) => repliesItem.user_id === userId
                )}
              >
                {commentItem.replies.map((replieItem) => {
                  return (
                    <CommentReply
                      key={replieItem.id}
                      loginUserId={userId}
                      commentData={replieItem}
                      isAuthorized={isAuthorized}
                      getComment={getComment}
                      formatTimeAgo={formatTimeAgo}
                      isAuther={replieItem.user_id === articleData?.user_id}
                      isCurrentUser={replieItem.user_id === userId}
                    />
                  );
                })}
              </CommentBox>
            );
          })}
          <form
            className={`${!isAuthorized && "d-none"}`}
            onSubmit={(e) => {
              e.preventDefault();
              isAuthorized ? postComment() : Swal.fire(alertMsgForVerify);
            }}
          >
            <label className="d-none" htmlFor="comment">
              留言
            </label>
            <textarea
              name="comment"
              id="comment"
              className="form-control mb-5"
              style={{ resize: "none", height: "120px" }}
              placeholder="我想說......"
              value={commentInput}
              onChange={(e) => {
                setCommentInput(e.target.value);
              }}
            ></textarea>
            <button
              type="submit"
              className="btn btn-lg btn-primary lh-sm fw-bold ls-0 btn-click rounded-2"
            >
              送出
            </button>
          </form>
        </div>
      </section>
      <section>
        <div className="container py-10 py-lg-15">
          <h3 className="fs-5 fs-lg-3 text-primary fw-bold mb-5">相關文章</h3>
          {/* 因應API功能調整，暫時不使用tag選擇文章 */}
          {/* <nav className="related-articles nav mb-5 gap-5">
            <a className="nav-link p-0 active" aria-current="page" href="#">
              數位時代
            </a>
            <a className="nav-link p-0" href="#">
              AI生成
            </a>
            <a className="nav-link p-0" href="#">
              未來創作
            </a>
          </nav> */}
          <div className="d-none d-md-flex row row-cols-2 row-cols-xl-4 g-lg-6 g-3 mb-10">
            {allArticleData
              .filter(
                (allArticleDataItem) =>
                  allArticleDataItem.id !== articleData?.id
              )
              .filter(
                (allArticleDataItem) =>
                  allArticleDataItem.category_name ===
                  articleData?.category_name
              )
              .slice(0, 4)
              .map((allArticleDataItem) => {
                return (
                  <div className="col" key={allArticleDataItem.id}>
                    <ArticleCard articleData={allArticleDataItem} />
                  </div>
                );
              })}
          </div>
          <div className="d-block d-md-none">
            <Swiper
              style={{
                "--swiper-pagination-color": "#E77605",
                "--swiper-pagination-bullet-inactive-color": "#EAEAEA",
                "--swiper-pagination-bullet-inactive-opacity": "1",
                margin: "-12px",
                padding: "12px",
              }}
              className="pb-11"
              modules={[Pagination, Navigation]}
              pagination={{
                clickable: true,
                bulletClass:
                  "swiper-pagination-bullet swiper-pagination-bullet-mx-6",
              }}
              spaceBetween={"24px"}
            >
              {allArticleData
                .filter(
                  (allArticleDataItem) =>
                    allArticleDataItem.id !== articleData?.id
                )
                .filter(
                  (allArticleDataItem) =>
                    allArticleDataItem.category_name ===
                    articleData?.category_name
                )
                .slice(0, 4)
                .map((allArticleDataItem) => {
                  return (
                    <SwiperSlide key={allArticleDataItem.id}>
                      <ArticleCard articleData={allArticleDataItem} />
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
};

export default ArticlePage;
