import { useEffect, useState,Fragment} from "react";
import { useSelector } from "react-redux";
import axios from "axios";
const { VITE_API_BASE_URL } = import.meta.env;
import Admin_ArticleCard from "../../component/AdminArticleCard/Admin_ArticleCard";
import Swal from "sweetalert2";
import { alertMsgForVerify } from "../../utils/alertMsg";
import LoadingSpinner from '../../component/LoadingSpinner/LoadingSpinner';
import { logError } from "../../utils/sentryHelper";


const AdminCollection = () => {
  const { token } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [collectionData, setCollectionData] = useState([]);
  useEffect(() => {
    (async () => {
      if (!token) {
        Swal.fire(alertMsgForVerify);
        return;
      };
      try {
        setIsLoading(true);
        const res = await axios.get(`${VITE_API_BASE_URL}/posts/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCollectionData(res.data.data);
      } catch (error) {
        logError(error);
      } finally {
        setIsLoading(false);
      };
    })();
  }, [token]);
  return (
    <>
      {isLoading && <LoadingSpinner />}
      <h1 className="fs-4 fs-md-1 text-primary fw-bold mb-5">我的收藏</h1>
      {collectionData.length === 0 ? (
        <h3 className="mt-3 text-gray">目前沒有收藏的文章</h3>
      ) : (
        <>
          {collectionData
            .slice((currentPage - 1) * 10, currentPage * 10)
            .map((item) => {
              return (
                <Admin_ArticleCard
                  key={item.id}
                  collectionData={item}
                  setCollectionData={setCollectionData}
                  collectionDataList={collectionData}
                  setCurrentPage={setCurrentPage}
                />
              )
            })
          }

          {/* 分頁 */}
          <nav aria-label="Page navigation">
            <ul className="hot-article-pagination pagination justify-content-center gap-2 mb-0">
              <li className="page-item">
                <a
                  className={`page-link material-symbols-outlined p-0 ps-1 pt-1 rounded-1 ${currentPage === 1 && "disabled"
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
                length: Math.ceil(collectionData.length / 10),
              }).map((item, index) => {
                const totalPage = Math.ceil(collectionData.length / 10);
                if (currentPage - index - 1 <= 2 && currentPage - index - 1 >= -2)
                  return (
                    <li className="page-item" key={index}>
                      <a
                        className={`page-link rounded-1 p-0 ${currentPage === index + 1 && "active"
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
                          className={`page-link rounded-1 p-0 ${currentPage === index + 1 && "active"
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
                          className={`page-link rounded-1 p-0 ${currentPage === index + 1 && "active"
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
                  className={`page-link material-symbols-outlined rounded-1 p-0 ${currentPage === Math.ceil(collectionData.length / 10) &&
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
      )}
    </>
  );
};

export default AdminCollection;