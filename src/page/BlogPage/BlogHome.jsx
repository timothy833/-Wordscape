import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faPodcast, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

import Blog_ArticleCard from "../../component/BlogPageArticleCard/Blog_ArticleCard";
// import Blog_CommentReply from "../../component/BlogPageCommentReply/Blog_CommentReply";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay, Keyboard } from "swiper/modules";
import "swiper/scss/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// import blogBanner_1 from "../../assets/images/BlogBanner/blog-banner_1.jpg";
// import blogBanner_2 from "../../assets/images/BlogBanner/blog-banner_2.jpg";
// import blogBanner_3 from "../../assets/images/BlogBanner/blog-banner_3.jpg";
// import blogBannerSm_1 from "../../assets/images/BlogBanner/blog-banner-sm_1.jpg";
// import blogBannerSm_2 from "../../assets/images/BlogBanner/blog-banner-sm_2.jpg";
// import blogBannerSm_3 from "../../assets/images/BlogBanner/blog-banner-sm_3.jpg";
// import blogBannerMain from "../../assets/images/BlogBanner/blog-banner_main.jpg";
// import avatar from "../../assets/images/avatar-1.png";

//React方法引用
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef} from "react";

//引入Modal方法
import { Modal } from "bootstrap";
//處理發布文章modal
import NewPostModal from "../BlogPage/CreatePostModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getCookie = (name) => {
  return document.cookie
      .split("; ")
      .find(row => row.startsWith(name + "="))
      ?.split("=")[1] || "";
};

