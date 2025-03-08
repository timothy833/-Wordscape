import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
const { VITE_API_BASE_URL } = import.meta.env;
//TODO 頁面跳轉登入

SignupPage.propTypes = {
    show: PropTypes.bool.isRequired, 
    handleClose: PropTypes.func.isRequired,
};
const SignupPage = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({ username:"", email: "", password: "", confirmPassword:"" });
    const [errors, setErrors] = useState({});
    const [validated, setValidated] = useState(false);

    const formInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // 如果已經開始驗證過，則實時更新錯誤信息
        if (validated) {
            validateField(name, value);
        }
    };

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // 驗證單個字段
    const validateField = (name, value) => {
        let newErrors = { ...errors };
        
        switch (name) {
            case 'email':
                newErrors.email = !value || !emailRegex.test(value) ? '請輸入有效的 Email 格式' : '';
                break;
            case 'username':
                newErrors.username = !value ? '使用者名稱為必填項' : '';
                break;
            case 'password':
                newErrors.password = !value || !passwordRegex.test(value) 
                    ? '密碼需至少 8 個字元，並包含字母與數字' : '';
                
                // 如果確認密碼已填寫，同時檢查是否匹配
                if (formData.confirmPassword) {
                    newErrors.confirmPassword = value !== formData.confirmPassword 
                        ? '密碼與確認密碼不符' : '';
                }
                break;
            case 'confirmPassword':
                newErrors.confirmPassword = !value 
                    ? '確認密碼為必填項' 
                    : (value !== formData.password ? '密碼與確認密碼不符' : '');
                break;
            default:
                break;
        }
        
        setErrors(newErrors);
        return !newErrors[name]; // 返回此字段是否有效
    };

    // 驗證整個表單
    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};
        
        // 驗證 email
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = '請輸入有效的 Email 格式';
            formIsValid = false;
        }
        
        // 驗證用戶名
        if (!formData.username) {
            newErrors.username = '使用者名稱為必填項';
            formIsValid = false;
        }
        
        // 驗證密碼
        if (!formData.password || !passwordRegex.test(formData.password)) {
            newErrors.password = '密碼需至少 8 個字元，並包含字母與數字';
            formIsValid = false;
        }
        
        // 驗證確認密碼
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = '確認密碼為必填項';
            formIsValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '密碼與確認密碼不符';
            formIsValid = false;
        }
        
        setErrors(newErrors);
        return formIsValid;
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

            const signupRes = await axios.post(url, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log('signupRes',signupRes);
            
            alert('註冊成功');

            setFormData({ username: "", email: "", password: "", confirmPassword: "" });
            setValidated(false);
            setErrors({});
            handleClose();
        }catch(error){
            alert(error.message)
            console.log('error in sign up', error.response?.data || error.message);
        }
    }
    
    const guideToLoginHandle = () => {
        // TODO: 實現登入頁面跳轉
        handleClose();
        // 如果有父組件傳入的切換登入頁面函數，可以呼叫它
        // 例如: onSwitchToLogin && onSwitchToLogin();
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
                                <a onClick={guideToLoginHandle} href="#" className="h6 text-primary fw-bold mb-0">立即登入</a>
                            </div>
                        </div>
                        
                        {/* 右側區域 */}
                        <div className="col-md-4 d-flex align-items-center h-100 position-relative">
                            <div className="card shadow-lg rounded-4 border-0 w-100 bg-white login-card mx-5">
                                <div className="card-body">
                                    <form id="signupForm" noValidate onSubmit={signUpHandle}>
                                        <button type="button" className="btn-close login-btn-close" onClick={handleClose} aria-label="Close"></button>
                                        <h5 className="card-title fs-5 fw-normal mb-10">建立新帳戶</h5>
                                        
                                        <div className="form-floating mb-4">
                                            <input 
                                                type="email" 
                                                className={`form-control border-0 ${validated && errors.email ? "is-invalid" : ""}`}
                                                id="signEmail" 
                                                name="email"
                                                placeholder="name@example.com"
                                                value={formData.email}
                                                onChange={formInputChange}
                                                required
                                            />
                                            <label htmlFor="signEmail">Email address</label>
                                            <div className="invalid-feedback">{errors.email}</div>
                                        </div>
                                        
                                        <div className="form-floating mb-4">
                                            <input 
                                                type="text" 
                                                className={`form-control border-0 ${validated && errors.username ? "is-invalid" : ""}`}
                                                id="signUsername" 
                                                name="username"
                                                placeholder="name"
                                                value={formData.username}
                                                onChange={formInputChange}
                                                required
                                            />
                                            <label htmlFor="signUsername">User name</label>
                                            <div className="invalid-feedback">{errors.username}</div>
                                        </div>
                                        
                                        <div className="form-floating mb-4">
                                            <input 
                                                type="password" 
                                                className={`form-control border-0 ${validated && errors.password ? "is-invalid" : ""}`}
                                                id="signPassword" 
                                                name="password"
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={formInputChange}
                                                required
                                            />
                                            <label htmlFor="signPassword">Password</label>
                                            <div className="invalid-feedback">{errors.password}</div>
                                        </div>
                                        
                                        <div className="form-floating mb-5">
                                            <input 
                                                type="password" 
                                                className={`form-control border-0 ${validated && errors.confirmPassword ? "is-invalid" : ""}`}
                                                id="signConfirmPassword" 
                                                name="confirmPassword"
                                                placeholder="Password"
                                                value={formData.confirmPassword}
                                                onChange={formInputChange}
                                                required
                                            />
                                            <label htmlFor="signConfirmPassword">Confirm Password</label>
                                            <div className="invalid-feedback">{errors.confirmPassword}</div>
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
    );
};

export default SignupPage;