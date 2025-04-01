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
import SponsorModal from "../../component/SponsorModal/SponsorModal";



//React方法引用
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef, useMemo, Fragment} from "react";

//引入Modal方法
import { Modal } from "bootstrap";
//處理發布文章modal
import NewPostModal from "../BlogPage/CreatePostModal";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // ✅ Quill 樣式
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { useSelector, useDispatch} from "react-redux";
// import { useNavigate } from "react-router-dom";
import { logout } from "../../slice/authSlice";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import {  alertMsgForAdminInfo,alertMsgForAdminError} from "../../utils/alertMsg"
import LoadingSpinner from "../../component/LoadingSpinner/LoadingSpinner"
import { logError } from "../../utils/sentryHelper";
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
  const [filterStatus, setFilterStatus] = useState(""); // 篩選狀態
  const [title, setTitle] = useState("") //設定傳送Blog Banner標題
  const [subtitle, setSubtitle] = useState("") //設定傳送Blog Banner副標
  const [imageFile, setImageFile] = useState(null)//設定傳送R2網址
  const [imageUrl, setImageUrl] = useState(""); //設定傳送外部網址Banner圖源
  const [imagePreview, setImagePreview] = useState("") //設定預覽圖片
  const modalTriggerRef = useRef(null); // 綁定觸發 modal 的按鈕
  const [articles, setArticles] = useState([]); //處理文章列表資料
  const [blogUser, setBlogUser] = useState({}); //存放blog使用者資料
  const [comments, setComments] = useState({}); //處理文章留言資料 初始化 comments 應該是 {}
  const [selectedArticle, setSelectedArticle] = useState(null);  // 🚀 **管理當前編輯文章**
  const [errors, setErrors] = useState({ banner: "" ,imageEdit: ""}); //確認Banner圖 編輯文章封面圖外部網址有無問題
  const modalBannerRef = useRef(null); //綁定modal div的容器
  const modalInstanceBannerRef = useRef(null); // 存 `Modal` 實體
  const bannerRef = useRef(null);


  // ✅ 釘選狀態（從 localStorage 讀取）
  const [pinnedArticles, setPinnedArticles] = useState([]);

  //狀態管理userId & token
  // const dispatch = useDispatch();

  // ✅ 從 Redux 取得登入的 user_id 和 token
  const userId = useSelector((state)=> state.auth.id);
  const token = useSelector((state)=> state.auth.token);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); // ✅ 預設 `true`，開始載入


  useEffect(() => {
    const checkTokenExpiry = () => {
      const tokenFromCookies = Cookies.get("WS_token");
      if (!tokenFromCookies) {
        dispatch(logout());
        // navigate("/"); // 這裡手動導回首頁
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000); // 每 60 秒檢查
    return () => clearInterval(interval);
  }, [dispatch]);


  //初始化比對userId是否是登入id
  useEffect(()=>{   
    if(user_id === userId) {
      setIsAuthor(user_id === userId);
    }
    else {
      setIsAuthor(false); // 如果 `user_id` 為空，預設不是擁有者
      setBanner("");
      setTitle("");
      setSubtitle("");
      setImagePreview("")
      // getBanner();
    }
  }, [user_id, userId]);


  //取得釘選文章api資料
  useEffect(() => {
    if (user_id) {
      fetchPinnedArticles();
    }
  }, [user_id]);

  const fetchPinnedArticles = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/pinned/${user_id}`);
      setPinnedArticles(res.data.data); // 取得文章 ID 陣列
    } catch (error) {
      logError("取得釘選文章失敗", error);
      setPinnedArticles([]);
    }
  };





  // 切換釘選狀態
  const togglePin = async (articleId) => {
    if (!isAuthor) return; // 只有作者能操作

    try {
      await axios.post(`${API_BASE_URL}/posts/${articleId}/pinned`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // 更新狀態
      setPinnedArticles((prevPinned) => {
        if (prevPinned.includes(articleId)) {
          return prevPinned.filter((id) => id !== articleId);
        } else {
          return [...prevPinned, articleId];
        }
      });

    } catch (error) {
      logError("切換釘選失敗", error);
    }
    
  };

   // ✅ 計算篩選 & 排序後的文章列表（使用 `useMemo` 優化）
   const filteredArticles = useMemo(() => {
    return articles
    .filter((article) => filterStatus === "" || article.status === filterStatus) // 只顯示已發布的文章   // 1️⃣ 篩選狀態 (全部 / 已發佈 / 草稿)
    .sort((a, b) => {
      const isPinnedA = pinnedArticles.includes(a.id); 
      const isPinnedB = pinnedArticles.includes(b.id);
      return isPinnedB - isPinnedA; // 釘選的文章排在最前面  // 2️⃣ 排序 → 釘選文章優先  // 如果釘選狀態相同 → 保留原本順序 (時間順)
    });
  }, [articles, filterStatus, pinnedArticles])



  //加載blog擁有者文章api
  const getBlogArticle = async ()=>{
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/user/${user_id}`);
      // console.log(res.data);
      if( res.data && Array.isArray(res.data.data)){
        let fetchedArticles = res.data.data;


        // // ✅ 如果 `userId` 不存在（未登入），或 `user_id !== userId`，則只顯示 `published`
        if (!userId   || user_id !== userId) {
          fetchedArticles = fetchedArticles.filter((article) => article.status === "published");
        }

        // 按照時間排序（最新的文章放最上面）
        fetchedArticles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setArticles(fetchedArticles);
      }
      else{
        setArticles([]); // 如果 API 沒有返回正確資料，預設為空陣列
      }
      
      setIsLoading(false);
    } catch (error) {
      logError("取得blog文章列表失敗", error);
      setArticles([]); // 遇到錯誤時，也設置空陣列，避免 undefined 錯誤
    }
  }



  //加載文章導航區文章地圖
  const categorizedArticles = useMemo(()=>{
    
    return filteredArticles.reduce((acc, article)=>{
    const {category_id, category_name} = article;
    if(!acc[category_id]){
      acc[category_id] = {name: category_name || "未分類", articles: []};
    }
    acc[category_id].articles.push(article);

    return acc;
  }, {})}, [filteredArticles]); // ✅ 依賴 `articles`，當 `articles` 變更時重新計算