const BlogHome = () => {
  const { user_id } = useParams(); // URL 參數中的 Blog 擁有者 ID
  const [token, setToken] = useState("");  
  const [banner, setBanner] = useState(null); //儲存回傳banner的資訊
  const [userId, setUerId] = useState(""); //存放傳進來或登入者userId
  const [isAuthor, setIsAuthor] = useState(false); //確認是否為Blog擁有者
  const [title, setTitle] = useState("") //設定傳送Blog Banner標題
  const [subtitle, setSubtitle] = useState("") //設定傳送Blog Banner副標
  const [imageUrl, setImageUrl] = useState(""); //設定傳送Banner圖源
  const [imagePreview, setImagePreview] = useState("") //設定預覽圖片
  const modalBannerRef = useRef(null); //綁定modal div的容器
  let modalInstanceRef = useRef(null); // 存 `Modal` 實體
  const modalTriggerRef = useRef(null); // 綁定觸發 modal 的按鈕
  const [articles, setArticles] = useState([]); //處理文章列表資料
  const [blogUser, setBlogUser] = useState({}); //存放blog使用者資料
  const [comments, setComments] = useState({}); //處理文章留言資料 初始化 comments 應該是 {}
  const [pinnerArticles, setPinnedArticles] = useState([]); //切換置頂文章排序狀態
  // const [articleLikes, setArticleLikes] = useState({}); //處理文章按讚

  // 處理文章按讚
  const likePost = async (postId) => {
    await axios.post(`${API_BASE_URL}/posts/post_likes/${postId}`,{}, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })

    getBlogArticle(); 
  };

  

  // 切換釘選狀態
  const togglePin = (articleId) => {
    setPinnedArticles((prevPinned)=>
      prevPinned.includes(articleId)
        ? prevPinned.filter((id)=> id !== articleId) //取消釘選
        : [...prevPinned, articleId] //釘選
    );
  };

  // 排序文章列表，釘選的文章排在最前面
  const sortedArticles = [...articles].sort((a, b)=>{
    const isPinnedA = pinnerArticles.includes(a.id);
    const isPinnedB = pinnerArticles.includes(b.id);
    return isPinnedB - isPinnedA; // 釘選的文章排在最前面
  })



  //初始化比對userId是否是登入id
  useEffect(()=>{
 
   
    if(user_id === userId) {
      setIsAuthor(true);
    }
  
  }, [userId]);

  






  //加載blog擁有者文章api
  const getBlogArticle = async ()=>{
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/user/${user_id}`);
      console.log(res.data);
      setArticles(res.data.data);
      
    } catch (error) {
      console.error("取得blog文章列表失敗", error);
    }
  }

  //處理文章列表api 在元件載入時讀取token
  useEffect(()=>{
    const storedToken = getCookie("WS_token");
    setToken(storedToken);
    setUerId("dc576098-dc26-46a4-aede-6bc5c8f300ea")
    const fetchArticle = async()=>{
      try {
        const res = await axios.get(`${API_BASE_URL}/posts`);
        console.log(res.data);
      } catch (error) {
        console.error("❌ 文章獲取失敗:", error);
      }
    };

 


    //得到blog擁有者資料
    const getBlogUser = async()=>{
      try {
        const res = await axios.get(`${API_BASE_URL}/users/${user_id}`);
        console.log(res.data);
        setBlogUser(res.data);
      } catch (error) {
        console.error("取得blog使用者失敗",error);
      }
    }

    getBlogArticle();
    getBlogUser();
    getBanner();
    fetchArticle();
  }, []);


  //載入文章留言資料
  useEffect(()=>{
    //當文章載入後，取得每篇文章的留言
    if(articles.length > 0){
      const newComments = {}; //建立新的物件存放每篇文章的留言
      console.log(articles);
      Promise.all(
        articles.map(article =>{
            return  axios.get(`${API_BASE_URL}/comments/${article.id}`)
                .then(res=>{
                  console.log(`文章 ${article.id} 的留言:`, res.data);
                  newComments[article.id] = res.data.data|| []; // 確保即使沒有留言，也有空陣列 // 以 article.id 為 key 儲存留言  取 `data` 屬性內的陣列
                }) 
                .catch(error => {
                  console.error(`文章 ${article.id} 的留言載入失敗`, error);
                  newComments[article.id] = []; // 確保錯誤時也有預設值
                })
          }
        )
      ).then(()=>{
        setComments(newComments); //只更新一次state，避免多次 re-render
      }).catch(error => console.error("載入留言失敗", error));
    }
  }, [articles]);  // 依賴 `articles` 變化後執行


    //抓資料庫回傳banner資料渲染
    const getBanner = ()=>{
      axios.get(`${API_BASE_URL}/banners/${user_id}`)
      .then(res => {
        console.log(res.data);
        setBanner(res.data)
      })
      .catch(error => console.error("沒有 Banner", error));
    }


 
  //處理banner資訊上傳
  const handleBannerUpdate = async ()=>{
    try {
      const url = `${API_BASE_URL}/banners`;
      const method = banner ? "put" : "post"; // ✅ 判斷是更新還是建立

      const res = await axios({
        method,
        url,
        headers: {Authorization: `Bearer ${token}`},
        data: {
          title,
          subtitle,
          image_url: imageUrl
        }
      })
      console.log(res.data);
      setBanner(res.data);

      getBanner();
      //✅關閉Modal 
      closeModal(); // ✅ 成功後關閉

    } catch (error) {
      console.error("創建或更新banner失敗", error);
      closeModal();
    }
  }


  // ✅ 處理圖片上傳 & URL 預覽
  const handleImageChange = (e)=> {
    setImagePreview("");
    const file = e.target.file[0];
    if(file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleExternalImage = (e) => {
    setImagePreview("");
    setImageUrl(e.target.value);
    setImagePreview(e.target.value);
  }

  //處理Modal開關
  useEffect(()=>{
    const modalElement = modalBannerRef.current;
    if (!modalElement) return;

    
      modalInstanceRef.current = new Modal(modalElement, {backdrop: "true", Keyboard: true});

      const handleModalHidden = ()=> {
        resetForm();// ✅ Modal 關閉時清空輸入欄位
        const animationFrameId  = requestAnimationFrame(()=>{
          if(modalTriggerRef.current){
            modalTriggerRef.current.focus();
          }
        })
          // ✅ **這裡清除 `requestAnimationFrame()`，確保 `focus()` 不會在錯誤的時機點發生**
        return ()=> cancelAnimationFrame(animationFrameId);
      }

    // 監聽 modal 關閉事件，避免 aria-hidden 錯誤
    modalElement.addEventListener("hidden.bs.modal", handleModalHidden);

    
  
    // ✅ **這裡的 `return` 只負責移除 `eventListener`**
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", () => {});
    };

  },[])

  const openModal = () => {
    if(!modalInstanceRef.current) {
      modalInstanceRef.current = new Modal(modalBannerRef.current, {backdrop: "true", Keyboard: true});
    }
    modalInstanceRef.current.show();
  }
  
  const closeModal = ()=> {
    if(modalInstanceRef.current) {
      modalInstanceRef.current.hide();
    }

  }
  
  //✅ 清空banner Modal 內的輸入值
  const resetForm = ()=> {
    setTitle("");
    setSubtitle("");
    setImageUrl("");
    setImagePreview("");
  }




  return (
    <>
      {/* <header>
        <Navbar />
      </header> */}
      <main className="bg-secondary pt-10 pb-5">
        <div className="container">
          <div className="row flex-md-row-reverse">
            <div className="col-xl-3 col-md-4 mb-5">
              <div className="blog-home_header d-flex flex-column align-items-center py-10 px-5 rounded-3 border border-gray_light" style={{ backgroundColor: "#FDFBF5" }}>
                <img className="admin-avatar mb-2 rounded-circle border " src={blogUser.profile_picture
} alt="avatar" />
                <p className="mb-5">{blogUser.username}</p>
                <ul className="list-unstyled d-flex gap-5 gap-md-3 gap-lg-5 mb-5">
                  <li><FontAwesomeIcon icon={faEnvelope} size="lg" style={{ color: "#e77605", }} /></li>
                  <li><FontAwesomeIcon icon={faPodcast} size="lg" style={{ color: "#e77605", }} /></li>
                  <li><FontAwesomeIcon icon={faUserGroup} size="lg" style={{ color: "#e77605", }} /></li>
                  <li><FontAwesomeIcon icon={faFacebookF} size="lg" style={{ color: "#e77605", }} /></li>
                  <li><FontAwesomeIcon icon={faInstagram} size="lg" style={{ color: "#e77605", }} /></li>
                  <li><FontAwesomeIcon icon={faYoutube} size="lg" style={{ color: "#e77605", }} /></li>
                </ul>
                <p className="text-gray pb-5 border-bottom border-gray">{blogUser.bio}</p>
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
              {/* Banner 區域 */}
              <section className="blog-home_mainBanner py-10 ps-lg-10  rounded-3 mb-5  border border-gray_light" style={{ backgroundImage:banner ? `url(${banner.image_url})` : "none",backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="d-flex flex-column align-items-center align-items-lg-start">
                  <h2 className="fs-5 fs-md-3 text-light mb-5" style={{ zIndex: "99" }}>{banner?.title || "歡迎來到 Blog主頁"}</h2>
                  <h4 className="mb-5 text-light" style={{ zIndex: "99" }}>{banner?.subtitle || "請點擊編輯設定你的 Banner"}</h4>

                  {/* ✅ 只有 Blog 擁有者能看到按鈕 */}
                  {isAuthor && <button type="button"  ref={modalTriggerRef} className="btn btn-primary btn-lg" style={{ zIndex: "99" }}  onClick={openModal}> 
                    {banner ? "編輯" : "建立"}
                  </button>}
                </div>
              </section>


              <section className="position-relative mb-5">
                <Swiper key={articles.length} className="blog_swiper rounded-3"
                  style={{
                    "--swiper-pagination-color": "#e77605",
                    "--swiper-pagination-bullet-inactive-color": "#eaeaea",
                    "--swiper-pagination-bullet-inactive-opacity": "1",
                  }}
                  modules={[Pagination, Navigation, Autoplay]}
                  navigation={{ nextEl: ".swiperNextEl", prevEl: ".swiperPrevEl" }}
                  pagination={{
                    clickable: true,
                    bulletClass:
                      "swiper-pagination-bullet swiper-pagination-bullet-mx-6",
                  }}
                  autoplay={{ delay: 5000 }}
                  loop={true}
                >
                  {articles.map((article)=>(
                     <SwiperSlide key={article.id}>
                     <div className="position-relative">
                       <picture className="banner-img-container w-100">
                         <source media="(min-width:768px)" srcSet={article.image_url} />
                         <img
                           src={article.image_url}
                           className="w-100 object-fit-cover"
                           alt="banner-img"
                         />
                       </picture>
                       <div className="blog-banner_content text-light">
                         <h2 className="fw-bold fs-5 fs-md-4 mb-8 mb-md-12 ms-md-5">
                          {article.title}
                         </h2>
                       </div>
                     </div>
                   </SwiperSlide>
                  ))}
                    {/* <SwiperSlide>
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
                    </SwiperSlide> */}
               
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
              <div className="blog-home_articleList rounded-3 border border-gray_light py-10 px-5" style={{ backgroundColor: "#FDFBF5" }}>
                <div className="articleList_header">
                  <h1 className="text-primary fs-4 fs-md-3 mb-5">文章列表</h1>
                  <div className="d-block d-md-flex justify-content-between align-items-center">
                    <select className="form-select blog-home_articleSelect py-3 mb-6" defaultValue="全部內容">
                      <option value="全部內容">全部內容</option>
                      <option value="已發佈">已發佈</option>
                      <option value="取消發佈">取消發佈</option>
                    </select>
                    <button type="button" className="btn btn-primary btn-lg mb-5" data-bs-toggle="modal" data-bs-target="#newPostModal">新增文章</button>
                  </div>
                </div>
                <div className="articleList_content">
                  {sortedArticles.map((article)=>(
                    <Blog_ArticleCard 
                      key={article.id} 
                      article={article} 
                      comments={comments[article.id]||[]}  // 把留言傳給 Blog_ArticleCard
                      togglePin={togglePin} //傳遞函式開關給子組件
                      isPinned = {pinnerArticles.includes(article.id)} //傳遞是否釘選
                      likePost={likePost} // 傳遞按讚函式
                      token={token}
                      getBlogArticle = {()=> getBlogArticle() }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ✅ Bootstrap 5 Modal (用來輸入 Banner 資料)  */}
      {/* ✅ 這樣點擊背景層也會關閉 `Modal` */}
      <div className="modal fade" ref={modalBannerRef} id="bannerModal" aria-labelledby="bannerModalLabel" aria-hidden="true" tabIndex="-1" >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{banner ? "編輯 Banner" : "建立 Banner"}</h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              <label htmlFor="封面圖片" className="form-label">上傳圖片</label>
              <input type="file" className="form-control mb-2" accept="image/*" onChange={handleImageChange} />
              <input type="text" className="form-control mb-2" placeholder="輸入封面圖片 URL" value={imageUrl} onChange={handleExternalImage} />
              {imagePreview && <img src={imagePreview} alt="預覽圖片" className="img-fluid mb-3" />}

              <input type="text" className="form-control mb-2" placeholder="Banner 標題" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Banner 副標題" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleBannerUpdate}>儲存</button>
              <button className="btn btn-secondary" onClick={closeModal}>關閉</button>
            </div>
          </div>
        </div>
      </div>

      <NewPostModal   getBlogArticle = {()=> getBlogArticle() }/>
    </>
  );
};

export default BlogHome;