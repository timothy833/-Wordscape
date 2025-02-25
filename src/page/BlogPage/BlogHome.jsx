import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faPodcast, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";


import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/scss/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import blogBanner_1 from "../../assets/images/BlogBanner/blog-banner_1.jpg";
import blogBanner_2 from "../../assets/images/BlogBanner/blog-banner_2.jpg";
import blogBanner_3 from "../../assets/images/BlogBanner/blog-banner_3.jpg";
import blogBannerSm_1 from "../../assets/images/BlogBanner/blog-banner-sm_1.jpg";
import blogBannerSm_2 from "../../assets/images/BlogBanner/blog-banner-sm_2.jpg";
import blogBannerSm_3 from "../../assets/images/BlogBanner/blog-banner-sm_3.jpg";
import blogBannerMain from "../../assets/images/BlogBanner/blog-banner_main.jpg";
import avatar from "../../assets/images/avatar-1.png";

const BlogHome = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="bg-secondary py-10">
        <div className="container">
          <div className="row flex-md-row-reverse">
            <div className="col-xl-3 col-md-4 mb-5">
              <div className="blog-home_header d-flex flex-column align-items-center py-10 px-5 rounded-3 border border-gray_light" style={{ backgroundColor: "#FDFBF5" }}>
                <img className="admin-avatar mb-2" src={avatar} alt="avatar" />
                <p className="mb-5">super123</p>
                <ul className="list-unstyled d-flex gap-5 gap-md-3 gap-lg-5 mb-5">
                  <li><FontAwesomeIcon icon={faEnvelope} size="lg" style={{ color: "#e77605", }} /></li>
                  <li><FontAwesomeIcon icon={faPodcast} size="lg" style={{ color: "#e77605", }} /></li>
                  <li><FontAwesomeIcon icon={faUserGroup} size="lg" style={{ color: "#e77605", }} /></li>
                  <li><FontAwesomeIcon icon={faFacebookF} size="lg" style={{ color: "#e77605", }} /></li>
                  <li><FontAwesomeIcon icon={faInstagram} size="lg" style={{ color: "#e77605", }} /></li>
                  <li><FontAwesomeIcon icon={faYoutube} size="lg" style={{ color: "#e77605", }} /></li>
                </ul>
                <p className="text-gray pb-5 border-bottom border-gray">一位熱愛探索世界的旅行愛好者，喜歡用文字與照片記錄每一次的冒險旅程。<br />
                  無論是壯麗的自然景觀、隱藏的城市角落，還是地道的美食文化，都會在這裡與你分享。</p>
                <h4 className="text-primary my-5">文章導航區</h4>
                <ul className="blog-home_nav list-unstyled align-self-baseline d-flex flex-column gap-5">
                  <li className="text-gray">1.旅遊</li>
                  <li className="text-gray">1-1.日本秘境深度攻略分享</li>
                  <li className="text-gray">1-2.當愛上東歐時</li>
                  <li className="text-gray">1-3. 白日夢冒險王冰島巡禮</li>
                </ul>
              </div>
            </div>
            <div className="col-xl-9 col-md-8">
              <section className="blog-home_mainBanner py-10 ps-lg-10  rounded-3 mb-5" style={{ backgroundImage: `url(${blogBannerMain})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="d-flex flex-column align-items-center align-items-lg-start">
                  <h2 className="fs-5 fs-md-3 text-light mb-5" style={{ zIndex: "99" }}>Timo奇幻旅程書房</h2>
                  <h4 className="mb-5 text-light" style={{ zIndex: "99" }}>旅遊x學習 手札</h4>
                  <button type="button" className="btn btn-primary btn-lg" style={{ zIndex: "99" }}>編輯</button>
                </div>
              </section>
              <section className="position-relative mb-5">
                <Swiper className="blog_swiper rounded-3"
                  style={{
                    "--swiper-pagination-color": "#e77605",
                    "--swiper-pagination-bullet-inactive-color": "#eaeaea",
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
                      <picture className="banner-img-container w-100">
                        <source media="(min-width:768px)" srcSet={blogBanner_1} />
                        <img
                          src={blogBannerSm_1}
                          className="w-100 object-fit-cover"
                          alt="banner-img"
                        />
                      </picture>
                      <div className="blog-banner_content text-light">
                        <h2 className="fw-bold fs-5 fs-md-4 mb-8 mb-md-12 ms-md-5">
                          漫遊歐洲之旅實戰分享線下講座
                        </h2>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="position-relative">
                      <picture className="banner-img-container w-100">
                        <source media="(min-width:768px)" srcSet={blogBanner_2} />
                        <img
                          src={blogBannerSm_2}
                          className="w-100 object-fit-cover"
                          alt="banner-img"
                        />
                      </picture>
                      <div className="blog-banner_content text-light">
                        <h2 className="fw-bold fs-5 fs-md-4 mb-8 mb-md-12 ms-md-5">
                          持續學習四種心法
                        </h2>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="position-relative">
                      <picture className="banner-img-container w-100">
                        <source media="(min-width:768px)" srcSet={blogBanner_3} />
                        <img
                          src={blogBannerSm_3}
                          className="w-100 object-fit-cover"
                          alt="banner-img"
                        />
                      </picture>
                      <div className="blog-banner_content text-light">
                        <h2 className="fw-bold fs-5 fs-md-4 mb-8 mb-md-12 ms-md-5">
                          日本秘境深度攻略分享
                        </h2>
                      </div>
                    </div>
                  </SwiperSlide>
                  <div className="blog-swiper-pagination d-none d-lg-flex gap-7">
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
              <h1>文章列表</h1>
            </div>
          </div>
        </div>
      </main>




      <Footer />
    </>
  );
};

export default BlogHome;