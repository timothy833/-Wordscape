import { useEffect, useState, useRef} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // ✅ Quill 樣式
// import "quill/dist/quill.bubble.css"; // ✅ 確保 Quill 內建樣式加載
// import "highlight.js/styles/github.css"; // ✅ 確保 Syntax 高亮樣式可用
import axios from "axios";
import { Modal } from "bootstrap";
import PropTypes from "prop-types";
import {alertCreatePost} from "../../utils/alertMsg"
import Swal from "sweetalert2";
import { logError } from "../../utils/sentryHelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// const getCookie = (name) => {
//     return document.cookie
//         .split("; ")
//         .find(row => row.startsWith(name + "="))
//         ?.split("=")[1] || "";
// };


  
const NewPostModal = ({ getBlogArticle, token, isModalOpen, setIsModalOpen, setIsLoading })=> {
    // const [token , setToken] =useState("");
    const [title, setTitle] = useState("");
    const [imagePreview, setImagePreview] = useState(null); // ✅ 預覽圖片
    const [externalImage, setExternalImage] = useState(""); // ✅ 外部圖片 URL（手動輸入）
    const [selectedFile, setSelectedFile] = useState(null); // ✅ 暫存本地選擇的圖片
    const [content, setContent] = useState(""); // ✅ 確保 Quill 內容被更新
    const [tag, setTag] = useState(""); //儲存輸入新增tag標籤
    const [tags, setTags] =  useState([]); //暫存新增文章 tag 列表
    const [categories, setCategories] = useState([]); //存分類列表
    const [categoryId, setCategoryId] = useState(""); // ✅ 當前選擇分類
    const [description, setDescription] = useState("");//設定文章簡介
    const [status, setStatus] = useState(""); //設定文章公布狀態
    const [errors, setErrors] = useState({}); // ❗ 用來儲存錯誤訊息
    

    const editorRef = useRef(null);
    const fileInputRef = useRef(null); // ✅ 用來清空 file input
    const modalRef = useRef(null); // ✅ 用來控制 Modal 手動開關
    const modalInstance = useRef(null);
    const quillInstance = useRef(null);


    //在元件載入時讀取token
    // useEffect(()=>{
    //     const storedToken = getCookie("WS_token");
    //     setToken(storedToken);
    // }, []);

    // ✅ 監聽 Modal 開關，確保關閉時清除內容
    useEffect(() => {
        if (!modalRef.current) return;

        const modalElement = modalRef.current; // ✅ 確保引用的是當前 `modalRef`
        modalInstance.current = new Modal(modalElement, {backdrop: "static"});
        
        if(isModalOpen) {
            modalInstance.current.show();
        }else if (modalInstance.current) {
            modalInstance.current.hide();
        }


    }, [isModalOpen]); 


    //初始化Quill工具內容
    useEffect(() => {
        if (!editorRef.current) return;
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
   
      
        // ✅ 將 `text-change` 事件處理函數存為變數
        const handleTextChange = () => {
            setContent(quillInstance.current.root.innerHTML);
            setErrors((prev) => ({ ...prev, content: "" })); 

            const editor = editorRef.current.querySelector(".ql-editor");
            if (editor) {
                editor.scrollTop = editor.scrollHeight;
            }

            // ✅ 讓 `.modal-content` 滾動到底
            const modalContent = modalRef.current.querySelector(".modal-content");
            if (modalContent) {
                modalContent.scrollTop = modalContent.scrollHeight;
            }
        };

        // ✅ 註冊 Quill `text-change` 事件
        quillInstance.current.on("text-change", handleTextChange);

        // ✅ 移除監聽，防止 Quill 在組件卸載後繼續影響
        return () => {        
            if (quillInstance.current) {
                quillInstance.current.off("text-change", handleTextChange);
            }
        };

    }, []);

    //初始化載入分類列表
    useEffect(()=>{
        const fetchCategories = async ()=>{
            try {
                const res = await axios.get(`${API_BASE_URL}/categories`);
                setCategories(res.data.data || []); //設定分類資料
            } catch (error) {
                logError("載入分類失敗", error);
            }
        }

        fetchCategories();
    }, [])

    // 選擇分類
    const handleCategoryChange = (e) => {
        setCategoryId(e.target.value);
        setErrors((prev) => ({ ...prev, category: "" })); // 🔥 清除分類錯誤
    };


    //處理輸入框tag狀態儲存
    const handleTagChange = (e) => {
        setTag(e.target.value);
    }

    //新增標籤(不發API，只存到`useState`)
    const handleAddTag = ()=> {
        if (!tag.trim() || tags.includes(tag.trim())) return; //避免空標籤或重複
        setTags([...tags, tag.trim()]);//加到`useState`
        setTag(""); //清空輸入框
    }

    //刪除標籤
    const handleDeleteTag = (tagName) =>{
        setTags( tags.filter((t)=> t !== tagName)); //從useState刪除
    }


    // ✅ **清空所有輸入資料**
    const handleClose = () => {
        // ✅ 清空錯誤訊息，避免關閉後錯誤還留著
        setErrors({});

         // ✅ 確保 Bootstrap Modal 也被隱藏
        if (modalInstance.current) {
            modalInstance.current.hide();
        }
        setTitle(""); 
        setCategoryId("");
        setImagePreview(null); 
        setExternalImage(""); 
        setSelectedFile(null);
        setTag("");
        setTags([]);
        setDescription("");
            
        // // ✅ 清空 Quill 內容
        if (quillInstance.current) {
            quillInstance.current.root.innerHTML = "";
        }

        // ✅ 清空 <input type="file"> 的值
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        // ✅ **確保 `modal` 內部沒有元素仍然保留焦點**
        document.activeElement?.blur();
        document.body.focus(); // **強制焦點回到 body**
        // ✅ **手動隱藏 `modal`**
        setIsModalOpen(false);
    };

    // ✅ 手動輸入封面圖片 URL
    const handleExternalImage = async(e) => {
        const url = e.target.value.trim();
        setExternalImage(url); // ✅ 先存 URL，不影响 `imagePreview`
        setErrors((prev) => ({ ...prev, image: "" })); // 清除錯誤
    };

    // ✅ 只有在輸入框失去焦點時，才設定預覽圖片
    const handleExternalImageBlur = async() => {


        const isValid = await validateImage(externalImage);
        if (isValid) {
            setImagePreview(externalImage); // ✅ URL 有效時才預覽
        } else {
            setErrors((prev) => ({ ...prev, image: "⚠️ 圖片 URL 無效，請輸入可預覽的圖片。" }));
            setImagePreview(null);
        }
    };


 

    //  ✅ **上選擇本地封面圖片（但不立即上傳 R2）**
    const handleImageChange = async(e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImagePreview("");
        setExternalImage("");
        setErrors((prev) => ({ ...prev, image: "" })); // 清除錯誤
        setImagePreview(URL.createObjectURL(file)); // 顯示預覽畫面
        setSelectedFile(file); // 先存本地檔案
    };


     // ✅ **真正上傳封面圖片到 R2（等按下 "發布文章" 才上傳）**
    const uploadImageToR2 = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("cover", selectedFile);

        try {
            const res = await axios.post(`${API_BASE_URL}/posts/upload/cover`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            },
        });
        return res.data.url; // 存 R2 URL
        } catch (error) {
        logError("圖片上傳失敗", error);
        }
    };

  

    // 🚀 **檢查圖片是否有效**
    const validateImage = (url) => {
        return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(true); // 圖片可載入，回傳 true
        img.onerror = () => resolve(false); // 圖片載入失敗，回傳 false
        });
    };

      // 🚀 **表單驗證**
    const validateForm = async () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "⚠️ 標題為必填項";
        if (!description.trim()) newErrors.description = "⚠️ 文章簡介為必填項";
        if (!categoryId) newErrors.category = "⚠️ 文章分類為必填項";
        if (!content.trim()) newErrors.content = "⚠️ 文章內容為必填項";

        if (!imagePreview) {
        if (externalImage) {
            const isValid = await validateImage(externalImage);
            if (!isValid) {
            newErrors.image = "⚠️ 請輸入有效的封面圖片 URL";
            }
        } else if (!selectedFile) {
            newErrors.image = "⚠️ 必須上傳封面圖片（本地或 URL）";
        }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // ✅ 若無錯誤則返回 true
    };


    // const checkOrCreateCategory = async (name) => {
    //     try {
    //         if (!name.trim()) return null; // ✅ 無輸入則直接回傳 null

    //         // 1️⃣ **先查詢分類是否存在**
    //         const res = await axios.get(`${API_BASE_URL}/categories/get-category/`,  {
    //             params: { name }
    //           });
    //         if (res.data.data) return res.data.data.id; // ✅ 若已存在，回傳分類 UUID

    //         // 2️⃣ **若不存在，則建立分類**
    //         const createRes = await axios.post(`${API_BASE_URL}/categories`, { name }, { 
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         return createRes.data.data.id;
    //     } catch (error) {
    //         logError("分類查詢或建立失敗", error);
    //         return null;
    //     }
    // };
 
    //監聽quill輸入內容變化
    // useEffect(() => {
    //     if (quill) {
    //         quill.on("text-change", () => {
    //             setContent(quill.root.innerHTML);
    //         });
    //     }
    // }, [quill]);
    



    // **發送文章**
    const handleSubmit = async ()=> {
        setIsLoading(true);
        const isValid = await validateForm();
        if (!isValid){
            setIsLoading(false);
            return;
        } 

        try {
            // 1️⃣ **上傳封面圖到 R2（如果有選擇本地圖片）**
            let uploadFinalImage = selectedFile ? await uploadImageToR2() : externalImage;

            // const finalCategoryId = await checkOrCreateCategory(categoryId); // ✅ 確保分類存在，否則傳 `null`

            // 創建一個臨時 `div` 來解析 HTML(Quill 內部 Base64 圖片)
            const tempDiv = document.createElement("div");

            // ✅ **確保 Quill 內容是最新的**
            tempDiv.innerHTML = content;
            // ✅ **處理 Base64 圖片並替換**
            const imgTags = [...tempDiv.getElementsByTagName("img")];
            
            // 2️⃣ 找出所有 Base64 編碼的圖片
            const base64Images = imgTags
                .map(img => img.getAttribute("src"))
                .filter(src => src.startsWith("data:image"));

            // const base64Images = [];
            // for(let img of imgTags){
            //     const imgSrc = img.getAttribute("src");
            //     if(imgSrc.startsWith("data:image")) {
            //         base64Images.push(imgSrc);
            //     }
            // }
    

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
                    logError("文章內圖片上傳失敗", error);
                    setIsLoading(false);
                    return
                }
            }
             // 5️⃣ 送出文章資料
           const  postResponse =  await axios.post(`${API_BASE_URL}/posts`, {
                title,
                content: tempDiv.innerHTML, // 內含已轉換的圖片 R2 URL
                image_url: uploadFinalImage || "" , // R2 封面圖片 URL
                category_id: categoryId,// ✅ 增加分類
                description,
                status
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            
            const newPostId = postResponse.data.data.id;

            // 發送 API 把所有標籤加到文章**
            if(tags.length > 0) {
               await axios.post(`${API_BASE_URL}/posts/${newPostId}/tags`, { tags }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                //console.log(resTag);
            }
            getBlogArticle();
            setIsLoading(false);
            Swal.fire(alertCreatePost);
            handleClose(); // 發布成功後清空輸入內容
        } catch (error) {
            logError("新增文章失敗", error);
            // handleClose(); //關閉 modal 並清空輸入內容
        }
    }



    return (
        <div className="modal fade" ref={modalRef}  aria-labelledby="newPostModalLabel" aria-hidden="true"   tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content max-h">
                    <div className="modal-header">
                        <h5 className="modal-title">新增文章</h5>
                        <button type="button" className="btn-close"   aria-label="Close" onClick={ handleClose}></button>
                    </div>
                    <div className="modal-body">
                         <label htmlFor="封面圖片" className="form-label fw-medium">封面圖片</label>
                        <div className="d-flex gap-2 justify-content-center align-items-center mb-2">
                            <input ref={fileInputRef} id="封面圖片" type="file" className="form-control" accept="image/*"  onChange={handleImageChange} />
                            <span>或</span>
                            <input type="text" className="form-control" placeholder="輸入封面圖片 URL" value={externalImage} onBlur={handleExternalImageBlur} onChange={handleExternalImage} />
                        </div>
                        {errors.image && <p className="text-danger">{errors.image}</p>}
                        {imagePreview && <img src={imagePreview} alt="預覽圖片" className="img-fluid mb-3" style={{display: "block"}} onError={(e) => (e.target.style.display = "none")}/>}

                        <input type="text" className="form-control mb-2" placeholder="文章標題" value={title} onChange={(e)=>{ setTitle(e.target.value)
                        setErrors((prev) => ({ ...prev, title: "" }));
                        }} />
                        {errors.title && <p className="text-danger">{errors.title}</p>}
                        <input type="text" className="form-control mb-2" placeholder="文章簡介(少於100字)" value={description} onChange={(e)=> {
                            setDescription(e.target.value)
                            setErrors((prev) => ({ ...prev, description: "" }))    
                        }} />
                        {errors.description && <p className="text-danger">{errors.description}</p>}

                        <div className="d-flex gap-2 flex-column flex-md-row">
                            
                            <div className="mb-2">
                                <label className="form-label fw-medium">文章分類</label>
                                {/* 下拉選單 */}
                                <select className="form-select" value={categoryId} onChange={handleCategoryChange}>
                                    <option value="" disabled>請選擇分類</option>
                                    {categories.map((category)=>(
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-danger">{errors.category}</p>}
                            </div>

                            <div className="mb-2">
                                <label className="form-label fw-medium">文章狀態</label>
                                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="published">已發布</option>
                                    <option value="draft">未發布</option>
                                </select>
                            </div>

                            <div className="mb-2">
                                <label htmlFor="文章tag標籤"  className="form-label fw-medium">文章標籤</label>
                                <div className="d-flex gap-2">
                                    <input id="文章tag標籤" type="text" className="form-control mb-2"  placeholder="文章tag標籤" value={tag} onChange={handleTagChange} style={{width: "160px",}}/>
                                    <button className="btn btn-primary mb-2 btn-click" onClick={handleAddTag}>
                                        新增
                                    </button>
                                </div>

                                {/* 顯示已新增的標籤 */}
                                <div className="d-flex flex-wrap gap-2">
                                    {tags.map((t)=>(
                                        <span key={t} className="badge bg-secondary fw-medium text-muted border" style={{fontSize: "14px",}}>
                                            {t}
                                            <button className="btn btn-sm btn-danger ms-2" onClick={()=> handleDeleteTag(t)}>
                                                x
                                            </button>
                                        </span>
                                    ))}
                                </div>
                               
                            </div>

                        </div>
                                     
                        {/* ✅ 修正 Quill 工具列問題 */}
                        <div  ref={editorRef} className="mb-3"></div>
                        {errors.content && <p className="text-danger">{errors.content}</p>}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary btn-click"  aria-label="Close" onClick={handleSubmit}>發布文章</button>
                        <button className="btn btn-secondary btn-click"   aria-label="Close" onClick={ handleClose} > 關閉 </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

NewPostModal.propTypes = {
    getBlogArticle: PropTypes.func,
    token: PropTypes.string,
    isModalOpen: PropTypes.bool,
    setIsModalOpen: PropTypes.func,
    setIsLoading: PropTypes.func
}
  

export default NewPostModal;