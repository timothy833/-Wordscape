import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import ArticleCard from "../../component/ArticleCard/ArticleCard";
import CommentBox from "../../component/CommentBox/CommentBox";
import CommentReply from "../../component/CommentReply/CommentReply";
import Footer from "../../component/Footer/Footer";
import Navbar from "../../component/Navbar/Navbar";
import avatar from "../../assets/images/avatar-1.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DOMParserReact from "dom-parser-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ArticlePage = () => {
  const { id: articleId } = useParams();
  const userId = "2cd3fbcd-b840-4029-846e-8dfd6f97e4a5";
  const [articleData, setArticleData] = useState(null);
  const [commentData, setCommentData] = useState(null);
  const [isLike, setIsLike] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [currentEdit,setCurrentEdit] =  useState(null);
  axios.defaults.headers.common["Authorization"] =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJjZDNmYmNkLWI4NDAtNDAyOS04NDZlLThkZmQ2Zjk3ZTRhNSIsInVzZXJuYW1lIjoiaGFwcHlQaWdneSIsImlhdCI6MTc0MTA5NTk1MywiZXhwIjoxNzQxMDk5NTUzfQ.zQSRLGFgH-eueYkThAhgyv9euHp3ZCkdikZT7UwyYIE";
  const getArticle = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/${articleId}`);
      setArticleData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  //留言相關功能
  const getComment = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/comments/${articleId}`);
      setCommentData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const postComment = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/comments`, {
        post_id: articleId,
        content: commentInput,
      });
      setCommentInput("");
      getComment();
    } catch (error) {
      console.log(error);
    }
  };
  //訂閱相關功能
  const checkIsSubscribed = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/subscriptions`);
      setIsSubscribed(
        res.data.data.some(
          (subscribedData) => subscribedData.user_id === articleData?.user_id
        )
      );
    } catch (error) {
      console.log(error);
    }
  };
  const postSubscribed = async () => {
    try {
      await axios.post(`${API_BASE_URL}/subscriptions/${articleData.user_id}`);
      checkIsSubscribed();
    } catch (error) {
      console.log(error);
    }
  };
  //點讚相關功能
  const checkIsLikeArticle = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/posts/post_likes/${articleId}`
      );
      setIsLike(res.data.data.some((likeData) => likeData.id === userId));
    } catch (error) {
      console.log(error);
    }
  };
  const postArticleLike = async () => {
    try {
      //可以加入動畫增加使用體驗，次要
      const res = await axios.post(
        `${API_BASE_URL}/posts/post_likes/${articleId}`
      );
      getArticle(); //為了取得讚數在進行一次get文章資料，是否可以進行優化
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getArticle();
    getComment();
    checkIsLikeArticle();
  }, []);
  //判斷訂閱需要取得articleData中作者的資料，用useEffect確保setState的值正確取得
  useEffect(() => {
    checkIsSubscribed();
  }, [articleData]);
  return (
    <>
      <header>
        <div className="container">
          <Navbar />
          <div className="pt-10 pt-lg-15 pb-5 pb-lg-10 z-3">
            <div className="d-flex gap-2 mb-5">
              {articleData?.tags.map((tagItem) => {
                return (
                  <a
                    className="badge rounded-pill bg-primary-hover lh-base"
                    href="#"
                    key={tagItem.id}
                  >
                    #{tagItem.name}
                  </a>
                );
              })}
            </div>
            <h1 className="text-primary fs-4 fs-lg-1 fw-bold mb-5">
              {articleData?.title}
            </h1>
            <div className="d-flex gap-5 flex-column flex-lg-row">
              <div className="d-flex align-items-center gap-5">
                <div className="d-flex align-items-center">
                  <img className="avatar me-2" src={avatar} alt="avatar" />
                  <span>{articleData?.author_name}</span>
                </div>
                {/* 當目前user為作者時，不顯示追蹤按鈕 */}
                {userId !== articleData?.user_id && (
                  <a
                    className={`${
                      isSubscribed ? "text-primary" : "text-gray"
                    } d-flex align-items-center`}
                    onClick={(e) => {
                      e.preventDefault();
                      postSubscribed();
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
              <div className="d-flex align-items-center gap-5">
                <span
                  className={` d-flex align-items-center gap-1 ${
                    isLike ? "text-primary" : "text-gray"
                  } `}
                  onClick={() => postArticleLike()}
                >
                  <span className="material-symbols-outlined icon-fill">
                    favorite
                  </span>
                  {articleData?.likes_count}
                </span>
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
            articleData?.image_url
              ? articleData?.image_url
              : "https://github.com/wfox5510/wordSapce-imgRepo/blob/main/banner-1.png?raw=true"
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
                content={commentItem.content}
                comment_id={commentItem.id}
                articleId={articleId}
                getComment={getComment}
                replie_count={commentItem.replies.length}
                user_id={commentItem.user_id}
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
                      content={replieItem.content}
                      user_id={replieItem.user_id}
                      comment_id = {replieItem.id}
                      getComment={getComment}
                      isAuther={replieItem.user_id === articleData?.user_id}
                      isCurrentUser={replieItem.user_id === userId}
                    />
                  );
                })}
              </CommentBox>
            );
          })}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              postComment();
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
              className="btn btn-lg btn-primary lh-sm fw-bold ls-0"
            >
              送出
            </button>
          </form>
        </div>
      </section>
      <section>
        <div className="container py-10 py-lg-15">
          <h3 className="fs-5 fs-lg-3 text-primary fw-bold mb-5">相關文章</h3>
          <nav className="related-articles nav mb-5 gap-5">
            <a className="nav-link p-0 active" aria-current="page" href="#">
              數位時代
            </a>
            <a className="nav-link p-0" href="#">
              AI生成
            </a>
            <a className="nav-link p-0" href="#">
              未來創作
            </a>
          </nav>
          <div className="d-none d-md-flex row row-cols-2 row-cols-xl-4 g-lg-6 g-3 mb-10">
            <div className="col">
              <ArticleCard />
            </div>
            <div className="col">
              <ArticleCard />
            </div>
            <div className="col">
              <ArticleCard />
            </div>
            <div className="col">
              <ArticleCard />
            </div>
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
              <SwiperSlide>
                <ArticleCard />
              </SwiperSlide>
              <SwiperSlide>
                <ArticleCard />
              </SwiperSlide>
              <SwiperSlide>
                <ArticleCard />
              </SwiperSlide>
              <SwiperSlide>
                <ArticleCard />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ArticlePage;
