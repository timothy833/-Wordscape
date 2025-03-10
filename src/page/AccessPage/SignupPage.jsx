import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
const { VITE_API_BASE_URL } = import.meta.env;
//TODO 頁面跳轉登入

const SignupPage = ({ show, handleClose, handleShowLoginModal }) => {
    SignupPage.propTypes = {
        show: PropTypes.bool.isRequired, 
        handleClose: PropTypes.func.isRequired,
        handleShowLoginModal: PropTypes.func.isRequired,
    };

    const [formData, setFormData] = useState({ username:"", email: "", password: "", confirmPassword:"" });
    const [formErrors, setFormErrors] = useState({});
    const [validated, setValidated] = useState(false);

    const formInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
 
    const signUpHandle = async(event) => {
        event.preventDefault();
        
        // 設置表單已嘗試驗證
        setValidated(true);
        
        // 執行表單驗證
        if (!validateForm()) {
            return;
        }
        
        try{
            const url = `${VITE_API_BASE_URL}/users/register`;
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
        console.log('signupRes',signUpRes);
        
        alert('註冊成功');
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
        setValidated(false);
        setFormErrors({});
        handleClose(); //成功時再關閉視窗 如果輸入錯誤需要提示
        }catch(error){
            console.log('error in sign up', error.response?.data || error.message);
        }
    };

    const guideToLoginHandle = () =>{
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
        handleShowLoginModal();
        handleClose();
    };
    
    // if (!show) return null; // 不顯示時直接返回null
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // 驗證表單
    const validateForm = () => {
        let formIsValid = true;
        let newFormErrors = {};
        
        if (!formData.email || !emailRegex.test(formData.email)) {
            newFormErrors.email = '請輸入有效的 Email 格式';
            formIsValid = false;
        }
        
        if (!formData.username) {
            newFormErrors.username = '使用者名稱為必填項';
            formIsValid = false;
        }
        
        if (!formData.password || !passwordRegex.test(formData.password)) {
            newFormErrors.password = '密碼需至少 8 個字元，並包含字母與數字';
            formIsValid = false;
        }
        
        if (!formData.confirmPassword) {
            newFormErrors.confirmPassword = '確認密碼為必填項';
            formIsValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newFormErrors.confirmPassword = '密碼與確認密碼不符';
            formIsValid = false;
        }
        
        setFormErrors(newFormErrors);
        return formIsValid;
    };

    return (
        <div className={`modal-container ${show ? "show" : ""} w-100 h-100`}>
            <div 
            className="modal-content h-100">
                <div className="login position-relative h-100">
                    <div className="container-fluid h-100">
                        <div className="row h-100 w-100 justify-content-center">
                            {/* 左側區域 */}
                            <div className="d-none d-lg-block col-md-4 ps-5" style={{ marginTop: '25vh' }}>
                                <div className="h1 fw-bold mb-3 text-dark">歡迎加入我們！</div>
                                <div className="fs-3 fw-normal mb-4 text-dark lh-sm">一起踏上這段奇妙的旅程<br/>發現更多有趣的事物！</div>
                                <div className="d-flex flex-column">
                                    <div className="h6 fw-light mb-3">已經有帳戶了？</div>
                                    <a onClick={guideToLoginHandle} href="#" className="h6 text-primary fw-bold mb-0">立即登入</a>
                                </div>
                            </div>
                            
                            {/* 右側區域 */}
                            <div className="col-md-4 d-flex align-items-center h-100 position-relative">
                                <div className="card shadow-lg rounded-4 border-0 w-100 bg-white login-card mx-5">
                                    <div className="card-body">
                                        <form id="signupForm" noValidate onSubmit={signUpHandle}>
                                            <button type="button" className="btn-close login-btn-close" 
                                            onClick={()=>{
                                                handleClose();
                                                setFormData({ username: "", email: "", password: "", confirmPassword: "" });
                                                setFormErrors({});
                                            }} 
                                                aria-label="Close">
                                            </button>
                                            <h5 className="card-title fs-5 fw-normal mb-10">建立新帳戶</h5>
                                            
                                            <div className="form-floating mb-4">
                                                <input 
                                                    type="email" 
                                                    className={`form-control border-0 ${validated && formErrors.email ? "is-invalid" : ""}`}
                                                    id="signEmail" 
                                                    name="email"
                                                    placeholder="name@example.com"
                                                    value={formData.email}
                                                    onChange={formInputChange}
                                                    required
                                                />
                                                <label htmlFor="signEmail">Email address</label>
                                                <div className="invalid-feedback">{formErrors.email}</div>
                                            </div>
                                            
                                            <div className="form-floating mb-4">
                                                <input 
                                                    type="text" 
                                                    className={`form-control border-0 ${validated && formErrors.username ? "is-invalid" : ""}`}
                                                    id="signUsername" 
                                                    name="username"
                                                    placeholder="name"
                                                    value={formData.username}
                                                    onChange={formInputChange}
                                                    required
                                                />
                                                <label htmlFor="signUsername">User name</label>
                                                <div className="invalid-feedback">{formErrors.username}</div>
                                            </div>
                                            
                                            <div className="form-floating mb-4">
                                                <input 
                                                    type="password" 
                                                    className={`form-control border-0 ${validated && formErrors.password ? "is-invalid" : ""}`}
                                                    id="signPassword" 
                                                    name="password"
                                                    placeholder="Password"
                                                    value={formData.password}
                                                    onChange={formInputChange}
                                                    required
                                                />
                                                <label htmlFor="signPassword">Password</label>
                                                <div className="invalid-feedback">{formErrors.password}</div>
                                            </div>
                                            
                                            <div className="form-floating mb-5">
                                                <input 
                                                    type="password" 
                                                    className={`form-control border-0 ${validated && formErrors.confirmPassword ? "is-invalid" : ""}`}
                                                    id="signConfirmPassword" 
                                                    name="confirmPassword"
                                                    placeholder="Password"
                                                    value={formData.confirmPassword}
                                                    onChange={formInputChange}
                                                    required
                                                />
                                                <label htmlFor="signConfirmPassword">Confirm Password</label>
                                                <div className="invalid-feedback">{formErrors.confirmPassword}</div>
                                            </div>
                                            
                                            <div className="d-grid mb-5">
                                                <button type="submit" className="btn btn-primary py-3">註冊</button>
                                            </div>
                                        </form>
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
        </div>
    );
};

export default SignupPage;