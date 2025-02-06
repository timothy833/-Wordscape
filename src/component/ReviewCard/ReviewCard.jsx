import "./ReviewCard.scss";
const ReviewCard = ({ reviewStar, avatar, width }) => {
  return (
    <div className="card border-0 shadow" style={{width:{width}}}>
      <div className="card-body p-3 pb-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center">
            <img
              src={avatar}
              alt=""
              className="me-2"
              width="40px"
              height="40px"
            />
            <span>咖啡香書迷</span>
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
        <p className="card-text reviewCard-text">
          優質社群氛圍，作者專業且互動友善，讓學習變得輕鬆又有趣！
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
