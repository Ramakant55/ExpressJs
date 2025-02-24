const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Add these to your .env file
        pass: process.env.EMAIL_PASS
    }
});

const sendOrderConfirmation = async (userEmail, orderDetails) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Order Confirmation - Your Order is Successfully Placed',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #059669; text-align: center;">Order Confirmation</h2>
                    <p>Dear Customer,</p>
                    <p>Thank you for your order! Your order has been successfully placed.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #059669;">Order Details:</h3>
                        <p><strong>Order ID:</strong> ${orderDetails._id}</p>
                        <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
                        <p><strong>Shipping Address:</strong> ${orderDetails.shippingAddress}</p>
                        <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
                        <p><strong>Payment Status:</strong> ${orderDetails.paymentStatus}</p>
                    </div>

                    <h4 style="color: #059669;">Ordered Items:</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${orderDetails.items.map(item => `
                            <li style="margin-bottom: 10px; padding: 10px; border: 1px solid #e5e7eb; border-radius: 4px;">
                                <p><strong>${item.name}</strong></p>
                                <p>Quantity: ${item.quantity}</p>
                                <p>Price: ₹${item.price}</p>
                            </li>
                        `).join('')}
                    </ul>

                    <p style="margin-top: 20px;">We will notify you once your order is shipped.</p>
                    <p>If you have any questions, please don't hesitate to contact us.</p>
                    
                    <div style="text-align: center; margin-top: 30px; color: #6b7280;">
                        <p>Thank you for shopping with us!</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw error;
    }
};

module.exports = { sendOrderConfirmation };