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
  const { id } = useParams();
  const [articleData, setArticleData] = useState(null);
  const [commentData, setCommentData] = useState(null);
  const getArticle = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/${id}`);
      setArticleData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getComment = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/comments/${id}`);
      setCommentData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getArticle();
    getComment();
  }, []);
  useEffect(() => {
    console.log(articleData);
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
                <a className="text-gray" href="#">
                  追蹤
                </a>
              </div>
              <div className="d-flex align-items-center gap-5">
                <span className=" d-flex align-items-center gap-1 text-primary ">
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
            articleData?.imageUrl === undefined
              ? "https://github.com/wfox5510/wordSapce-imgRepo/blob/main/banner-1.png?raw=true"
              : articleData?.imageUrl
          }
          className="w-100 object-fit-cover article-banner"
          alt="banner"
        />
      </header>
      <section>
        <div className="container">
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
              <CommentBox content={commentItem.content}>
                {commentItem.replies.map((replieItem) => {
                  return <CommentReply content={replieItem.content} />;
                })}
              </CommentBox>
            );
          })}
          <form>
            <label className="d-none" htmlFor="comment">
              留言
            </label>
            <textarea
              name="comment"
              id="comment"
              className="form-control mb-5"
              style={{ resize: "none", height: "120px" }}
              placeholder="我想說......"
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
