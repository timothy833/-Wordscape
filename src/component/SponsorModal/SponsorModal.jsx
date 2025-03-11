import "./SponsorModal.scss";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useParams, useLocation } from 'react-router-dom';
const { VITE_API_BASE_URL } = import.meta.env;

const SponsorModal = () => {
  const { username, token } = useSelector(state => state.auth);
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

  // Modal Create & Functions
  useEffect(() => {
    new Modal(sponsorModalRef.current, {backdrop: false}); 
  },[]);

  const openSponsorModal = () => {
    const sponsorModal = Modal.getInstance(sponsorModalRef.current);
    sponsorModal.show();
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
      alert('請選擇贊助金額');
      return;
    }
    
    if (paymentData.amount === "custom" && !paymentData.customAmount) {
      alert('請輸入自訂金額');
      return;
    }
    
    if (!paymentData.payment) {
      alert('請選擇付款方式');
      return;
    }
    
    if (paymentData.payment === "信用卡" && !paymentData.cardType) {
      alert('請選擇信用卡類型');
      return;
    }
    
    if (paymentData.cardType === "custom" && !paymentData.cardNumber) {
      alert('請輸入卡號');
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
  const handleCardNumberChange = (e, index) => {
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

  //判斷目前位置並取得作者ID
  const getUserIdForSponsor = async() => {
    let sponsorId = null;
    let postId = null;
    if (location.pathname.startsWith("/blog/")) {
      sponsorId = user_id.slice(1); // `/blog/:user_id`
      console.log('getUserIdForSponsor in blog page');
    } else if (location.pathname.startsWith("/article/")) {
      postId = id; // `/article/:id`
      console.log('getUserIdForSponsor in article page');
        try {
          const postData = await axios.get(`${VITE_API_BASE_URL}/posts/${postId}`);
          sponsorId = postData.data.data.user_id;
          // console.log(postData);
        } catch (error) {
          console.log('error in get userId',error);
        }
    }
    setSponsorId(sponsorId)
    return sponsorId;
  };

  //確定付款
  const sponsorHandle = async() => {
    try{
      // 根據用戶選擇的金額決定要發送的數據
      const actualAmount = paymentData.amount === "custom" ? 
        parseInt(paymentData.customAmount) : 
        parseInt(paymentData.amount);
      const recieverId = await getUserIdForSponsor();
      const url = `${VITE_API_BASE_URL}/payments`;
      const data = {
        "amount": actualAmount,
        "receiver_id": recieverId
      }
      console.log(data);
      
      const sponsorRes = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('sponsorRes',sponsorRes);
      if(sponsorRes.data.status === 'success'){
        alert('贊助成功');
      }
    } catch(error) {
      console.log('error in sponsor', error.response?.data || error.message);
      alert('贊助失敗，請稍後再試');
    }finally{
      closeSponsorModal(); // 成功後關閉對話框
    }
  }

  return (
    <>
   {/*Button trigger modal*/}
    <button 
      type="button" 
      className="btn btn-primary sponsor-btn"
      onClick={async()=>{
        openSponsorModal();
        const userId = await getUserIdForSponsor(); // 確保等到結果
        console.log("Final Sponsor ID:", userId);
      }}
    >
      <i className="bi bi-gift sponsor-icon"></i>
      <span className="sponsor-text">贊助</span>
    </button>

    {/* Modal*/}
    <div ref={ sponsorModalRef }
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
            <h1 className="modal-title fs-5" id="sponsorModal">支持作者</h1>
            {/* <button onClick={closeSponsorModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
          </div>
          {!isNextStep ? (
            <div className="modal-body">
              <div className="h4">選擇贊助金額</div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="supportAmount" 
                  id="support50" 
                  checked={paymentData.amount === "50"}
                  onChange={handleAmountChange}
                />
                <label className="form-check-label" htmlFor="support50">
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
                <label className="form-check-label" htmlFor="support100">
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
                <label className="form-check-label" htmlFor="support200">
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
                <label className="form-check-label" htmlFor="supportCustom">
                  自訂金額
                  <div className="input-group input-group-sm mb-3">
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
  
              <div className="h4">選擇付款方式</div>
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
                  <div className="form-check">
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
                      onChange={(e) => handleCardNumberChange(e, 0)}
                      disabled={paymentData.cardType !== "custom"}
                    />-
                    <input 
                      id="card-part-2"
                      className="form-control form-control-sm" 
                      type="text" 
                      maxLength="4"
                      aria-label=".form-control-sm"
                      onChange={(e) => handleCardNumberChange(e, 1)}
                      disabled={paymentData.cardType !== "custom"}
                    />-
                    <input 
                      id="card-part-3"
                      className="form-control form-control-sm" 
                      type="text" 
                      maxLength="4"
                      aria-label=".form-control-sm"
                      onChange={(e) => handleCardNumberChange(e, 2)}
                      disabled={paymentData.cardType !== "custom"}
                    />-
                    <input 
                      id="card-part-4"
                      className="form-control form-control-sm" 
                      type="text" 
                      maxLength="4"
                      aria-label=".form-control-sm"
                      onChange={(e) => handleCardNumberChange(e, 3)}
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
              <div className="h4">確認您的付款資訊：</div>
              <div className="h6">付款金額: <span className="fw-normal">{getDisplayAmount()} 元</span></div>
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
            <button onClick={nextStepHandle} type="button" className="btn btn-primary">下一步</button>
            </>
          ):(
            <>
            <button onClick={()=>{setIsNextStep(false)}} type="button" className="btn btn-outline-primary">上一步</button>
            <button onClick={sponsorHandle} type="button" className="btn btn-primary">確定</button>
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