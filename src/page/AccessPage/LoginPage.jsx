const LoginPage = () => {
    return (
        <div className="login vh-100 position-relative">
            <div className="container-fluid h-100">
                <div className="row h-100 w-100 justify-content-center">
                    {/* 左側區域 */}
                    <div className="col-md-4 ps-5" style={{ marginTop: '25vh' }}>
                        <div className="h1 fw-bold mb-3 text-dark">歡迎回來！</div>
                        <div className="fs-3 fw-normal mb-4 text-dark">立即探索更多精彩內容</div>
                        <div className="d-flex flex-column">
                            <div className="h6 fw-light mb-3">還沒有帳戶嗎？</div>
                            <a href="#" className="h6 text-primary fw-bold mb-0">立即註冊</a>
                        </div>
                    </div>
                    
                    {/* 右側區域 */}
                    <div className="col-md-4 d-flex align-items-center h-100 position-relative">
                        <div className="card shadow-lg rounded-4 border-0 w-100 bg-white login-card mx-5">
                            <div className="card-body">
                                <button type="button" className="btn-close login-btn" aria-label="Close"></button>
                                <h5 className="card-title fs-5 fw-normal mb-10">登入帳戶</h5>
                                <div className="form-floating mb-10">
                                    <input 
                                    type="email" 
                                    className="form-control border-0" 
                                    id="floatingInput" 
                                    placeholder="name@example.com"
                                    />
                                    <label htmlFor="floatingInput">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input 
                                    type="password" 
                                    className="form-control border-0" 
                                    id="floatingPassword" 
                                    placeholder="Password"
                                    />
                                    <label htmlFor="floatingPassword">Password</label>
                                </div>
                                <div className="d-flex justify-content-end mb-10">
                                    <a href="#" className="text-gray small">忘記密碼</a>
                                </div>
                                <div className="d-grid">
                                    <button type="button" className="btn btn-primary py-3 mb-10">登入</button>
                                </div>
                                <div className="text-center my-5">
                                    <span className="text-gray fw-light">或以其他平台登入</span>
                                </div>
                                <div className="d-flex justify-content-center gap-5">
                                    <a href="#" target="_blank">
                                    <img src="/src/assets/images/AccessPage/Facebook-icon.png" width="40px" height="40px" alt="facebook-login" />
                                    </a>
                                    <a href="#" target="_blank">
                                        <img src="/src/assets/images/AccessPage/Apple-icon.png" width="40px" height="40px" alt="apple-login" />
                                    </a>
                                    <a href="#" target="_blank">
                                        <img src="/src/assets/images/AccessPage/Google-icon.png" width="40px" height="40px" alt="google-login" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pattern-container">
            </div>
        </div>
    );
};

export default LoginPage;