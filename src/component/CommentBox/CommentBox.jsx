import avatar from "../../assets/images/avatar-1.png";
const CommentBox = () => {
  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex align-items-center">
        <img className="avatar me-2" src={avatar} alt="avatar" />
        <a href="#">張語森</a>
      </div>
      <p>AI生成的未來，我們需要更多溫度。</p>
      <div className="d-flex gap-5">
        <a href="#" className="d-flex align-items-center text-primary gap-1">
          <span className="material-symbols-outlined icon-fill fs-6">
            favorite
          </span>
          2
        </a>
        <a href="#" className="d-flex align-items-center text-gray gap-1">
          <span className="material-symbols-outlined icon-fill fs-6">
            chat_bubble
          </span>
          1
        </a>
        <a href="#" className="text-gray">回覆</a>
      </div>
    </div>
  );
};

export default CommentBox;
