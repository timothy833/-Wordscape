import logo_light from "../../assets/images/logo-light.svg";

const Footer = () => {
  return (
    <footer className="bg-primary">
      <div className="container">
        <div className="d-flex flex-column align-items-center">
          <picture>
            <source
              media="(max-width: 991px)"
              srcSet={logo_light}
              width="128px"
            />
            <img src={logo_light} alt="" />
          </picture>
          <ul className="list-unstyled d-flex footer-linklist">
            <li className="list-item"><a href="">關於我們</a></li>
            <li className="list-item"><a href="">合作夥伴</a></li>
            <li className="list-item"><a href="">聯絡我們</a></li>
            <li className="list-item"><a href="">最新消息</a></li>
            <li className="list-item"><a href="">文章列表</a></li>
            <li className="list-item"><a href="">相關連結</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
