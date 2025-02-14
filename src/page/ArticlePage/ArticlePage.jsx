import Navbar from "../../component/Navbar/Navbar";
import CommentBox from "../../component/CommentBox/CommentBox";
const ArticlePage = () => {
  return (
    <>
      <Navbar />
      <section>
        <div className="container py-15 ">
          <h3 className="fs-3 text-primary fw-bold mb-5">快來分享你的想法</h3>
          <CommentBox></CommentBox>
        </div>
      </section>
    </>
  );
};
export default ArticlePage;
