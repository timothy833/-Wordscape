import { useEffect, useState, useRef} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // ✅ Quill 樣式
// import "quill/dist/quill.bubble.css"; // ✅ 確保 Quill 內建樣式加載
// import "highlight.js/styles/github.css"; // ✅ 確保 Syntax 高亮樣式可用
import axios from "axios";
import { Modal } from "bootstrap";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const getCookie = (name) => {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1] || "";
};


  
const NewPostModal = ()=> {
    const [token , setToken] =useState("");
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState(""); // ✅ 分類
    const [imagePreview, setImagePreview] = useState(null); // ✅ 預覽圖片
    const [externalImage, setExternalImage] = useState(""); // ✅ 外部圖片 URL（手動輸入）
    const [selectedFile, setSelectedFile] = useState(null); // ✅ 暫存本地選擇的圖片
    const [content, setContent] = useState(""); // ✅ 確保 Quill 內容被更新

    const editorRef = useRef(null);
    const fileInputRef = useRef(null); // ✅ 用來清空 file input
    const modalRef = useRef(null); // ✅ 用來控制 Modal 手動開關
    const modalInstance = useRef(null);
    const quillInstance = useRef(null);


    //在元件載入時讀取token
    useEffect(()=>{
        const storedToken = getCookie("Wordscape");
        setToken(storedToken);
    }, []);

    // ✅ 監聽 Modal 開關，確保關閉時清除內容
    useEffect(() => {
        if (!modalRef.current) return;

        const modalElement = modalRef.current; // ✅ 確保引用的是當前 `modalRef`
        modalInstance.current = new Modal(modalElement);

        const handleHidden = () => handleClose();

        // 監聽 `modal` 開啟關閉事件
        modalElement.addEventListener("hidden.bs.modal", handleHidden);
    

        return () => {
          modalElement.removeEventListener("hidden.bs.modal", handleHidden);
        };
    }, []); 


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

        quillInstance.current.on("text-change", () => {
            setContent(quillInstance.current.root.innerHTML); // ✅ 更新 `content`
        });
    }, []);


    // ✅ **手動關閉 Modal，清空所有輸入資料**
    const handleClose = () => {
        setTitle(""); 
        setCategoryId("");
        setImagePreview(null); 
        setExternalImage(""); 
        setSelectedFile(null);
            
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
        modalInstance.current.hide();
    };

    // ✅ 手動輸入封面圖片 URL
    const handleExternalImage = (e) => {
        const url = e.target.value.trim();
        setImagePreview("");
        setExternalImage(url);
        setImagePreview(url); // ✅ 預覽外部圖片
    };

    //  ✅ **上選擇本地封面圖片（但不立即上傳 R2）**
    const handleImageChange = async(e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImagePreview("");
        setExternalImage("");
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
        console.error("圖片上傳失敗", error);
        }
    };

    // 選擇分類
    const handleCategoryChange = (e) => {
        setCategoryId(e.target.value);
    };


    const checkOrCreateCategory = async (name) => {
        try {
            if (!name.trim()) return null; // ✅ 無輸入則直接回傳 null

            // 1️⃣ **先查詢分類是否存在**
            const res = await axios.get(`${API_BASE_URL}/categories/get-category/`,  {
                params: { name }
              });
            if (res.data.data) return res.data.data.id; // ✅ 若已存在，回傳分類 UUID

            // 2️⃣ **若不存在，則建立分類**
            const createRes = await axios.post(`${API_BASE_URL}/categories`, { name }, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            return createRes.data.data.id;
        } catch (error) {
            console.error("分類查詢或建立失敗", error);
            return null;
        }
    };
 
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
        try {
            // 1️⃣ **上傳封面圖到 R2（如果有選擇本地圖片）**
            let uploadFinalImage = selectedFile ? await uploadImageToR2() : externalImage;

            const finalCategoryId = await checkOrCreateCategory(categoryId); // ✅ 確保分類存在，否則傳 `null`

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
                    console.error("文章內圖片上傳失敗", error);
                    return
                }
            }

             // 5️⃣ 送出文章資料
            await axios.post(`${API_BASE_URL}/posts`, {
                title,
                content: tempDiv.innerHTML, // 內含已轉換的圖片 R2 URL
                image_url: uploadFinalImage || "" , // R2 封面圖片 URL
                category_id: finalCategoryId, // ✅ 增加分類
                status: "published"
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            alert("文章發布成功");
            handleClose(); // 發布成功後，關閉 modal 並清空輸入內容
        } catch (error) {
            console.error("發布失敗", error);
            handleClose(); // 發布成功後，關閉 modal 並清空輸入內容
        }
    }



    return (
        <div className="modal fade" ref={modalRef} id="newPostModal" aria-labelledby="newPostModalLabel" aria-hidden="true"   tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">新增文章</h5>
                        <button type="button" className="btn-close"  data-bs-dismiss="modal" aria-label="Close" onClick={ handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <label htmlFor="封面圖片" className="form-label">封面圖片</label>
                        <input ref={fileInputRef} id="封面圖片" type="file" className="form-control mb-2" accept="image/*"  onChange={handleImageChange} />
                        <input type="text" className="form-control mb-2" placeholder="輸入封面圖片 URL" value={externalImage} onChange={handleExternalImage} />
                        {imagePreview && <img src={imagePreview} alt="預覽圖片" className="img-fluid mb-3"/>}
                        <input type="text" className="form-control mb-2" placeholder="文章標題" value={title} onChange={(e)=> setTitle(e.target.value)} />
                        <input type="text" className="form-control mb-2" placeholder="文章分類標籤" value={categoryId} onChange={ handleCategoryChange} />
                                     
                        {/* ✅ 修正 Quill 工具列問題 */}
                        <div  ref={editorRef}><div/>
                    </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close" onClick={handleSubmit}>發布文章</button>
                        <button className="btn btn-secondary"  data-bs-dismiss="modal" aria-label="Close" onClick={ handleClose} > 關閉 </button>
                    </div>
                </div>
            </div>
        </div>
    )
};



export default NewPostModal;