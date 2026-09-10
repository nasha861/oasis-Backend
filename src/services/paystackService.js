const axios = require("axios");

const initializePayment = async ({ email, amount, reference }) => {
    try {
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: Math.round(amount * 100),
                reference,
                callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Paystack initialization error:",
            error.response?.data || error.message
        );

        throw new Error("Unable to initialize Paystack payment");
    }
};


// Verify Paystack payment
const verifyPayment = async (reference) => {
    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Paystack verification error:",
            error.response?.data || error.message
        );

        throw new Error("Unable to verify Paystack payment");
    }
};


module.exports = {
    initializePayment,
    verifyPayment,
};