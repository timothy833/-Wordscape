import avatar from "../../assets/images/avatar-1.png";


const CurrentSubscriptionCard = () => {
  return (
    <>
      <div className="currentSubscription-card mb-4 mb-lg-5 d-lg-flex align-items-center justify-content-between">
        <div className="d-flex gap-5 align-items-center mb-5 mb-lg-0">
          <img src={avatar} alt="avatar" width={40} />
          <p className="fw-bold">Timothy</p>
          <p className="fw-bold">輕量方案(280/月)</p>
        </div>
        <div className="d-flex justify-content-between align-items-center gap-lg-7">
          <p className="fw-bold">訂閱到期日 2024-01-01</p>
          <button type="button" className="btn btn-primary">取消訂閱</button>
        </div>
      </div>
    </>
  );
};

export default CurrentSubscriptionCard;