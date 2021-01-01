const mailer = require('nodemailer');

var transporter = mailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'systemauction2019@gmail.com',
        pass: '123456!@#$%^'
    }
});

module.exports = {
    sendMailActivate: async (email, token) => {
        console.log(email);
        console.log(token);
        const linkMail = `http://localhost:3001/activate/${token}`;
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'CaroOnline',
            to: email,
            subject: 'Mail Activate account Caro online',
            text: 'You recieved message from ' + 'systemauction2019@gmail.com',
            html: `<p>You have got a otp for verifying your account</p><br/><ul><li>Link: <a href='${linkMail}'> ${linkMail} </a></li></ul>`
        }
        await transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });

        return 1;
    },
};