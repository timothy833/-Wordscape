import "./SponsorModal.scss";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useParams, useLocation } from 'react-router-dom';
import { alertMsgForVerify } from "../../utils/alertMsg";
const { VITE_API_BASE_URL } = import.meta.env;
import Swal from "sweetalert2";
import { logError } from "../../utils/sentryHelper";

const SponsorModal = () => {
  const { isAuthorized, token } = useSelector(state => state.auth);
  const sponsorModalRef = useRef(null);
  const [ isNextStep, setIsNextStep] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    customAmount: "",
    payment: "",
    cardType: "",
    cardNumber: ""
  });
  const { user_id, id } = useParams(); // 從 URL 取得對應的參數
  const location = useLocation(); // 取得當前的路徑
  const [sponsorId, setSponsorId] = useState(null);
  const [sponsorName, setSponsorName] = useState('');

  // Modal Create & Functions
  useEffect(() => {
    new Modal(sponsorModalRef.current, {backdrop: false}); 
  },[]);

  // 獲取贊助對象的ID
  const getSponsorId = async () => {
    let idToSponsor = null;
    
    if (location.pathname.startsWith("/blog/")) {
      idToSponsor = user_id; // `/blog/:user_id`
    } else if (location.pathname.startsWith("/article/")) {
      const postId = id; // `/article/:id`
      try {
        const postData = await axios.get(`${VITE_API_BASE_URL}/posts/${postId}`);
        idToSponsor = postData.data.data.user_id;
      } catch (error) {
        logError('Error getting user id from post:', error);
      }
    }
    
    return idToSponsor;
  };

  // 獲取作者數據
  const getAuthorData = async (idToSponsor) => {
    try {
      const res = await axios.get(
        `${VITE_API_BASE_URL}/users/${idToSponsor}`
      );
      return res.data.username;
    } catch (error) {
      logError('Error getting author data:', error);
      return '';
    }
  };

  // 預設放置在blog和article頁面
  const openSponsorModal = async() => {
    if(isAuthorized){
      const idToSponsor = await getSponsorId();
      setSponsorId(idToSponsor);
      
      const authorName = await getAuthorData(idToSponsor);
      setSponsorName(authorName);
      
      const sponsorModal = Modal.getInstance(sponsorModalRef.current);
      sponsorModal.show();
    } else {
      Swal.fire(alertMsgForVerify);
    }
  }

  const closeSponsorModal = () => {
    const sponsorModal = Modal.getInstance(sponsorModalRef.current);
    sponsorModal.hide();
    // 重置表單
    setPaymentData({
      amount: "",
      customAmount: "",
      payment: "",
      cardType: "",
      cardNumber: ""
    });
    setIsNextStep(false);
  }

  //是否進入下一頁
  const nextStepHandle = () => {
    // 驗證表單
    if (!paymentData.amount) {
      Swal.fire({
        title: "請選擇贊助金額",
        icon: "warning",
        confirmButtonColor: "#E77605",
        confirmButtonText: "確認"
      });
      return;
    }
    
    if (paymentData.amount === "custom" && !paymentData.customAmount) {
      Swal.fire({
        title: "請輸入自訂金額",
        icon: "warning",
        timer: 1500,
      });
      return;
    }
    
    if (!paymentData.payment) {
      Swal.fire({
        title: "請選擇付款方式",
        icon: "warning",
        timer: 1500,
      });
      return;
    }
    
    if (paymentData.payment === "信用卡" && !paymentData.cardType) {
      Swal.fire({
        title: "請選擇信用卡類型",
        icon: "warning",
        timer: 1500,
      });
      return;
    }
    
    if (paymentData.cardType === "custom" && !paymentData.cardNumber) {
      Swal.fire({
        title: "請輸入卡號",
        icon: "warning",
        timer: 1500,
      });
      
      return;
    }
    
    setIsNextStep(true);
  }

  // 處理金額選擇
  const handleAmountChange = (e) => {
    const { id } = e.target;
    
    if (id === "support50") {
      setPaymentData({ ...paymentData, amount: "50" });
    } else if (id === "support100") {
      setPaymentData({ ...paymentData, amount: "100" });
    } else if (id === "support200") {
      setPaymentData({ ...paymentData, amount: "200" });
    } else if (id === "supportCustom") {
      setPaymentData({ ...paymentData, amount: "custom" });
    }
  }

  // 自訂金額輸入
  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setPaymentData({ ...paymentData, customAmount: value });
  }

  // 付款方式選擇
  const handlePaymentChange = (e) => {
    const { id } = e.target;
    
    if (id === "cardPay") {
      setPaymentData({ ...paymentData, payment: "信用卡" });
    } else if (id === "linePay") {
      setPaymentData({ ...paymentData, payment: "LINE Pay" });
    }
  }

  // 信用卡類型選擇
  const handleCardTypeChange = (e) => {
    const { id } = e.target;
    
    if (id === "defaultCard") {
      setPaymentData({ ...paymentData, cardType: "default", cardNumber: "VISA **** **** **** 1234" });
    } else if (id === "customCard") {
      setPaymentData({ ...paymentData, cardType: "custom" });
    }
  }

  // 自訂卡號輸入
  const handleCardNumberChange = () => {
    const cardParts = [
      document.getElementById('card-part-1').value,
      document.getElementById('card-part-2').value,
      document.getElementById('card-part-3').value,
      document.getElementById('card-part-4').value
    ];
    const fullCardNumber = cardParts.join('-');
    setPaymentData({ ...paymentData, cardNumber: fullCardNumber });
  }

  // 獲取顯示金額
  const getDisplayAmount = () => {
    if (paymentData.amount === "custom") {
      return paymentData.customAmount;
    }
    return paymentData.amount;
  }

  // 獲取顯示付款方式
  const getDisplayPayment = () => {
    if (paymentData.payment === "信用卡") {
      return `${paymentData.payment} (${paymentData.cardNumber || "未提供卡號"})`;
    }
    return paymentData.payment;
  }

  //確定付款
  const sponsorHandle = async() => {
    try{
      // 根據用戶選擇的金額決定要發送的數據
      const actualAmount = paymentData.amount === "custom" ? 
        parseInt(paymentData.customAmount) : 
        parseInt(paymentData.amount);
        
      const url = `${VITE_API_BASE_URL}/payments`;
      const data = {
        "amount": actualAmount,
        "receiver_id": sponsorId  // 使用狀態中儲存的sponsorId
      }
      //console.log(data);
      
      const sponsorRes = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      //console.log('sponsorRes', sponsorRes);
      if(sponsorRes.data.status === 'success'){
        Swal.fire({
          title: "贊助成功!",
          icon: "success",
          confirmButtonColor: "#E77605",
          confirmButtonText: "確認"
        });
      }
    } catch(error) {
      logError('error in sponsor', error.response?.data || error.message);
      
      Swal.fire({
        title: "贊助失敗!",
        text:"請稍後再試",
        icon: "warning",
        confirmButtonColor: "#E77605",
        confirmButtonText: "確認"
      });
    } finally {
      closeSponsorModal(); // 成功後關閉對話框
    }
  }

  return (
    <>
    {/*Button trigger modal*/}
    <button 
      type="button" 
      className="btn btn-outline-primary sponsor-btn border border-primary-hover btn-click"
      onClick={openSponsorModal}
    >
      <i className="bi bi-gift sponsor-icon fs-8 px-2"></i>
      <span className="sponsor-text fs-8">贊助</span>
    </button>

    {/* Modal*/}
    <div ref={sponsorModalRef}
      className="modal fade modal-fullscreen-md-down sponsor-modal" 
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      id="sponsorModal" 
      data-bs-keyboard="false" 
      tabIndex="-1" 
      aria-labelledby="sponsorModal" 
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content rounded px-4">
          <div className="modal-header">
            <div className="modal-title fs-5 text-primary" id="sponsorModal">
              <i className="bi bi-gift-fill"></i>
               <span className="ms-2">支持 {sponsorName}</span>
            </div>
            {/* <button onClick={closeSponsorModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
          </div>
          {!isNextStep ? (
            <div className="modal-body">
              <div className="h4 mb-3">選擇贊助金額</div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="supportAmount" 
                  id="support50" 
                  checked={paymentData.amount === "50"}
                  onChange={handleAmountChange}
                />
                <label className="form-check-label mb-1" htmlFor="support50">
                  50元
                </label>
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="supportAmount" 
                  id="support100"
                  checked={paymentData.amount === "100"}
                  onChange={handleAmountChange}
                />
                <label className="form-check-label mb-1" htmlFor="support100">
                  100元
                </label>
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="supportAmount" 
                  id="support200"
                  checked={paymentData.amount === "200"}
                  onChange={handleAmountChange}
                />
                <label className="form-check-label mb-1" htmlFor="support200">
                  200元
                </label>
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="supportAmount" 
                  id="supportCustom"
                  checked={paymentData.amount === "custom"}
                  onChange={handleAmountChange}
                />
                <label className="form-check-label mb-2" htmlFor="supportCustom">
                  自訂金額
                  <div className="input-group input-group-sm mb-3 mt-2">
                    <input 
                      type="text" 
                      className="form-control" 
                      aria-label="Sizing example input" 
                      aria-describedby="inputGroup-sizing-sm"
                      value={paymentData.customAmount}
                      onChange={handleCustomAmountChange}
                      disabled={paymentData.amount !== "custom"}
                    />
                    <span className="input-group-text" id="inputGroup-sizing-sm">元</span>
                  </div>
                </label>
              </div>
  
              <div className="h4 mb-3">選擇付款方式</div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="payment" 
                  id="cardPay"
                  checked={paymentData.payment === "信用卡"}
                  onChange={handlePaymentChange}
                />
                <label className="form-check-label" htmlFor="cardPay">
                信用卡付款：
                  <div className="form-check mt-2">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="credictCard" 
                      id="defaultCard"
                      checked={paymentData.cardType === "default"}
                      onChange={handleCardTypeChange}
                      disabled={paymentData.payment !== "信用卡"}
                    />
                    <label className="form-check-label" htmlFor="defaultCard">
                    VISA **** **** **** 1234
                    </label>
                  </div>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="credictCard" 
                      id="customCard"
                      checked={paymentData.cardType === "custom"}
                      onChange={handleCardTypeChange}
                      disabled={paymentData.payment !== "信用卡"}
                    />
                    <label className="form-check-label" htmlFor="customCard">
                    其他卡片
                    <div className="mb-3 d-flex gap-2">
                    <input 
                      id="card-part-1"
                      className="form-control form-control-sm" 
                      type="text" 
                      maxLength="4"
                      aria-label=".form-control-sm"
                      onChange={handleCardNumberChange}
                      disabled={paymentData.cardType !== "custom"}
                    />-
                    <input 
                      id="card-part-2"
                      className="form-control form-control-sm" 
                      type="text" 
                      maxLength="4"
                      aria-label=".form-control-sm"
                      onChange={handleCardNumberChange}
                      disabled={paymentData.cardType !== "custom"}
                    />-
                    <input 
                      id="card-part-3"
                      className="form-control form-control-sm" 
                      type="text" 
                      maxLength="4"
                      aria-label=".form-control-sm"
                      onChange={handleCardNumberChange}
                      disabled={paymentData.cardType !== "custom"}
                    />-
                    <input 
                      id="card-part-4"
                      className="form-control form-control-sm" 
                      type="text" 
                      maxLength="4"
                      aria-label=".form-control-sm"
                      onChange={handleCardNumberChange}
                      disabled={paymentData.cardType !== "custom"}
                    />
                    </div>
                    </label>
                  </div>
                </label>
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="payment" 
                  id="linePay"
                  checked={paymentData.payment === "LINE Pay"}
                  onChange={handlePaymentChange}
                />
                <label className="form-check-label" htmlFor="linePay">
                LINE Pay
                </label>
              </div>
            </div>  
            ):(
            <div className="modal-body">
              <div className="h4 mb-3">確認您的付款資訊：</div>
              <div className="h6 mb-2">付款金額: <span className="fw-normal">{getDisplayAmount()} 元</span></div>
              <div className="h6">付款方式: <span className="fw-normal">{getDisplayPayment()}</span></div>
              <div className="mt-4 alert alert-info">
                <p className="mb-0">你的支持將幫助我們提供更多有價值的文章！</p>
              </div>
            </div>
          )}
          <div className="modal-footer">
          {!isNextStep ? (
            <>
            <button onClick={closeSponsorModal} type="button" className="btn btn-outline-primary">取消</button>
            <button onClick={nextStepHandle} type="button" className="btn btn-primary btn-click">下一步</button>
            </>
          ):(
            <>
            <button onClick={()=>{setIsNextStep(false)}} type="button" className="btn btn-outline-primary btn-click">上一步</button>
            <button onClick={sponsorHandle} type="button" className="btn btn-primary btn-click">確定</button>
            </>
          )}
          </div>{/* footer */}
        </div>
      </div>
    </div>
    </>
  );
};

export default SponsorModal;