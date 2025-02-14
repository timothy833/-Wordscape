import Navbar from "../../component/Navbar/Navbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import ArticleCard from "../../component/ArticleCard/ArticleCard";
import CommentBox from "../../component/CommentBox/CommentBox";
import CommentReply from "../../component/CommentReply/CommentReply";
import Footer from "../../component/Footer/Footer";
const ArticlePage = () => {
  return (
    <>
      <Navbar />
      <section>
        <div className="container py-15 border-bottom">
          <h3 className="fs-3 text-primary fw-bold mb-5">快來分享你的想法</h3>
          <CommentBox>
            <CommentReply />
            <CommentReply />
            <CommentReply />
          </CommentBox>
          <CommentBox>
            <CommentReply />
            <CommentReply />
          </CommentBox>
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
            <button type="submit" class="btn btn-lg btn-primary">
              送出
            </button>
          </form>
        </div>
      </section>
      <section>
        <div className="container py-15">
          <h3 className="fs-3 text-primary fw-bold mb-5">相關文章</h3>
          <nav class="related-articles nav mb-5 gap-5">
            <a class="nav-link p-0 active" aria-current="page" href="#">
              數位時代
            </a>
            <a class="nav-link p-0" href="#">
              AI生成
            </a>
            <a class="nav-link p-0" href="#">
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
              className="mb-6 pb-11"
              modules={[Pagination, Navigation]}
              pagination={{
                clickable: true,
                bulletClass:
                  "swiper-pagination-bullet swiper-pagination-bullet-mx-6",
              }}
              loop={true}
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
