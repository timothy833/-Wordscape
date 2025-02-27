import avatar from "../../assets/images/avatar-1.png";
const CommentBox = ({children,content}) => {
  return (
    <>
      <div className="d-flex flex-column gap-3 mb-5">
        <div className="d-flex align-items-center gap-2">
          <img className="avatar" src={avatar} alt="avatar" />
          <a href="#">張語森</a>
        </div>
        <p>{content}</p>
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
          <a href="#" className="text-gray">
            回覆
          </a>
        </div>
      </div>
      <div className="d-flex flex-column gap-3 ms-5 mb-5">
        {children}
        <a href="#" className="text-primary">
          全部留言
        </a>
      </div>
    </>
  );
};

export default CommentBox;
