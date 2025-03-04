import avatar from "../../assets/images/avatar-1.png";
const Blog_CommentReply = () => {
  return (
    <div className="d-flex flex-column gap-3 py-5 mt-5 mt-md-0 border-top border-gray_light">
      <div className="d-flex">
        <div className="d-flex align-items-center gap-2">
          <img className="avatar" src={avatar} alt="avatar" />
          <a href="#">張語森</a>
        </div>
      </div>
      <p>AI生成的未來，我們需要更多溫度。</p>
      <div className="d-flex align-items-center gap-5">
        <div className="d-flex text-primary gap-1">
          <span className="material-symbols-outlined">
            favorite
          </span>
          <p>2</p>
        </div>
        <div className="d-flex text-gray gap-1">
          <span className="material-symbols-outlined">
            chat_bubble
          </span>
          <p>2</p>
        </div>
        <p className="text-gray">回覆</p>
      </div>
    </div>
  );
};

export default Blog_CommentReply;
