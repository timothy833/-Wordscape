import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import Marquee from "react-fast-marquee";
import "swiper/scss/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import ReviewCard from "../../component/ReviewCard/ReviewCard";
import ArticleCard from "../../component/ArticleCard/ArticleCard";
import banner_1 from "../../assets/images/banner/banner-1.png";
import banner_2 from "../../assets/images/banner/banner-2.png";
import banner_3 from "../../assets/images/banner/banner-3.png";
import banner_1_sm from "../../assets/images/banner/banner-1-sm.png";
import banner_2_sm from "../../assets/images/banner/banner-2-sm.png";
import banner_3_sm from "../../assets/images/banner/banner-3-sm.png";
import avatar from "../../assets/images/avatar-1.png";
import about_us from "../../assets/images/about-us.png";
const HomePage = () => {
  return (
    <>
      <header>
        <Navbar />
        <section className="position-relative">
          <Swiper
            style={{
              "--swiper-pagination-color": "#FFFDFB",
              "--swiper-pagination-bullet-inactive-color": "#838383",
              "--swiper-pagination-bullet-inactive-opacity": "1",
            }}
            modules={[Pagination, Navigation, Autoplay]}
            navigation={{ nextEl: ".swiperNextEl", prevEl: ".swiperPrebEl" }}
            pagination={{
              clickable: true,
              bulletClass:
                "swiper-pagination-bullet swiper-pagination-bullet-mx-6",
            }}
            autoplay={{ delay: 5000 }}
            loop={true}
          >
            <SwiperSlide>
              <div className="position-relative">
                <picture className="banner-img-container">
                  <source media="(min-width:768px)" srcSet={banner_1} />
                  <img
                    src={banner_1_sm}
                    className="w-100 object-fit-cover"
                    alt="banner-img"
                  />
                </picture>
                <div className="banner-content text-light">
                  <h2 className="fw-bold fs-4 fs-lg-2 ls-1 mb-3">
                    簡潔且專注的閱讀體驗
                  </h2>
                  <p className="fs-7 lh-base mb-3">
                    避免了廣告和繁雜的介面干擾，讓讀者能專注於內容本身，提供流暢的閱讀體驗。
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="position-relative">
                <picture className="banner-img-container">
                  <source media="(min-width:768px)" srcSet={banner_2} />
                  <img
                    src={banner_2_sm}
                    className="w-100 object-fit-cover"
                    alt="banner-img"
                  />
                </picture>
                <div className="banner-content text-light">
                  <h2 className="fw-bold fs-4 fs-lg-2 ls-1 mb-3">
                    多元且高品質的內容
                  </h2>
                  <p className="fs-7 lh-base">
                    吸引了來自全球的創作者，涵蓋技術、設計、心理學、創業等多元主題。透過訂閱與演算法推薦，使用者可以輕鬆找到符合自己興趣的優質文章。
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="position-relative">
                <picture className="banner-img-container">
                  <source media="(min-width:768px)" srcSet={banner_3} />
                  <img
                    src={banner_3_sm}
                    className="w-100 object-fit-cover"
                    alt="banner-img"
                  />
                </picture>
                <div className="banner-content text-light">
                  <h2 className="fw-bold fs-4 fs-lg-2 ls-1 mb-3">
                    創作者友善的收入模式
                  </h2>
                  <p className="fs-7 lh-base mb-3">
                    簡單的創作工具和會員機制，讓創作者可以透過文章的閱讀時間和會員訂閱獲得收入，激勵優質內容的持續產出。
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <div className="swiper-pagination d-none d-lg-flex gap-7">
              <a className="swiperPrebEl bg-light rounded-pill d-block d-flex align-items-center justify-content-center">
                <span className="material-symbols-outlined text-primary ms-2">
                  arrow_back_ios
                </span>
              </a>
              <a className="swiperNextEl bg-light rounded-pill d-block d-flex align-items-center justify-content-center">
                <span className="material-symbols-outlined text-primary">
                  arrow_forward_ios
                </span>
              </a>
            </div>
          </Swiper>
        </section>
      </header>
      <section className="homepage-section bg-secondary">
        <div className="container mb-lg-8">
          <h2 className="fw-bold fs-5 fs-lg-3 text-primary">好評推薦</h2>
          <span className="fs-7 fw-bold">快來看看大家怎麼說！</span>
          <div className="d-block d-lg-none d-flex flex-column align-items-center mt-10 gap-5">
            {Array.from({ length: 3 }).map((item, index) => {
              return (
                <ReviewCard
                  reviewStar={(index % 3) + 2}
                  avatar={avatar}
                  width="100%"
                  key={index}
                />
              );
            })}
            <button
              type="button"
              className="btn btn-lg btn-primary fw-bold lh-sm"
            >
              載入更多
            </button>
          </div>
        </div>
        <div className="d-none d-lg-block">
          <Marquee className="reviewMarquee py-3 mb-2" speed={30}>
            {Array.from({ length: 10 }).map((item, index) => {
              return (
                <ReviewCard
                  reviewStar={(index % 3) + 2}
                  avatar={avatar}
                  width="306px"
                  key={index}
                />
              );
            })}
          </Marquee>
          <Marquee
            className="reviewMarquee py-3"
            speed={35}
            direction={"right"}
          >
            {Array.from({ length: 10 }).map((item, index) => {
              return (
                <ReviewCard
                  reviewStar={(index % 3) + 2}
                  avatar={avatar}
                  width="306px"
                  key={index}
                />
              );
            })}
          </Marquee>
        </div>
      </section>
      <section className="homepage-section">
        <div className="container mb-lg-8 d-flex flex-column">
          <h2 className="fw-bold fs-5 fs-lg-3 text-primary">推薦好文</h2>
          <span className="d-block fs-7 fw-bold mb-10">
            精選文章，趕快來發掘！
          </span>
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
          <button
            type="button"
            className="btn btn-lg btn-primary lh-sm mx-auto hover-shadow"
          >
            點我看更多
          </button>
        </div>
      </section>
      <section className="homepage-section bg-secondary">
        <div className="container">
          <div className="d-flex align-items-center flex-column flex-lg-row gap-5 gap-lg-6">
            <div className="w-lg-50">
              <h2 className="text-primary fw-bold mb-5 mb-lg-10 fs-5 fs-lg-3">
                關於我們
              </h2>
              <p className="mb-3">
                我們是一個充滿熱情與創意的團隊
                <br />
                致力於透過有價值的内容啟發每一位訪客
              </p>
              <p className="mb-3">
                我們的目標是為你帶來多元化的觀點
                <br />
                無論是生活靈感、個人成長、還是最新的趨勢資訊，
                <br className="d-none d-lg-block" />
                都能在這裡找到適合你的閱讀體驗
              </p>
              <p className="mb-3">
                我們相信，每一篇文章都是一扇窗，帶領你探索未知的世界，激發無限可能。
              </p>
              <p>
                加入我們的旅程，讓知識興靈感成為你生活的一部分，共同創造一个更美好的未来!
              </p>
            </div>
            <div className="w-lg-50">
              <img src={about_us} className="img-fluid" alt="logo" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default HomePage;
