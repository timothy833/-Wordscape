import { useState } from 'react'
import axios from 'axios'
const { VITE_API_SERVER_URL } = import.meta.env;
//頁面跳轉登入

const SignupPage = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({ username:"", email: "", password: "" });

    const formInputChange = (e) => {
        const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
        };
    const signUpHandle = async() => {
        console.log('sign test');
        try{
            const url = `${VITE_API_SERVER_URL}/api/users/register`;
            const data = {
                "username": formData.username,
                "email": formData.email,
                "password": formData.password,  
              }

            const signUpRes = await axios.post(url, data, {
                    headers: {
                    "Content-Type": "application/json"
                    }
                }
            );
            
            alert('註冊成功');
            handleClose(); //成功時再關閉視窗 如果輸入錯誤需要提示
        }catch(error){
            console.log('error in sign up', error.response?.data || error.message);
        }
    }
    
    if (!show) return null; // 不顯示時直接返回null
    
    return (
        <div 
            className="position-fixed top-0 start-0 w-100 h-100" 
            style={{ 
                zIndex: 1050, 
                backgroundColor: 'white',
                overflow: 'auto'
            }}>
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
                                    <button type="button" className="btn-close login-btn" onClick={handleClose} aria-label="Close"></button>
                                    <h5 className="card-title fs-5 fw-normal mb-10">建立新帳戶</h5>
                                    <div className="form-floating mb-4">
                                        <input 
                                        type="email" 
                                        className="form-control border-0" 
                                        id="signEmail" 
                                        name="email"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={formInputChange}
                                        />
                                        <label htmlFor="signEmail">Email address</label>
                                    </div>
                                    <div className="form-floating mb-4">
                                        <input 
                                        type="text" 
                                        className="form-control border-0" 
                                        id="signUsername" 
                                        name="username"
                                        placeholder="name"
                                        value={formData.username}
                                        onChange={formInputChange}
                                        />
                                        <label htmlFor="signUsername">User name</label>
                                    </div>
                                    <div className="form-floating mb-4">
                                        <input 
                                        type="password" 
                                        className="form-control border-0" 
                                        id="signPassword" 
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={formInputChange}
                                        />
                                        <label htmlFor="signPassword">Password</label>
                                    </div>
                                    <div className="form-floating mb-5">
                                        <input 
                                        type="password" 
                                        className="form-control border-0" 
                                        id="signConfirmPassword" 
                                        placeholder="Password"
                                        />
                                        <label htmlFor="signConfirmPassword">Confrim Password</label>
                                    </div>
                                    
                                    <div className="d-grid mb-5">
                                        <button onClick={signUpHandle} type="button" className="btn btn-primary py-3">註冊</button>
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
        </div>
    );
};

export default SignupPage;