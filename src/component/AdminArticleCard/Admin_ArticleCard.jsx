import articleImg from "../../assets/images/article/article-thumbnail-1.jpeg";

const Admin_ArticleCard = () => {
  return (
    <>
      <div className="admin_articleCard card border-gray_light p-3  mb-5 rounded-3">
        <div className="row flex-column-reverse flex-lg-row">
          <div className="col-lg-8">
            <div className="card-body p-0">
              <h5 className="card-title text-truncate-2lines fw-bold mb-3 text-primary">
                提升專注力的五個簡單方法，讓你事半功倍
              </h5>
              <p className="card-text mb-5 text-truncate-2lines">
                專注力是現代生活中不可或缺的能力，但往往被繁忙的生活打散。這篇文章分享五個實用又簡單的技巧，幫助你在工作和生活中找回專注，實現更高效率。
              </p>
              <div className="adminArticleCardFooter d-flex  align-items-center gap-3">
                <p className="text-gray">2024/12/22</p>
                <div className="d-flex text-gray gap-1">
                  <p>1.8K</p>
                  <span className="material-symbols-outlined">
                    favorite
                  </span>
                </div>
                <div className="d-flex text-gray gap-1">
                  <p>3</p>
                  <span className="material-symbols-outlined">
                    chat_bubble
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <img
              src={articleImg}
              className="card-img-top rounded-1 mb-5"
              alt="articleImg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin_ArticleCard;
