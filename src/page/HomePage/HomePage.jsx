import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation,Autoplay} from "swiper/modules";
import "swiper/scss/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import Header from "../../component/Header/Header";
import Footer from "../../component/Footer/Footer";
import banner_1 from "../../assets/images/banner/banner-1.png";
import banner_2 from "../../assets/images/banner/banner-2.png";
import banner_3 from "../../assets/images/banner/banner-3.png";
import banner_1_sm from "../../assets/images/banner/banner-1-sm.png";
import banner_2_sm from "../../assets/images/banner/banner-2-sm.png";
import banner_3_sm from "../../assets/images/banner/banner-3-sm.png";
const HomePage = () => {
  return (
    <>
      <Header />
      <section className="position-relative">
        <Swiper
          style={{
            "--swiper-pagination-color": "#FFFDFB",
            "--swiper-pagination-bullet-inactive-color": "#838383",
          }}
          modules={[Pagination, Navigation ,Autoplay]}
          navigation={{ nextEl: ".swiperNextEl", prevEl: ".swiperPrebEl" }}
          pagination={{ clickable: true }}
          autoplay={{delay:5000}}
          loop={true}
        >
          <SwiperSlide>
            <div className="position-relative">
              <picture>
                <source media="(min-width:768px)" srcSet={banner_1} />
                <img
                  src={banner_1_sm}
                  className="w-100 object-fit-cover"
                  alt="banner-img"
                />
              </picture>
              <div className="banner-content text-light">
                <h2 className="fw-bold fs-4 fs-lg-1 ls-1">
                  簡潔且專注的閱讀體驗
                </h2>
                <p className="fw-bold fs-7">
                  避免了廣告和繁雜的介面干擾，讓讀者能專注於內容本身，提供流暢的閱讀體驗。
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="position-relative">
              <picture>
                <source media="(min-width:768px)" srcSet={banner_2} />
                <img
                  src={banner_2_sm}
                  className="w-100 object-fit-cover"
                  alt="banner-img"
                />
              </picture>
              <div className="banner-content text-light">
                <h2 className="fw-bold fs-4 fs-lg-1 ls-1">
                  多元且高品質的內容
                </h2>
                <p className="fw-bold fs-7">
                  吸引了來自全球的創作者，涵蓋技術、設計、心理學、創業等多元主題。透過訂閱與演算法推薦，使用者可以輕鬆找到符合自己興趣的優質文章。
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="position-relative">
              <picture>
                <source media="(min-width:768px)" srcSet={banner_3} />
                <img
                  src={banner_3_sm}
                  className="w-100 object-fit-cover"
                  alt="banner-img"
                />
              </picture>
              <div className="banner-content text-light">
                <h2 className="fw-bold fs-4 fs-lg-1 ls-1">
                  創作者友善的收入模式
                </h2>
                <p className="fw-bold fs-7">
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
      
      <Footer />
    </>
  );
};

export default HomePage;
