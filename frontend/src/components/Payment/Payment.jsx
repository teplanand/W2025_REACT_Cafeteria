import axios from "axios";
import { toast } from "react-toastify";

export const handleRazorpayPayment = async (orderData, token, url, data, navigate, setCartItems) => {
    try {
        const orderRes = await axios.post(`${url}/api/payment/order`, { amount: orderData.amount }, { headers: { token } });
        if (!orderRes.data.success) {
            toast.error("Payment initialization failed");
            return;
        }

        const options = {
            key: "rzp_test_O9XyYw400yHxvKD",  // your Razorpay key
            amount: orderRes.data.order.amount,
            currency: "INR",
            name: "cafe ms",
            description: "Order Payment",
            order_id: orderRes.data.order.id,
            handler: async function (response) {
                const paymentData = {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderData
                };
                const verifyRes = await axios.post(`${url}/api/payment/verify`, paymentData, { headers: { token } });

                if (verifyRes.data.success) {
                    navigate("/myorders");
                    toast.success("Order Placed Successfully!");
                    setCartItems({});
                } else {
                    toast.error("Payment Verification Failed");
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
        console.error(error);
        toast.error("Payment initialization failed");
    }
};
