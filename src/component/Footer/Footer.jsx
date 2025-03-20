import logo_light from "../../assets/images/logo-light.svg";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-primary">
      <div className="container">
        <div className="d-flex flex-column align-items-center pt-10 pb-15">
          <picture>
            <source
              media="(max-width: 991px)"
              srcSet={logo_light}
              width="128px"
            />
            <img src={logo_light} alt="" />
          </picture>
          <ul className="list-unstyled list-inline footer-linklist">
            <li className="list-inline-item list-item me-0"><Link to="/" style={{cursor: 'pointer'}}>關於我們</Link></li>
            <li className="list-inline-item list-item me-0"><Link to="/" style={{cursor: 'pointer'}}>合作夥伴</Link></li>
            <li className="list-inline-item list-item me-0"><Link to="/" style={{cursor: 'pointer'}}>聯絡我們</Link></li><br className="d-lg-none" />
            <li className="list-inline-item list-item me-0"><Link to="/" style={{cursor: 'pointer'}}>最新消息</Link></li>
            <li className="list-inline-item list-item me-0"><Link to="/articleList" style={{cursor: 'pointer'}}>文章列表</Link></li>
            <li className="list-inline-item list-item me-0"><Link to="/" style={{cursor: 'pointer'}}>相關連結</Link></li>
          </ul>
          <span className="text-light fs-9 fw-light">Copyright @2024 Search for Meow All rights reserved.｜Privacy｜Term</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
