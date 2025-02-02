import "./ArticleCard.scss";
import articleImg from "../../assets/images/article/article-thumbnail-1.jpeg";
import avartar from "../../assets/images/avatar-1.png";
const ArticleCard = () => {
  return (
    <>
      <div className="card p-3 shadow-sm border-0 rounded-3">
        <img
          src={articleImg}
          className="card-img-top rounded-1 mb-5"
          alt="articleImg"
        />
        <div className="card-body p-0">
          <h5 className="card-title text-truncate-2lines fw-bold mb-3 text-primary">
            提升專注力的五個簡單方法，讓你事半功倍
          </h5>
          <p className="card-text mb-5 text-truncate-2lines">
            專注力是現代生活中不可或缺的能力，但往往被繁忙的生活打散。這篇文章分享五個實用又簡單的技巧，幫助你在工作和生活中找回專注，實現更高效率。
          </p>
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center" style={{maxWidth:"55%"}}>
              <img src={avartar} className="me-2" alt="avartar" width="40px" height="40px" />
              <span className="text-nowrap" style={{textOverflow:"ellipsis",overflow: "hidden"}}>斜槓小文青</span>
            </div>
            <div className="d-flex gap-2">
              <span className="text-primary d-flex align-items-center gap-1">
                143<span className="material-icons-outlined">favorite</span>
              </span>
              <span className=" text-primary d-flex align-items-center gap-1">
                16
                <span className="material-icons-outlined">chat_bubble</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleCard;
