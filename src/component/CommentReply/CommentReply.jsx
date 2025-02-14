import avatar from "../../assets/images/avatar-1.png";
const CommentReply = () => {
  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex">
        <div className="d-flex align-items-center gap-2 me-5">
          <img className="avatar" src={avatar} alt="avatar" />
          <a href="#">宋書遠</a>
          <span className="text-gray">作者</span>
        </div>
        <a href="#" className="d-flex align-items-center text-primary gap-1">
          <span className="material-symbols-outlined icon-fill fs-6">
            favorite
          </span>
        </a>
      </div>
      <p>很高興您喜歡這篇文章，希望能引發更多思考</p>
    </div>
  );
};

export default CommentReply;
