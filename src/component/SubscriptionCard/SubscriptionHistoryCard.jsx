import avatar from "../../assets/images/avatar-1.png";


const SubscriptionHistoryCard = () => {
  return (
    <>
      <div className="currentSubscription-card mb-4 d-lg-flex justify-content-between align-items-center">
        <div className="d-flex gap-5 align-items-center mb-5 mb-lg-0">
          <img src={avatar} alt="avatar" width={40} />
          <p className="fw-bold">Timothy</p>
          <p className="fw-bold">輕量方案(280/月)</p>
        </div>
        <div className="d-flex justify-content-between align-items-center gap-lg-7">
          <p className="fw-bold">2023-12-01~ 2024-01-01</p>
          <button className="btn btn-primary-hover text-light">$1800</button>
        </div>
      </div>
    </>
  );
};

export default SubscriptionHistoryCard;