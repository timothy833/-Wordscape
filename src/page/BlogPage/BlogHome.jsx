import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faPodcast, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

import Blog_ArticleCard from "../../component/BlogPageArticleCard/Blog_ArticleCard";


import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay} from "swiper/modules";
import "swiper/scss/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";



//React方法引用
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef} from "react";

//引入Modal方法
import { Modal } from "bootstrap";
//處理發布文章modal
import NewPostModal from "../BlogPage/CreatePostModal";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // ✅ Quill 樣式
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { useSelector} from "react-redux";


// const getCookie = (name) => {
//   return document.cookie
//       .split("; ")
//       .find(row => row.startsWith(name + "="))
//       ?.split("=")[1] || "";
// };

const BlogHome = () => {
  const { user_id } = useParams(); // URL 參數中的 Blog 擁有者 ID
  // const [token, setToken] = useState("");  
  const [banner, setBanner] = useState(null); //儲存回傳banner的資訊
  // const [userId, setUerId] = useState(""); //存放傳進來或登入者userId
  const [isAuthor, setIsAuthor] = useState(false); //確認是否為Blog擁有者
  const [title, setTitle] = useState("") //設定傳送Blog Banner標題
  const [subtitle, setSubtitle] = useState("") //設定傳送Blog Banner副標
  const [imageFile, setImageFile] = useState(null)//設定傳送R2網址
  const [imageUrl, setImageUrl] = useState(""); //設定傳送外部網址Banner圖源
  const [imagePreview, setImagePreview] = useState("") //設定預覽圖片
  const modalTriggerRef = useRef(null); // 綁定觸發 modal 的按鈕
  const [articles, setArticles] = useState([]); //處理文章列表資料
  const [blogUser, setBlogUser] = useState({}); //存放blog使用者資料
  const [comments, setComments] = useState({}); //處理文章留言資料 初始化 comments 應該是 {}
  const [pinnerArticles, setPinnedArticles] = useState([]); //切換置頂文章排序狀態
  const [selectedArticle, setSelectedArticle] = useState(null);  // 🚀 **管理當前編輯文章**

  const modalBannerRef = useRef(null); //綁定modal div的容器
  const modalInstanceBannerRef = useRef(null); // 存 `Modal` 實體
  const bannerRef = useRef(null);

  //狀態管理userId & token
  // const dispatch = useDispatch();

  // ✅ 從 Redux 取得登入的 user_id 和 token
  const userId = useSelector((state)=> state.auth.id);
  const token = useSelector((state)=> state.auth.token);

  //初始化比對userId是否是登入id
  useEffect(()=>{   
    if(user_id === userId) {
      setIsAuthor(true);
    }
  
  }, [userId]);
    

  
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




  //加載blog擁有者文章api
  const getBlogArticle = async ()=>{
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/user/${user_id}`);
      console.log(res.data);
      if( res.data && Array.isArray(res.data.data)){
        setArticles(res.data.data);
      }
      else{
        setArticles([]); // 如果 API 沒有返回正確資料，預設為空陣列
      }
      
    } catch (error) {
      console.error("取得blog文章列表失敗", error);
      setArticles([]); // 遇到錯誤時，也設置空陣列，避免 undefined 錯誤
    }
  }


  //加載文章導航區文章地圖
  const categorizedArticles = articles.reduce((acc, article)=>{
    const {category_id, category_name} = article;
    if(!acc[category_id]){
      acc[category_id] = {name: category_name || "未分類", articles: []};
    }
    acc[category_id].articles.push(article);

    return acc;
  }, {});


  //加載blog擁有者基本信息 在元件載入時讀取token
  useEffect(()=>{
    // const storedToken = getCookie("WS_token");
    // setToken(storedToken);
    // setUerId("dc576098-dc26-46a4-aede-6bc5c8f300ea");

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
      setBanner(res.data);
      setTitle(res.data.title);
      setSubtitle(res.data.subtitle);
      setImagePreview(res.data.image_url)

    })
    .catch(error => console.error("沒有 Banner", error));
  }


 
  //處理banner資訊上傳
  const handleBannerUpdate = async ()=>{
    try {
      const url = `${API_BASE_URL}/banners`;
      const method = banner ? "put" : "post"; // ✅ 判斷是更新還是建立

      let data;
      let headers;

      // ✅ 判斷是本地圖片還是外部網址
      if(imageFile){
        //🔹 使用 FormData 上傳本地圖片
        data = new FormData();
        data.append("title", title);
        data.append("subtitle", subtitle);
        data.append("image", imageFile) // ✅ 只上傳圖片檔案
        headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };
      }else if(imageUrl){
         // 🔹 使用 JSON 格式上傳外部圖片
        data = {
          title,
          subtitle,
          image_url: imageUrl, // ✅ 只上傳圖片 URL
        };
        headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
      }else {
        console.error("請提供圖片或外部圖片 URL");
        return;
      }

      const res = await axios({
        method,
        url,
        headers,
        data
      });
      console.log(res.data);
      setBanner(res.data);
      alert("banner圖更新成功");
      getBanner();
      //✅關閉Modal 
      closeModal(); // ✅ 成功後關閉

    } catch (error) {
      console.error("創建或更新banner失敗", error);
      closeModal();
    }
  }


  // ✅ 處理本地檔案banner圖片上傳 & URL 預覽
  const handleImageChange = (e)=> {
    setImagePreview("");
    setImageUrl("");
    const file = e.target.files[0];
    if(file) {
      setImageFile(file);
      const imageUrlFile = URL.createObjectURL(file);
      setImagePreview(imageUrlFile);
    }
  };

  // ✅ 處理banner外部網址輸入
  const handleExternalImage = (e) => {
    if(bannerRef.current){
      bannerRef.current.value = ""; 
    };
    setImagePreview("");
    setImageFile(null);
    setImageUrl(e.target.value.trim());
  }

  // ✅ 只有在輸入框失去焦點時，才設定預覽圖片
  const handleExternalImageBlur = () => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  };

  //處理BannerModal開關
  useEffect(()=>{
    const modalElement = modalBannerRef.current;
    if (!modalElement) return;

    
      modalInstanceBannerRef.current = new Modal(modalElement, {backdrop: "true", Keyboard: true});

      const handleModalHidden = ()=> {
        resetForm();// ✅ Modal 關閉時清空輸入欄位
        closeEditModal(); //清除編輯Modal內容
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
    if(!modalInstanceBannerRef.current) {
      modalInstanceBannerRef.current = new Modal(modalBannerRef.current, {backdrop: "true", Keyboard: true});
    }
    getBanner();
    modalInstanceBannerRef.current.show();
  }
  
  const closeModal = ()=> {
    if(modalInstanceBannerRef.current) {
      modalInstanceBannerRef.current.hide();
      resetForm();
    }

  }
  
  //✅ 清空banner Modal 內的輸入值
  const resetForm = ()=> {
    setTitle("");
    setSubtitle("");
    setImageUrl("");
    setImagePreview("");
  }


  
//這邊以下開始專門處理編輯文章Modal---------------------------------

const [titleEdit, setTitleEdit] = useState("");
const [descriptionEdit, setDescriptionEdit] = useState("");
const [contentEdit, setContentEdit] = useState("");
const [imagePreviewEdit, setImagePreviewEdit] = useState("");
const [selectedFileEdit, setSelectedFileEdit] = useState(null);
const [externalImageEdit  ,setExternalImageEdit] = useState("");


const modalRef = useRef(null); //管理編輯文章實體化modal位置
const modalInstanceRef = useRef(null);//管理編輯文章實體化
const quillInstance = useRef(null); // Quill 編輯器
const editorRef = useRef(null); // 綁定 Quill DOM
const fileInputRef = useRef(null);

//處理編輯modal實體化
useEffect(()=>{
  const modalElement = modalRef.current;
  if (!modalElement) return;

  modalInstanceRef.current = new Modal(modalElement, {backdrop: "true", Keyboard: true});

},[])

//初始化編輯modal資料渲染
useEffect(() => {
  if (!selectedArticle) return;
  
  setTitleEdit(selectedArticle.title || "");
  setDescriptionEdit(selectedArticle.description || "");
  setContentEdit(selectedArticle.content || "");
  setImagePreviewEdit(selectedArticle.image_url || "");

  // ✅ 確保 Quill 編輯器初始化
  if (editorRef.current && !quillInstance.current) {
    quillInstance.current = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ font: [] }, { size: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          ["clean"],
        ],
      },
    });

    quillInstance.current.on("text-change", () => {
      setContentEdit(quillInstance.current.root.innerHTML);
    });
  }

  // ✅ 載入文章內容到 Quill
  if (quillInstance.current) {
    quillInstance.current.root.innerHTML = selectedArticle.content || "";
  }
}, [selectedArticle]);



//傳進去給articleCard當打開開關

const openEditModal = (article) => {
  console.log("🔍 文章選擇:", article);
  setSelectedArticle(article);

  if(!modalInstanceRef.current) {
    modalInstanceRef.current = new Modal(modalRef.current, {backdrop: "true", Keyboard: true});
  }
  modalInstanceRef.current.show();
}

const closeEditModal = ()=> {
  if(modalInstanceRef.current) {
    modalInstanceRef.current.hide();
  }
  setSelectedArticle(null);
  setExternalImageEdit("");
  setSelectedFileEdit(null);
  setTitleEdit("");
  setDescriptionEdit("");
  setImagePreviewEdit("");
  setContentEdit("");

}

// ✅ 本地檔案封面圖輸入點
const handleImageEdit = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setImagePreviewEdit("");
  setExternalImageEdit("");
  setSelectedFileEdit(file);
  setImagePreviewEdit(URL.createObjectURL(file));
};


// 外部網址預染封面圖 ✅ 手動輸入封面圖片 URL
  const handleExternalImageEdit = (e) => {
    if(fileInputRef.current){
      fileInputRef.current.value = ""; 
    };
    const url = e.target.value.trim();
    setImagePreviewEdit("");
    setSelectedFileEdit("");
    setExternalImageEdit(url);
};

  // ✅ 只有在輸入框失去焦點時，才設定預覽圖片
  const handleExternalImageEditBlur = () => {
    if (externalImageEdit) {
      setImagePreview(externalImageEdit);
    }
  };

// ✅ 上傳封面圖到 R2
const uploadImageToR2 = async () => {
  if (!selectedFileEdit) return;

  const formData = new FormData();
  formData.append("cover", selectedFileEdit);
  try {
    const res = await axios.post(`${API_BASE_URL}/posts/upload/cover`, formData, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    return res.data.url;
  } catch (error) {
    console.error("封面圖片上傳失敗", error);
    return 
  }
};



  // ✅ 更新文章
  const handleSubmit = async () => {
    try {
      const finalImageUrl = selectedFileEdit? await uploadImageToR2():externalImageEdit;

       // 創建一個臨時 `div` 來解析 HTML(Quill 內部 Base64 圖片)
       const tempDiv = document.createElement("div");

       // ✅ **確保 Quill 內容是最新的**
       tempDiv.innerHTML = contentEdit;
       // ✅ **處理 Base64 圖片並替換**
       const imgTags = [...tempDiv.getElementsByTagName("img")];
       
       // 2️⃣ 找出所有 Base64 編碼的圖片
       const base64Images = imgTags
           .map(img => img.getAttribute("src"))
           .filter(src => src.startsWith("data:image"));

      // 3️⃣ 如果有 Base64 圖片，則批量上傳
      if(base64Images.length > 0) {
        try {
            const res = await axios.post(`${API_BASE_URL}/posts/upload/content`,
            {files: base64Images},{
                headers:{
                    Authorization: `Bearer ${token}`
                },
                maxContentLength: 100 * 1024 * 1024, // ✅ 允許最大 100MB
                maxBodyLength: 100 * 1024 * 1024
            })

            // 4️⃣ 替換 Quill 內的 Base64 圖片 URL 為 R2 的 URL
            base64Images.forEach((base64, index)=>{
                const newUrl = res.data.urls[index];
                const img = tempDiv.querySelector(`img[src="${base64}"]`);
                if(img) img.setAttribute("src", newUrl);
            });

            // setContent(tempDiv.innerHTML); // ✅ **統一更新 `content`**
            // quill.root.innerHTML = tempDiv.innerHTML; // ✅ 直接更新 Quill 編輯器內容
        } catch (error) {
            console.error("文章內圖片上傳失敗", error);
            return
        }
      }

      await axios.patch(`${API_BASE_URL}/posts/${selectedArticle.id}`, {
        title: titleEdit,
        description: descriptionEdit,
        content: tempDiv.innerHTML,
        image_url: finalImageUrl,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("文章更新成功");
      getBlogArticle(); // 重新加載文章
      closeEditModal(); // 關閉 Modal
    } catch (error) {
      console.error("文章更新失敗", error);
      alert("文章更新失敗");
    }
  };

   
  
  if(!articles || articles.length === 0){
    return <p>載入中....</p>
  }


  return (
    <>
      <main className="bg-secondary pt-10 pb-5">
        <div className="container">
          <div className="row flex-md-row-reverse">
            <div className="col-xl-3 col-md-4 mb-5">
              <div className="blog-home_header d-flex flex-column align-items-center py-10 px-5 rounded-3 border border-gray_light" style={{ backgroundColor: "#FDFBF5" }}>
                <img className="admin-avatar mb-2 rounded-circle border " src={blogUser.profile_picture
|| "https://raw.githubusercontent.com/wfox5510/wordSapce-imgRepo/695229fa8c60c474d3d9dc0d60b25f9539ac74d9/default-avatar.svg"} alt="大頭貼" />
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
                  {Object.keys(categorizedArticles).map((categoryId, index)=>{
                    const category = categorizedArticles[categoryId];
                    return (
                      <li key={categoryId} className="text-gray">
                        {index + 1}. {category.name}
                        <ul className="list-unstyled ms-4">
                          {category.articles.map((article, subIndex)=>(
                            <li key={article.id} className="text-gray">
                              {index + 1}-{subIndex + 1}. 
                              <Link to={`/article/${article.id}`} className="ms-2 custom-link">
                                {article.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  })}
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
                          <Link to={`/article/${article.id}`} className="custom-link">
                          {article.title}
                          </Link>
                         </h2>
                       </div>
                     </div>
                   </SwiperSlide>
                  ))}
                  <div className="blog-swiper-pagination d-none d-lg-flex gap-7">
                  <Link className="swiperPrevEl bg-light rounded-pill d-block d-flex align-items-center justify-content-center">
                      <span className="material-symbols-outlined text-primary ms-2">
                        arrow_back_ios
                      </span>
                    </Link>
                    <Link className="swiperNextEl bg-light rounded-pill d-block d-flex align-items-center justify-content-center">
                      <span className="material-symbols-outlined text-primary">
                        arrow_forward_ios
                      </span>
                    </Link>
                  </div>
                </Swiper>
              </section>  
              <div className="blog-home_articleList rounded-3 border border-gray_light py-10 px-5" style={{ backgroundColor: "#FDFBF5" }}>
                <div className="articleList_header">
                  <h1 className="text-primary fs-4 fs-md-3 mb-5">文章列表</h1>
                  {isAuthor && (<div className="d-block d-md-flex justify-content-between align-items-center">
                    <select className="form-select blog-home_articleSelect py-3 mb-6" defaultValue="全部內容">
                      <option value="全部內容">全部內容</option>
                      <option value="已發佈">已發佈</option>
                      <option value="取消發佈">取消發佈</option>
                    </select>
                    <button type="button" className="btn btn-primary btn-lg mb-5" data-bs-toggle="modal" data-bs-target="#newPostModal">新增文章</button>
                  </div> )}
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
                      onEdit={ openEditModal}  // 🚀 **將開啟 `Modal` 的函式傳下去**
                      isAuthor={isAuthor}
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
              <label htmlFor="封面圖片" className="form-label fw-medium">上傳圖片</label>
              <input id="封面圖片" type="file" ref={bannerRef} className="form-control mb-2" accept="image/*" onChange={handleImageChange} />
              <input type="text" className="form-control mb-2" placeholder="輸入封面圖片 URL" value={imageUrl} onChange={handleExternalImage}  
              onBlur={handleExternalImageBlur} // ✅ 只有輸入完成時才更新圖片 
              />
              {imagePreview && <img src={imagePreview} alt="預覽圖片" className="img-fluid mb-3" 
                onError={(e) => (e.target.style.display = "none")} // ✅ 圖片錯誤時隱藏
              />}
              <label htmlFor="標題" className="form-label fw-medium">Blog主頁標題</label>
              <input id="標題" type="text" className="form-control mb-2" placeholder="輸入Blog主頁 標題" value={title} onChange={(e) => setTitle(e.target.value)} />
              <label htmlFor="副標題" className="form-label fw-medium">Blog主頁副標</label>
              <input id="副標題" type="text" className="form-control mb-2" placeholder="輸入 Blog主頁 副標題" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleBannerUpdate}>儲存</button>
              <button className="btn btn-secondary" onClick={closeModal}>關閉</button>
            </div>
          </div>
        </div>
      </div>

      <NewPostModal   getBlogArticle = {()=> getBlogArticle() }/>

      {/*  ✅ 內嵌的 `EditPostModal`*/}
      <div className="modal fade" ref={modalRef} id="editPostModal" aria-hidden="true" tabIndex="-1" >
          <div className="modal-dialog modal-lg">
            <div className="modal-content max-h">
              <div className="modal-header">
                  <h5 className="modal-title">編輯文章</h5>
                  <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>

              <div className="modal-body">
                <label htmlFor="封面圖片" className="form-label fw-medium">封面圖片</label>
                <input type="file" ref={fileInputRef} id="封面圖片" className="form-control mb-2" accept="image/*"  onChange={handleImageEdit}/>
                <input type="text" id="輸入封面圖片Url" className="form-control mb-2" value={externalImageEdit}  placeholder="輸入封面圖片 URL"onChange={handleExternalImageEdit}
                onBlur={handleExternalImageEditBlur}
                />
                {imagePreviewEdit && <img src={imagePreviewEdit} alt="封面預覽" className="img-fluid mb-3"  onError={(e) => (e.target.style.display = "none")}  />}

                <label htmlFor="title" className="form-label fw-medium">文章標題</label>
                <input id="title" type="text"  className="form-control mb-2"  value={titleEdit} onChange={(e)=> setTitleEdit(e.target.value) }/>
                <label htmlFor="description" className="form-label fw-medium">文章簡介</label>
                <input id="description" type="text"  className="form-control mb-2" value={descriptionEdit} onChange={(e)=> setDescriptionEdit(e.target.value)}/>

                {/* ✅ 這裡用 ref 綁定 Quill */} 
                <div className="mb-3" ref={editorRef} ></div>
              </div>

              <div className="modal-footer">
                  <button className="btn btn-primary" onClick={handleSubmit}>更新文章</button>
                  <button className="btn btn-sceondary" onClick={closeEditModal}>關閉</button>
              </div>
            </div>
          </div>   
      </div>

    </>
  );
};

export default BlogHome;