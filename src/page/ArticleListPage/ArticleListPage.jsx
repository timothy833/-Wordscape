import Navbar from "../../component/Navbar/Navbar";
const ArticleListPage = () => {
  return (
    <>
      <Navbar />
      <section>
        <div className="container pt-17 pb-10">
          <h2 className="fs-7 fw-bold text-dark mb-3">類別選擇</h2>
          <ul className="article-taglist list-unstyled d-flex flex-wrap gap-2 mb-3">
            {Array.from({ length: 3 }).map(() => {
              return (
                <>
                  <li>
                    <a className="article-tag active py-1 px-4 lh-lg fs-8 rounded-pill">
                      生活隨筆
                    </a>
                  </li>
                  <li>
                    <a className="article-tag py-1 px-4 lh-lg fs-8 rounded-pill">
                      心得分享
                    </a>
                  </li>
                  <li>
                    <a className="article-tag py-1 px-4 lh-lg fs-8 rounded-pill">
                      書籍評論
                    </a>
                  </li>
                </>
              );
            })}
            {Array.from({ length: 5 }).map(() => {
              return (
                <>
                  <li>
                    <a className="article-tag py-1 px-4 lh-lg fs-8 rounded-pill">
                      創業心得
                    </a>
                  </li>
                  <li>
                    <a className="article-tag py-1 px-4 lh-lg fs-8 rounded-pill">
                      工作職場
                    </a>
                  </li>
                  <li>
                    <a className="article-tag py-1 px-4 lh-lg fs-8 rounded-pill">
                      學習筆記
                    </a>
                  </li>
                </>
              );
            })}
          </ul>
        </div>
      </section>
      
    </>
  );
};

export default ArticleListPage;
