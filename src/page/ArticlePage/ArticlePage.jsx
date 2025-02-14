import Navbar from "../../component/Navbar/Navbar";
import CommentBox from "../../component/CommentBox/CommentBox";
import CommentReply from "../../component/CommentReply/CommentReply";
const ArticlePage = () => {
  return (
    <>
      <Navbar />
      <section>
        <div className="container py-15 border-bottom">
          <h3 className="fs-3 text-primary fw-bold mb-5">快來分享你的想法</h3>
          <CommentBox>
            <CommentReply />
            <CommentReply />
            <CommentReply />
          </CommentBox>
          <CommentBox>
            <CommentReply />
            <CommentReply />
          </CommentBox>
          <form>
            <label className="d-none" htmlFor="comment">
              留言
            </label>
            <textarea
              name="comment"
              id="comment"
              className="form-control mb-5"
              style={{ resize: "none", height: "120px" }}
              placeholder="我想說......"
            ></textarea>
            <button type="submit" class="btn btn-lg btn-primary">
              送出
            </button>
          </form>
        </div>
      </section>

    </>
  );
};
export default ArticlePage;
