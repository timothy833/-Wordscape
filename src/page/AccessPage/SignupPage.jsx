const SignupPage = () => {
    return (
        <div className="login vh-100 position-relative">
            <div className="container-fluid h-100">
                <div className="row h-100 w-100 justify-content-center">
                    {/* 左側區域 */}
                    <div className="col-md-4 ps-5" style={{ marginTop: '25vh' }}>
                        <div className="h1 fw-bold mb-3 text-dark">歡迎加入我們！</div>
                        <div className="fs-3 fw-normal mb-4 text-dark lh-sm">一起踏上這段奇妙的旅程<br/>發現更多有趣的事物！</div>
                        <div className="d-flex flex-column">
                            <div className="h6 fw-light mb-3">已經有帳戶了？</div>
                            <a href="#" className="h6 text-primary fw-bold mb-0">立即登入</a>
                        </div>
                    </div>
                    
                    {/* 右側區域 */}
                    <div className="col-md-4 d-flex align-items-center h-100 position-relative">
                        <div className="card shadow-lg rounded-4 border-0 w-100 bg-white login-card mx-5">
                            <div className="card-body">
                                <button type="button" className="btn-close login-btn" aria-label="Close"></button>
                                <h5 className="card-title fs-5 fw-normal mb-10">建立新帳戶</h5>
                                <div className="form-floating mb-4">
                                    <input 
                                    type="email" 
                                    className="form-control border-0" 
                                    id="floatingInput" 
                                    placeholder="name@example.com"
                                    />
                                    <label htmlFor="floatingInput">Email address</label>
                                </div>
                                <div className="form-floating mb-4">
                                    <input 
                                    type="text" 
                                    className="form-control border-0" 
                                    id="floatingInput" 
                                    placeholder="name"
                                    />
                                    <label htmlFor="floatingInput">User name</label>
                                </div>
                                <div className="form-floating mb-4">
                                    <input 
                                    type="password" 
                                    className="form-control border-0" 
                                    id="floatingPassword" 
                                    placeholder="Password"
                                    />
                                    <label htmlFor="floatingPassword">Password</label>
                                </div>
                                <div className="form-floating mb-5">
                                    <input 
                                    type="password" 
                                    className="form-control border-0" 
                                    id="floatingPassword" 
                                    placeholder="Password"
                                    />
                                    <label htmlFor="floatingPassword">Confrim Password</label>
                                </div>
                                
                                <div className="d-grid mb-5">
                                    <button type="button" className="btn btn-primary py-3">註冊</button>
                                </div>
                                <div className="text-center my-5">
                                    <span className="text-gray fw-light">或以其他平台註冊</span>
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

export default SignupPage;