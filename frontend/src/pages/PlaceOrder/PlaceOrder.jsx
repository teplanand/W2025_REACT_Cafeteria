import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {

    const [payment, setPayment] = useState("cod");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        employee_email: "",
        department: "",
        sub_department: "",
        floor: "",
        desk_location: "",
        phone: ""
    });

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge } = useContext(StoreContext);
    const navigate = useNavigate();

    const departments = {
        EngineeringDesign: ['Product Design', 'CAD', 'Prototyping & Testing', 'Customization Engineering', 'Automation & Controls'],
        Manufacturing: ['Machining', 'Welding', 'Assembly', 'Casting & Molding', 'Inspection & Testing', 'Maintenance'],
        RnD: ['Product Development', 'Material Science', 'Technology Integration', 'Simulation & Analysis'],
        QualityControl: ['Incoming Material Inspection', 'In-Process Inspection', 'Final Product Testing', 'Calibration & Measurement', 'Documentation & Reporting'],
        SalesMarketing: ['Market Research', 'Product Marketing', 'Customer Relationship Management (CRM)', 'Sales Support', 'Advertising & Branding'],
        SupplyChainLogistics: ['Procurement', 'Inventory Management', 'Logistics & Distribution', 'Warehouse Management', 'Vendor Management'],
        ProjectManagement: ['Project Planning', 'Resource Management', 'Project Execution', 'Risk Management', 'Client Liaison'],
        FinanceAccounts: ['Accounts Payable/Receivable', 'Financial Reporting', 'Budgeting & Forecasting', 'Taxation', 'Audit & Compliance'],
        HumanResources: ['Recruitment & Staffing', 'Employee Relations', 'Training & Development', 'Compensation & Benefits', 'Performance Management'],
        ITTechnology: ['IT Support & Helpdesk', 'Network Administration', 'ERP Implementation', 'Software Development', 'Data Management & Security'],
        CustomerSupportService: ['Installation Support', 'Maintenance Services', 'Spare Parts Management', 'Training & Documentation'],
        LegalCompliance: ['Contracts & Agreements', 'Intellectual Property (IP) Management', 'Regulatory Compliance', 'Litigation & Dispute Resolution']
    };

    const [subDepartments, setSubDepartments] = useState([]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));

        if (name === 'department') {
            setSubDepartments(departments[value] || []);
            setData(prev => ({ ...prev, sub_department: '' }));
        }
    };

    const placeOrder = async (e) => {
        e.preventDefault();

        let orderItems = [];
        food_list.forEach(item => {
            if (cartItems[item._id] > 0) {
                orderItems.push({ ...item, quantity: cartItems[item._id] });
            }
        });

        const orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge
        };

        if (payment === "razorpay") {
            try {
                const orderRes = await axios.post(`${url}/api/payment/order`, { amount: orderData.amount }, { headers: { token } });
                if (!orderRes.data.success) {
                    toast.error("Payment initialization failed");
                    return;
                }

                const options = {
                    key: "rzp_test_O9XyYw400yHxvKD",  // Replace this with your live key in production!
                    amount: orderRes.data.order.amount,
                    currency: "INR",
                    name: "Cafe MS",
                    description: "Order Payment",
                    order_id: orderRes.data.order.id,
                    handler: async (response) => {
                        try {
                            const verifyRes = await axios.post(`${url}/api/payment/verify`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderData
                            }, { headers: { token } });

                            if (verifyRes.data.success) {
                                setCartItems({});
                                toast.success("Order Placed Successfully!");
                                navigate("/myorders");
                            } else {
                                toast.error("Payment Verification Failed");
                            }
                        } catch (error) {
                            console.error("Verification error:", error);
                            toast.error("Something went wrong during payment verification.");
                        }
                    },
                    prefill: {
                        name: `${data.firstName} ${data.lastName}`,
                        email: data.email,
                        contact: data.phone
                    },
                    theme: { color: "#000" }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();

            } catch (error) {
                console.error("Order Creation Error:", error);
                toast.error("Failed to initiate payment.");
            }
        } else {
            try {
                const response = await axios.post(`${url}/api/order/placecod`, orderData, { headers: { token } });
                if (response.data.success) {
                    setCartItems({});
                    toast.success(response.data.message);
                    navigate("/myorders");
                } else {
                    toast.error("Something went wrong while placing the order.");
                }
            } catch (error) {
                console.error("COD Order Error:", error);
                toast.error("Something went wrong.");
            }
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("Please sign in to place an order.");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token]);

    // Load Razorpay script dynamically
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, []);

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='firstName' value={data.firstName} onChange={onChangeHandler} placeholder='First name' required />
                    <input type="text" name='lastName' value={data.lastName} onChange={onChangeHandler} placeholder='Last name' required />
                </div>
                <input type="email" name='email' value={data.email} onChange={onChangeHandler} placeholder='Email address' required />
                <input type="email" name='employee_email' value={data.employee_email} onChange={onChangeHandler} placeholder='Employee email' required />
                <div className="multi-field">
                    <select name="department" value={data.department} onChange={onChangeHandler} required className="input-field">
                        <option value="">Select Department</option>
                        {Object.keys(departments).map((dept) => (
                            <option key={dept} value={dept}>{dept.replace(/([A-Z])/g, ' $1').trim()}</option>
                        ))}
                    </select>
                    <select name="sub_department" value={data.sub_department} onChange={onChangeHandler} required className="input-field">
                        <option value="">Select Sub Department</option>
                        {subDepartments.map((subDept, i) => (
                            <option key={i} value={subDept}>{subDept}</option>
                        ))}
                    </select>
                </div>
                <div className="multi-field">
                    <input type="text" name='floor' value={data.floor} onChange={onChangeHandler} placeholder='Floor' required />
                    <input type="text" name='desk_location' value={data.desk_location} onChange={onChangeHandler} placeholder='Desk Location' required />
                </div>
                <input type="text" name='phone' value={data.phone} onChange={onChangeHandler} placeholder='Phone' required />
            </div>

            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b></div>
                    </div>
                </div>

                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div onClick={() => setPayment("razorpay")} className="payment-option">
                        <img src={payment === "razorpay" ? assets.checked : assets.un_checked} alt="" />
                        <p>Razorpay ( Credit / Debit / UPI )</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>
                    {payment === "cod" ? "Place Order" : "Proceed To Payment"}
                </button>
            </div>
        </form>
    );
};

export default PlaceOrder;