// ✅ Swiper 文章（只顯示 `published`，釘選優先，瀏覽數排序）
const swiperArticles = useMemo(() => {
  return articles // 🔥 改為直接依賴 `articles`，避免被 `filterStatus` 影響
    .filter((article) => article.status === "published") // 只顯示已發布的文章
    .sort((a, b) => {
      const isPinnedA = pinnedArticles.includes(a.id);
      const isPinnedB = pinnedArticles.includes(b.id);
      if (isPinnedA !== isPinnedB) return isPinnedB - isPinnedA; // 釘選的排最前
      return b.view_count - a.view_count; // 瀏覽數高的排前
    })
    .slice(0, 5); // 🔥 固定顯示最多 5 篇 // 確保少於 5 篇時顯示全部
}, [articles, pinnedArticles]);

  // ✅ 監聽篩選狀態變更，重新載入文章
  // useEffect(() => {
  //   getBlogArticle();
  // }, [filterStatus]);



  //得到blog擁有者資料
  const getBlogUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/${user_id}`);
      // console.log(res.data);
      setBlogUser(res.data);
    } catch (error) {
      logError("取得 blog 使用者失敗", error);
    }
  };


  //加載blog擁有者基本信息 渲染文章列表資料
  // useEffect(()=>{
  //   // const storedToken = getCookie("WS_token");
  //   // setToken(storedToken);
  //   // setUerId("dc576098-dc26-46a4-aede-6bc5c8f300ea");

  
  //   getBlogArticle();
  //   getBlogUser();
  //   // getBanner();
  // }, [isAuthor, token]);
    //抓資料庫回傳banner資料渲染
    const getBanner = ()=>{
      if (!user_id) return; // 🔹 確保 `user_id` 存在才執行
  
      axios.get(`${API_BASE_URL}/banners/${user_id}`)
      .then(res => {
        // console.log(res.data);
        setBanner(res.data );
        setTitle(res.data.title  || "預設標題");
        setSubtitle(res.data.subtitle  || "預設副標題");
        setImagePreview(res.data.image_url  || "")
  
      })
      .catch(error => logError("沒有 Banner", error));
    }
  



  useEffect(() => {
    // console.log("🔄 重新載入 BlogHome，當前 user_id:", user_id);
    getBlogArticle(); // 重新載入該 BlogHome 的內容
    getBlogUser();    // 重新載入該使用者資訊
    getBanner();
  }, [user_id]); // 監聽 `user_id` 變更時，重新執行 `useEffect`



  //載入文章留言資料
  useEffect(()=>{
    //當文章載入後，取得每篇文章的留言
    if(articles.length > 0){
      const newComments = {}; //建立新的物件存放每篇文章的留言
      // console.log(articles);
      Promise.all(
        articles.map(article =>{
            return  axios.get(`${API_BASE_URL}/comments/${article.id}`)
                .then(res=>{
                  // console.log(`文章 ${article.id} 的留言:`, res.data);
                  newComments[article.id] = res.data.data|| []; // 確保即使沒有留言，也有空陣列 // 以 article.id 為 key 儲存留言  取 `data` 屬性內的陣列
                }) 
                .catch(error => {
                  logError(`文章 ${article.id} 的留言載入失敗`, error);
                  newComments[article.id] = []; // 確保錯誤時也有預設值
                })
          }
        )
      ).then(()=>{
        setComments(newComments); //只更新一次state，避免多次 re-render
      }).catch(error => logError("載入留言失敗", error));
    }
  }, [articles]);  // 依賴 `articles` 變化後執行




 
  //處理banner資訊上傳
  const handleBannerUpdate = async ()=>{
    try {
      setIsLoading(true);
      const newErrors = {};

      // 🚀 確保所有欄位都填寫
      if (!title.trim()) newErrors.title = "⚠️ 請輸入標題";
      if (!subtitle.trim()) newErrors.subtitle = "⚠️ 請輸入副標題";
      if (!imageFile && !imageUrl) newErrors.banner = "⚠️ 必須提供圖片（本地或 URL)";

      let isValidImage = true;
      if (imageUrl) {
          isValidImage = await validateImage(imageUrl);
          if (!isValidImage) {
              newErrors.banner = "⚠️ 請輸入有效的圖片 URL";
          }
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0 || !isValidImage){ 
        setIsLoading(false);
        return; // 🚀 若有錯誤則阻止提交
      }
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
        logError("請提供圖片或外部圖片 URL");
        setIsLoading(false);
        return;
      }

      const res = await axios({
        method,
        url,
        headers,
        data
      });
      // console.log(res.data);
      setBanner(res.data);
      getBanner();
      setIsLoading(false);
      Swal.fire(alertMsgForAdminInfo);
      //✅關閉Modal 
      closeModal(); // ✅ 成功後關閉

    } catch (error) {
      logError("創建或更新banner失敗", error);
      closeModal();
    }
  }


  // ✅ 處理本地檔案banner圖片上傳 & URL 預覽
  const handleImageChange = (e)=> {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview("");
    setImageUrl("");
    setImageFile(file);    // 存本地檔案
    setErrors((prev) => ({ ...prev, banner: "" })); // 清除 banner 錯誤

    const imageUrlFile = URL.createObjectURL(file);
    setImagePreview(imageUrlFile);
    
  };

  // ✅ 處理banner外部網址輸入
  const handleExternalImage = async(e) => {
    if(bannerRef.current){
      bannerRef.current.value = ""; 
    };
    setImagePreview("");
    setImageFile(null);
    setImageUrl(e.target.value.trim());
  }

  // ✅ 只有在輸入框失去焦點時，才設定預覽圖片
  const handleExternalImageBlur = async() => {
    if (!imageUrl) return;

    const isValid = await validateImage(imageUrl);
    if (isValid) {
        setImagePreview(imageUrl); // 預覽有效的圖片 URL
    } else {
        setErrors((prev) => ({ ...prev, banner: "⚠️ 圖片 URL 無效，請輸入可預覽的圖片。" }));
        setImagePreview(null);
    }
  };

  // ✅ 圖片驗證函數
  const validateImage = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });
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
    setErrors({banner: "" }); // 清除 banner 錯誤
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
  // console.log("🔍 文章選擇:", article);
  getBlogArticle();
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
  setErrors({imageEdit: ""})

}

// ✅ 本地檔案封面圖輸入點
const handleImageEdit = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setImagePreviewEdit("");
  setExternalImageEdit("");
  setErrors((prev) => ({ ...prev, imageEdit: "" })); // 清除錯誤
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
    setErrors((prev) => ({ ...prev, imageEdit: "" })); // 清除錯誤
    setExternalImageEdit(url);
};

  // ✅ 只有在輸入框失去焦點時，才設定預覽圖片
  const handleExternalImageEditBlur = async() => {
    if (externalImageEdit) {
      const isValid = await validateImage(externalImageEdit);
      if (isValid) {
        setImagePreviewEdit(externalImageEdit); // 預覽圖片
      } else {
        setErrors((prev) => ({ ...prev, imageEdit: "⚠️ 圖片 URL 無效，請輸入可預覽的圖片。" }));
        setImagePreviewEdit(null);
      }
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
    logError("封面圖片上傳失敗", error);
    return 
  }
};

  // 工具函式：判斷 Quill 編輯器內容是否為空（即便有 <p><br></p> 這種表面 HTML）
const isQuillContentEmpty = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent.trim() === "";  // 沒有純文字內容就視為空
};


  // ✅ 更新文章
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const newErrors = {};
      let isValidImage = true;

       // ✅ 驗證圖片：如果有輸入外部圖片，檢查是否有效
       if(externalImageEdit) {
        isValidImage = await validateImage(externalImageEdit);
        if(!isValidImage){
          newErrors.imageEdit = "⚠️ 請輸入有效的封面圖片 URL";
        }
       }

       setErrors(newErrors);
       if (!isValidImage) {
         setIsLoading(false);
         return; // 🚀 圖片無效，阻止提交
       }

      // ✅ 圖片處理：選本地 → 上傳，否則用外部網址
      let finalImageUrl =  null;

      if(selectedFileEdit){
        finalImageUrl = await uploadImageToR2();
      }else if(externalImageEdit){
        finalImageUrl = externalImageEdit;
      }

      
      
      // ✅ 動態組裝 payload
      const payload = {};
      if(titleEdit.trim() !== "" && titleEdit.trim() !== (selectedArticle.title || "").trim()) {payload.title = titleEdit.trim(); }
      if(descriptionEdit.trim() !== "" && descriptionEdit.trim() !== (selectedArticle.description || "").trim()) {payload.description = descriptionEdit; }
      if(finalImageUrl && finalImageUrl !== selectedArticle.image_url) {payload.image_url = finalImageUrl;}
      if(!isQuillContentEmpty(contentEdit) && contentEdit.trim() !== (selectedArticle.content || "").trim()){
        // ✅ 處理 Quill Base64 圖片（解析 contentEdit）
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
          } catch (error) {
              setIsLoading(false);
              logError("文章內圖片上傳失敗", error);
              return
          }
        }

        payload.content = tempDiv.innerHTML.trim();
      };


       if(Object.keys(payload).length === 0){
        setIsLoading(false);
        Swal.fire({
          title: "文章未有變更",
          icon: "info",
          timer: 1500,
          showConfirmButton: false,
        });
        closeEditModal();
        return;
       };
      
      await axios.patch(`${API_BASE_URL}/posts/${selectedArticle.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getBlogArticle(); // 重新加載文章
      setIsLoading(false);
      Swal.fire( alertMsgForAdminInfo);
      closeEditModal(); // 關閉 Modal
    } catch (error) {
      logError("文章更新失敗", error);
      setIsLoading(false);
      Swal.fire(alertMsgForAdminError);
     
    }
  };


  

  const [currentPage, setCurrentPage] = useState(1);//設定當前頁碼
  const articlesPerPage = 10; // 每頁顯示 10 篇文章

  // 🔥 當 `filteredArticles` 變更時，重設 `currentPage`
  useEffect(() => {
    setCurrentPage(1); // 避免切換篩選條件後，還在超出的頁碼導致空白
  }, [filteredArticles]);
   // 🔥 計算當前頁面的文章
   const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    return filteredArticles.slice(startIndex, startIndex + articlesPerPage);
  }, [filteredArticles, currentPage]);

  // 🔥 總頁數
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  //控制新增文章開關
  const  [isModalOpen, setIsModalOpen] = useState(false);

  const [openCategory, setOpenCategory] = useState(null);

  //切換導航區展開分類開關
  const toggleCategory = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };


  return (
    <>
      {isLoading ?  <LoadingSpinner /> :<main className="bg-secondary pt-10 pb-5">
        <div className="container">
          <div className="row flex-md-row-reverse">
            <div className="col-xl-3 col-md-4 mb-5" >
              <div className="blog-home_header d-flex flex-column align-items-center py-10 px-5 rounded-3 border border-gray_light" style={{ backgroundColor: "#FDFBF5" }}>
                <img className="admin-avatar mb-2 rounded-circle border " src={blogUser?.profile_picture 
|| "https://raw.githubusercontent.com/wfox5510/wordSapce-imgRepo/695229fa8c60c474d3d9dc0d60b25f9539ac74d9/default-avatar.svg"} alt="大頭貼" />
                <p className="mb-5">{blogUser.username}</p>
                <ul className="list-unstyled d-flex gap-5 gap-md-3 gap-lg-5 mb-5">
                  <li><FontAwesomeIcon icon={faEnvelope} size="lg" style={{ color: "#e77605", cursor: 'pointer' }} /></li>
                  <li><FontAwesomeIcon icon={faPodcast} size="lg" style={{ color: "#e77605", cursor: 'pointer' }} /></li>
                  <li><FontAwesomeIcon icon={faUserGroup} size="lg" style={{ color: "#e77605", cursor: 'pointer' }} /></li>
                  <li><FontAwesomeIcon icon={faFacebookF} size="lg" style={{ color: "#e77605", cursor: 'pointer' }} /></li>
                  <li><FontAwesomeIcon icon={faInstagram} size="lg" style={{ color: "#e77605", cursor: 'pointer' }} /></li>
                  <li><FontAwesomeIcon icon={faYoutube} size="lg" style={{ color: "#e77605", cursor: 'pointer' }} /></li>
                </ul>
                {!isAuthor && userId && <SponsorModal />}
                <p className="text-gray mt-3 pb-5 border-bottom border-gray">{blogUser.bio}</p>
                <h4 className="text-primary my-5">文章導航區</h4>
                <ul className="blog-home_nav list-unstyled align-self-baseline d-flex flex-column gap-5">
                  {Object.keys(categorizedArticles).map((categoryId, index)=>{
                    const category = categorizedArticles[categoryId];
                    const isOpen = openCategory === categoryId; // 是否展開
                    return (
                      <div className="accordion-item" key={categoryId}>
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button text-gray hover-effect ${isOpen ? "" : "collapsed"}`}
                            type="button"
                            onClick={() => toggleCategory(categoryId)}
                          >
                            {index + 1}. {category.name}
                          </button>
                        </h2>
                        <div className={`accordion-collapse ${isOpen ? "show" : "collapse"}`}>
                          <div className="accordion-body">
                            <ul className="list-unstyled">
                              {category.articles.map((article, subIndex) => (
                                <li key={article.id} className="text-gray">
                                  {index + 1}-{subIndex + 1}.
                                  <Link to={`/article/${article.id}`} className="ms-2 custom-link">
                                    {article.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                    </div>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="col-xl-9 col-md-8">
              {/* Banner 區域 */}
              <section className="blog-home_mainBanner py-10 ps-lg-10  rounded-3 mb-5  border border-gray_light" style={{ backgroundImage:banner?.image_url ? `url(${banner.image_url})` : "none",backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="d-flex flex-column align-items-center align-items-lg-start">
                  <h2 className="fs-5 fs-md-3 text-light mb-5" style={{ zIndex: "99" }}>{banner?.title || "歡迎來到 Blog主頁"}</h2>
                  <h4 className="mb-5 text-light" style={{ zIndex: "99" }}>{banner?.subtitle || "請點擊編輯設定你的 Banner"}</h4>

                  {/* ✅ 只有 Blog 擁有者能看到按鈕 */}
                  {isAuthor && <button type="button"  ref={modalTriggerRef} className="btn btn-lg hover-shadow btn-primary btn-click rounded-2" style={{ zIndex: "99" }}  onClick={openModal}> 
                    {banner ? "編輯" : "建立"}
                  </button>}
                </div>
              </section>


              <section className="position-relative mb-5" >
                {swiperArticles.length > 0? (
                <Swiper key={swiperArticles.length} // ✅ Swiper 內容變動時強制刷新
                  className="blog_swiper rounded-3"
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
                  loop={swiperArticles.length > 1}  // ✅ 確保只有 1 篇時不開啟 loop
                >
                  {swiperArticles.map((article)=>(
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
                   </SwiperSlide  >
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
                </Swiper>):(
                  <div
                    className="d-flex flex-column align-items-center align-items-lg-start blog-home_mainBanner py-10 ps-lg-10 rounded-3 mb-5 border border-gray_light"
                    style={{
                      backgroundColor: "#f0f0f0",
                      textAlign: "center",
                      padding: "50px",
                    }}
                  >
                    <h2 className="fs-5 fs-md-3 text-dark mb-5">請新增文章</h2>
                    <h4 className="text-dark">目前沒有可顯示的文章，請點擊「新增文章」來開始</h4>
                  </div>
                )}
              </section>  
              <div className="blog-home_articleList rounded-3 border border-gray_light py-7 px-8" style={{ backgroundColor: "#FDFBF5" ,zIndex:"-1"}}>

                <div className="articleList_header">
                  <h3 className="text-primary fs-4 fs-md-3 mb-5">文章列表</h3>
                  {isAuthor && (<div className="d-block d-md-flex justify-content-between align-items-center">
                    <select className="form-select blog-home_articleSelect py-3 mb-6" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="">全部內容</option>
                      <option value="published">已發佈</option>
                      <option value="draft">取消發佈</option>
                    </select>
                    <button type="button" className="btn btn-primary btn-click btn-lg mb-5 rounded-2 hover-shadow" onClick={()=> setIsModalOpen(true)}>新增文章</button>
                  </div> )}
                </div>

                {/* 文章卡片區 */}
                <div className="articleList_content">
                  {paginatedArticles.map((article)=>(
                    <Blog_ArticleCard
                      setIsLoading={setIsLoading} 
                      key={article.id} 
                      article={article} 
                      comments={comments[article.id]||[]}  // 把留言傳給 Blog_ArticleCard
                      togglePin={togglePin} //傳遞函式開關給子組件
                      isPinned = {pinnedArticles.includes(article.id)} //傳遞是否釘選
                      token={token}
                      getBlogArticle = {()=> getBlogArticle() }
                      onEdit={ openEditModal}  // 🚀 **將開啟 `Modal` 的函式傳下去**
                      isAuthor={isAuthor}
                      userId={userId}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>}

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
              {/* ✅ 錯誤提醒 */}
              {errors?.banner && <p className="text-danger">{errors?.banner}</p>}
              {imagePreview && <img src={imagePreview} alt="預覽圖片" className="img-fluid mb-3" 
                onError={(e) => (e.target.style.display = "none")} // ✅ 圖片錯誤時隱藏
                style={{display:"block"}}
              />}
              <label htmlFor="標題" className="form-label fw-medium">Blog主頁標題</label>
              <input id="標題" type="text" className="form-control mb-2" placeholder="輸入Blog主頁 標題" value={title} onChange={(e) => setTitle(e.target.value)} />
              {errors?.title && <p className="text-danger">{errors?.title}</p>}
              <label htmlFor="副標題" className="form-label fw-medium">Blog主頁副標</label>
              <input id="副標題" type="text" className="form-control mb-2" placeholder="輸入 Blog主頁 副標題" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              {errors?.subtitle && <p className="text-danger">{errors?.subtitle}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary btn-click" onClick={handleBannerUpdate}>儲存</button>
              <button className="btn btn-secondary btn-click" onClick={closeModal}>關閉</button>
            </div>
          </div>
        </div>
      </div>

      <NewPostModal   getBlogArticle = {()=> getBlogArticle() } token={token} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setIsLoading={setIsLoading}/>

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
                 {/* 錯誤訊息 */}
                {errors?.imageEdit && <p className="text-danger">{errors?.imageEdit}</p>}
                {imagePreviewEdit && <img src={imagePreviewEdit} alt="封面預覽" className="img-fluid mb-3" style={{display:"block"}} onError={(e) => (e.target.style.display = "none")}  />}

                <label htmlFor="title" className="form-label fw-medium">文章標題</label>
                <input id="title" type="text"  className="form-control mb-2"  value={titleEdit} onChange={(e)=> setTitleEdit(e.target.value) }/>
                <label htmlFor="description" className="form-label fw-medium">文章簡介</label>
                <input id="description" type="text"  className="form-control mb-2" value={descriptionEdit} onChange={(e)=> setDescriptionEdit(e.target.value)}/>

                {/* ✅ 這裡用 ref 綁定 Quill */} 
                <div className="mb-3" ref={editorRef} ></div>
              </div>

              <div className="modal-footer">
                  <button className="btn btn-primary btn-click" onClick={handleSubmit}>更新文章</button>
                  <button className="btn btn-sceondary btn-click" onClick={closeEditModal}>關閉</button>
              </div>
            </div>
          </div>   
      </div>


      {/* 🔥分頁元件 */}
     <nav className="d-lg-block mb-3" aria-label="Page navigation">
      <ul className="hot-article-pagination pagination justify-content-center gap-2 mb-0">
        {/* 上一頁 */}
        <li className="page-item">
          <button
            className={`page-link material-symbols-outlined p-0 ps-1 pt-1 rounded-1 ${
              currentPage === 1 ? "disabled" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
          >
            arrow_back_ios
          </button>
        </li>

        {/* 頁碼區塊（顯示 currentPage 前後 2 頁 + 省略號） */}
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNum = index + 1;

          // 顯示目前頁前後 ±2 的頁碼
          if (Math.abs(currentPage - pageNum) <= 2) {
            return (
              <li className="page-item" key={index}>
                <button
                  className={`page-link rounded-1 p-0 ${
                    currentPage === pageNum ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(pageNum);
                  }}
                >
                  {pageNum}
                </button>
              </li>
            );
          }

          // 開頭的省略號（只顯示一次）
          if (currentPage > 3 && pageNum === 1) {
            return (
              <Fragment key={index}>
                <li className="page-item">
                  <button
                    className="page-link rounded-1 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </button>
                </li>
                <li className="page-item">
                  <span className="page-link rounded-1 p-0">...</span>
                </li>
              </Fragment>
            );
          }

          // 結尾的省略號（只顯示一次）
          if (currentPage < totalPages - 2 && pageNum === totalPages) {
            return (
              <Fragment key={index}>
                <li className="page-item">
                  <span className="page-link rounded-1 p-0">...</span>
                </li>
                <li className="page-item">
                  <button
                    className={`page-link rounded-1 p-0 ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(pageNum);
                    }}
                  >
                    {pageNum}
                  </button>
                </li>
              </Fragment>
            );
          }

          // 其他頁碼不顯示
          return null;
        })}

        {/* 下一頁 */}
        <li className="page-item">
          <button
            className={`page-link material-symbols-outlined rounded-1 p-0 ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
            }}
          >
            arrow_forward_ios
          </button>
        </li>
      </ul>
    </nav>
      
      {isLoading  && <LoadingSpinner /> }
    </>
  );
};

export default BlogHome;