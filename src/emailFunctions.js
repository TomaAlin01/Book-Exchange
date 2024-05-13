const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();


const mailTransport = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'book-exchange-pi@outlook.com',
    pass: 'Alin12345',
  },
});

exports.sendPaymentConfirmation = functions.firestore
  .document('payments/{paymentId}')
  .onCreate(async (snapshot, context) => {
    const paymentData = snapshot.data();
    const userEmail = paymentData.userEmail;

    const mailOptions = {
      from: 'book-exchange-pi@outlook.com',
      to: userEmail,
      subject: 'Payment Confirmation',
      text: `Thank you for your payment of $${paymentData.amount}.`,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error);
    }

    return null;
  });