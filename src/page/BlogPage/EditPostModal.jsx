import { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // ✅ Quill 樣式
import PropTypes from "prop-types";
import axios from "axios";
import { Modal } from "bootstrap";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditPostModal = ({ article, token, getBlogArticle }) => {
    const [title, setTitle] = useState(article.title);
    const [description, setDescription] = useState(article.description);
    const [content, setContent] =useState(article.content);
    const [imagePreview,setImagePreview] = useState(article.image_url);
    const [selectedFile, setSelectedFile] = useState(null);

    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const quillInstance = useRef(null);
    const filfeInputRef = useRef(null);
    const editorRef = useRef(null); // ✅ 用來掛載 Quill 編輯器

    useEffect(()=> {
        if(!modalRef.current) return;
        modalInstance.current = new Modal(modalRef.current);
        return ()=> modalInstance.current.hide();

    },[])

    // ✅ 初始化 Quill 並載入原本文章內容
    useEffect(()=>{
        if(!editorRef.current) return;

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
            }
        })

        quillInstance.current.root.innerHTML = article.content;

        quillInstance.current.on("text-change", ()=>{
            setContent(quillInstance.current.root.innerHTML);
        });

    }, [article.content]); // 🚀 **當文章變更時，重新載入**

    // ✅ 手動關閉 Modal
     const handleClose = ()=> modalInstance.current.hide();

    // ✅ 本地預覽封面圖
    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        if(!file) return;
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    //上傳封面圖到R2
    const uploadImageToR2 = async()=> {
        if(!selectedFile) return imagePreview;

        const formData = new FormData();
        formData.append("cover", selectedFile);
        try {
            const res = await axios.post(`${API_BASE_URL}/posts/upload/cover`, formData, {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            });
            return res.data.url;

        } catch (error) {
            console.error("封面圖片上傳失敗", error);
            return  imagePreview;
        }
    }
    
    //更新文章
    const handleSubmit = async()=> {
        try {
            const finalImageuUrl = await uploadImageToR2();
            
            await axios.patch(`${API_BASE_URL}/posts/${article.id}`, {
                title,
                description,
                content,
                image_url: finalImageuUrl
            }, {
                headers:{
                    Authorization: `Bearer ${token},`
                }
            });
            
            alert("文章更新成功");
            handleClose();
            getBlogArticle();
        }
        catch( error) {
            console.error("文章更新失敗", error);
            alert("文章更新失敗")
        }
    }



    return (
        <div className="nodal fade" ref={modalRef} id="editPostModal" aria-hidden="true" tabIndex="-1" >
            <div className="modal-dialog modal-lg">
                <div className="modal-header">
                    <h5 className="modal-header">編輯文章</h5>
                    <button type="button" className="btn-close" onClick={handleClose}></button>
                </div>
            </div>   
            <div className="modal-body">
                <label htmlFor="封面圖片">封面圖片</label>
                <input type="file" ref={filfeInputRef} id="封面圖片" className="form-control mb-2" accept="image/*" onChange={handleImageChange}/>
                {imagePreview && <img src={imagePreview} alt="封面預覽" className="img-fluid mb-3"   />}

                <label htmlFor="title" className="form-label">文章標題</label>
                <input id="title" type="text"  className="form-control mb-2"  value={title} onChange={(e)=> setTitle(e.target.value)}/>
                <label htmlFor="description" className="form-label">文章簡介</label>
                <input id="description" type="text"  className="form-control mb-2" value={description} onChange={(e)=> setDescription(e.target.value)}/>

                 {/* ✅ 這裡用 ref 綁定 Quill */} 
                <div className="mb-3" ref={editorRef} style={{minHeight: "200px"}}></div>
            </div>

            <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSubmit}>更新文章</button>
                <button className="btn btn-sceondary" onClick={handleClose}>關閉</button>
            </div>
        </div>

    )
}

EditPostModal.propTypes = {
    article: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    getBlogArticle: PropTypes.func.isRequired,
};

export default EditPostModal;