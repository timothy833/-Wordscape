import "./ReviewCard.scss";
const ReviewCard = ({ reviewStar, avatar, width, content ,user_name }) => {
  return (
    <div className="card border-0 shadow" style={{ width: width }}>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center">
            <img
              src={avatar}
              alt=""
              className="me-2 object-fit-cover rounded-pill"
              width="40px"
              height="40px"
            />
            <span>{user_name}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            {Array.from({ length: reviewStar }).map((item, index) => {
              return (
                <span
                  className="material-symbols-outlined text-primary icon-fill fs-7"
                  key={index}
                >
                  grade
                </span>
              );
            })}
            {Array.from({ length: 5 - reviewStar }).map((item, index) => {
              return (
                <span
                  className="material-symbols-outlined text-gray icon-fill fs-7"
                  key={index}
                >
                  grade
                </span>
              );
            })}
          </div>
        </div>
        <p className="card-text reviewCard-text">{content}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
