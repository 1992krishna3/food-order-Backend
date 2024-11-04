import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
console.log('Razorpay Key Secret:', process.env.RAZORPAY_KEY_SECRET);


// Create an order
export const createOrder = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const { amount, currency } = req.body;
        
        const options = {
            amount: amount * 100, 
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('Razorpay Order Creation Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create order', error });
    }
};

// Verify payment signature
export const verifyPayment = async (req, res) => {
    try {
        console.log({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest('hex');

        console.log({ generatedSignature, razorpay_signature }); // Debugging

        if (generatedSignature === razorpay_signature) {
            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to verify payment', error });
    }
};
