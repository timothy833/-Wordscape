import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import ArticleCard from "../../component/ArticleCard/ArticleCard";
import CommentBox from "../../component/CommentBox/CommentBox";
import CommentReply from "../../component/CommentReply/CommentReply";
import Footer from "../../component/Footer/Footer";
import Navbar from "../../component/Navbar/Navbar";
import avatar from "../../assets/images/avatar-1.png";
import banner from "../../assets/images/ArticlePage/banner-1.png";
import articleImg1 from "../../assets/images/ArticlePage/article-img-1.png";
const ArticlePage = () => {
  return (
    <>
      <header>
        <div className="container">
          <Navbar />
          <div className="pt-10 pt-lg-15 pb-5 pb-lg-10 z-3">
            <div className="d-flex gap-2 mb-5">
              <a
                className="badge rounded-pill bg-primary-hover lh-base"
                href="#"
              >
                #數位時代
              </a>
              <a
                className="badge rounded-pill bg-primary-hover lh-base"
                href="#"
              >
                #AI生成
              </a>
              <a
                className="badge rounded-pill bg-primary-hover lh-base"
                href="#"
              >
                #數位共生
              </a>
            </div>
            <h1 className="text-primary fs-4 fs-lg-1 fw-bold mb-5">
              2024：數位世界裡的真實感，虛實交錯的我們
            </h1>
            <div className="d-flex gap-5 flex-column flex-lg-row">
              <div className="d-flex align-items-center gap-5">
                <div className="d-flex align-items-center">
                  <img className="avatar me-2" src={avatar} alt="avatar" />
                  <span>宋書遠</span>
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
                  143
                </span>
                <span className="text-gray">發佈於 2024/11/22</span>
              </div>
            </div>
          </div>
        </div>
        <img
          src={banner}
          className="w-100 object-fit-cover article-banner"
          alt="banner"
        />
      </header>
      <section>
        <div className="container d-flex flex-column gap-5 gap-lg-7 border-bottom pt-5 pt-lg-10 pb-10 pb-lg-15">
          <h2 className="fw-bold fs-5 fs-lg-3">回望今年的熱潮</h2>
          <p>
            在2024年，「AI生成內容」這個詞不再只是技術愛好者的專屬，而成為日常生活中不可忽略的一部分。從生成圖片、文本到深度學習技術的應用，我們看見許多人不斷嘗試用科技重塑創作的可能。然而，在這片技術浪潮中，一個有趣的現象正在悄然浮現：我們開始更熱衷於追求真實感。
          </p>
          <h2 className="fw-bold fs-5 fs-lg-3">虛擬與真實的邊界</h2>
          <p>
            今年，許多平台如 Meta 和
            Apple推出了更高階的虛擬現實設備，希望讓我們在數位世界中體驗前所未有的沉浸感。然而，一個意外的趨勢卻引起討論：越來越多的用戶開始使用這些工具來模擬過去的「真實生活場景」，如手工製作、復古寫作甚至田園生活的虛擬版。
            <br />
            這種虛擬復古的風潮，似乎折射出我們對真實感的集體渴望。在一個虛實交錯的時代，我們不僅希望科技能方便生活，更期待它能幫助我們找到「遺失的真實」。
          </p>
          <img src={articleImg1} className="w-100" alt="articleImg" />
          <h2 className="fw-bold fs-5 fs-lg-3">生成內容與人性情感的碰撞</h2>
          <p>
            AI生成文章、藝術品和音樂的能力越來越強，但同時我們也看到一股回歸人性化的潮流。今年流行的一句話是：「技術能生成內容，但情感無法生成。」
            這使得擁有獨特情感觸感的創作變得更加珍貴。
            <br />
            像是近期Netflix推出的一部紀錄片《代碼與心》，探討了人類如何與技術共舞，同時警惕我們在技術快速發展中不要忘記原初的創作動機——那份人性深處的觸動
          </p>
          <h2 className="fw-bold fs-5 fs-lg-3">科技與我們的共生未來</h2>
          <p>
            我們正處在一個微妙的轉折點：科技讓我們更自由地表達，卻也讓我們重新思考何謂「真實」。也許答案並不在於對科技的全然擁抱或拒絕，而在於我們如何找到平衡，讓數位與真實世界能夠相互滋養。
            <br />
            比如，你是否可以用虛擬技術重新構建一次難忘的旅行體驗？或者利用AI生成的靈感，進一步深化自己的創作？這是一場我們與技術之間的共生旅程，而我們每個人都有機會成為這場旅程中的創作者。
          </p>
          <h2 className="fw-bold fs-5 fs-lg-3">浮生中的選擇</h2>
          <p>
            在科技不斷進化的浪潮中，真實感或許是一種選擇，而非結果。我們不妨利用這些工具，重拾生活中的細微感動，將「墨影浮生」的意境融入我們的日常。這場虛實交錯的冒險，或許正是未來最值得期待的風景。
          </p>
        </div>
      </section>
      <section>
        <div className="container py-10 py-lg-15 border-bottom">
          <h3 className="fs-5 fs-lg-3 text-primary fw-bold mb-5">
            快來分享你的想法
          </h3>
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
            <button type="submit" class="btn btn-lg btn-primary lh-sm fw-bold ls-0">
              送出
            </button>
          </form>
        </div>
      </section>
      <section>
        <div className="container py-10 py-lg-15">
          <h3 className="fs-5 fs-lg-3 text-primary fw-bold mb-5">相關文章</h3>
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
              className="pb-11"
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
