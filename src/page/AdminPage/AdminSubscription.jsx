import SubscriptionHistoryCard from "../../component/SubscriptionCard/SubscriptionHistoryCard";
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import LoadingSpinner from '../../component/LoadingSpinner/LoadingSpinner';
import { logError } from "../../utils/sentryHelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminSubscription = () => {
  const [isLoading,setIsLoading] = useState(false);
  const [paymentReceivedData, setPaymentReceivedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const getPaymentReceivedData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/payments/received`);
      setPaymentReceivedData(res.data.data);
    } catch (error) {
      logError(error);
    }finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getPaymentReceivedData();
  }, []);
  return (
    <>
     {isLoading && <LoadingSpinner />}
      <div className="d-none d-md-flex justify-content-between align-items-center">
        <h1 className="fs-4 fs-md-1 text-primary fw-bold mb-5 mb-md-10">
          收款紀錄
        </h1>
        <a style={{cursor:"pointer"}} className="link-primary-hover">
          問題回報
        </a>
      </div>

      <div className="subscription-history">
        {paymentReceivedData
          .slice((currentPage - 1) * 10 , currentPage * 10)
          .map((paymentReceivedDataItem) => {
            return (
              <SubscriptionHistoryCard
                key={paymentReceivedDataItem.id}
                payerId={paymentReceivedDataItem.user_id}
                paymentDate={paymentReceivedDataItem.created_at}
                amount={paymentReceivedDataItem.amount}
              />
            );
          })}
        <div className="text-center my-5 pt-1 d-md-none">
          <a href="#" className="link-primary-hover">
            問題回報
          </a>
        </div>
      </div>
      <nav className="d-none d-lg-block" aria-label="Page navigation">
        <ul className="hot-article-pagination pagination justify-content-center gap-2 mb-0">
          <li className="page-item">
            <a
              className={`page-link material-symbols-outlined p-0 ps-1 pt-1 rounded-1 ${
                currentPage === 1 && "disabled"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(currentPage - 1);
              }}
            >
              arrow_back_ios
            </a>
          </li>
          {Array.from({
            length: Math.ceil(paymentReceivedData.length / 10),
          }).map((item, index) => {
            const totalPage = Math.ceil(paymentReceivedData.length / 10);
            if (currentPage - index - 1 <= 2 && currentPage - index - 1 >= -2)
              return (
                <li className="page-item" key={index}>
                  <a
                    className={`page-link rounded-1 p-0 ${
                      currentPage === index + 1 && "active"
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(index + 1);
                    }}
                  >
                    {index + 1}
                  </a>
                </li>
              );
            else if (currentPage < totalPage - 2 && index + 1 === totalPage)
              return (
                <Fragment key={index}>
                  <li className="page-item">
                    <a
                      className={`page-link rounded-1 p-0`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      ...
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className={`page-link rounded-1 p-0 ${
                        currentPage === index + 1 && "active"
                      }`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(index + 1);
                      }}
                    >
                      {index + 1}
                    </a>
                  </li>
                </Fragment>
              );
            else if (currentPage > 3 && index === 0)
              return (
                <Fragment key={index}>
                  <li className="page-item">
                    <a
                      className={`page-link rounded-1 p-0 ${
                        currentPage === index + 1 && "active"
                      }`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(index + 1);
                      }}
                    >
                      {index + 1}
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className={`page-link rounded-1 p-0`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      ...
                    </a>
                  </li>
                </Fragment>
              );
          })}
          <li className="page-item">
            <a
              className={`page-link material-symbols-outlined rounded-1 p-0 ${
                currentPage === Math.ceil(paymentReceivedData.length / 10) &&
                "disabled"
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(currentPage + 1);
              }}
            >
              arrow_forward_ios
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default AdminSubscription;
