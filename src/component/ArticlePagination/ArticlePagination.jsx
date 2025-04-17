import { Fragment } from "react";
import PropTypes from "prop-types";

const ArticlePagination = ({
  totalItems,
  itemsPerPage = 10,
  currentPage,
  onPageChange,
  className = "",
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav aria-label="Page navigation">
      <ul
        className={`pagination justify-content-center gap-2 mb-0 ${className}`}
      >
        <li className="page-item">
          <a
            className={`page-link material-symbols-outlined p-0 ps-1 pt-1 rounded-1 ${
              currentPage === 1 && "disabled"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
          >
            arrow_back_ios
          </a>
        </li>
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;
          if (currentPage - pageNumber <= 2 && currentPage - pageNumber >= -2)
            return (
              <li className="page-item" key={index}>
                <a
                  className={`page-link rounded-1 p-0 ${
                    currentPage === pageNumber && "active"
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(pageNumber);
                  }}
                >
                  {pageNumber}
                </a>
              </li>
            );
          else if (currentPage < totalPages - 2 && pageNumber === totalPages)
            return (
              <Fragment key={index}>
                <li className="page-item">
                  <a
                    className="page-link rounded-1 p-0"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    ...
                  </a>
                </li>
                <li className="page-item">
                  <a
                    className={`page-link rounded-1 p-0 ${
                      currentPage === pageNumber && "active"
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </a>
                </li>
              </Fragment>
            );
          else if (currentPage > 3 && pageNumber === 1)
            return (
              <Fragment key={index}>
                <li className="page-item">
                  <a
                    className={`page-link rounded-1 p-0 ${
                      currentPage === pageNumber && "active"
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </a>
                </li>
                <li className="page-item">
                  <a
                    className="page-link rounded-1 p-0"
                    href="#"
                    onClick={(e) => e.preventDefault()}
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
              currentPage === totalPages && "disabled"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
          >
            arrow_forward_ios
          </a>
        </li>
      </ul>
    </nav>
  );
};

ArticlePagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ArticlePagination;
