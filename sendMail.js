const mailer = require('nodemailer');

const transporter = mailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'systemauction2019@gmail.com',
        pass: '123456!@#$%^'
    }
});

module.exports = {
    sendMailActivate: async (email, token) => {
        const linkMail = process.env.FRONTEND_URL + `/activate/${token}`;
        const mainOptions = {
            from: 'CaroOnline',
            to: email,
            subject: 'Mail Activate account Caro online',
            text: 'You recieved message from ' + 'systemauction2019@gmail.com',
            html: `<p>You have got a link for active your account</p><br/><ul><li>Link: <a href='${linkMail}'> Click here to activate account </a></li></ul>`
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
    sendMailChangePassword: async (email, token) => {
        const linkMail = process.env.FRONTEND_URL + `/change-password/${token}`;
        const mainOptions = {
            from: 'CaroOnline',
            to: email,
            subject: 'Mail change password account Caro online',
            text: 'You recieved message from ' + 'systemauction2019@gmail.com',
            html: `<p>You have got a link to change your password</p><br/><ul><li>Link: <a href='${linkMail}'> Click here to change password </a></li></ul>`
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

// const emailTemplate = `<html xmlns="http://www.w3.org/1999/xhtml">
// <head>
// \t<meta http-equiv="content-type" content="text/html; charset=utf-8">
//   \t<meta name="viewport" content="width=device-width, initial-scale=1.0;">
//  \t<meta name="format-detection" content="telephone=no"/>

// \t<!-- Responsive Mobile-First Email Template by Konstantin Savchenko, 2015.
// \thttps://github.com/konsav/email-templates/  -->

// \t<style>
// /* Reset styles */ 
// body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}
// body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
// table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
// img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
// #outlook a { padding: 0; }
// .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }
// .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }

// /* Extra floater space for advanced mail clients only */ 
// @media all and (max-width: 600px) {
// \t.floater { width: 320px; }
// }

// /* Set color for auto links (addresses, dates, etc.) */ 
// a, a:hover {
// \tcolor: #127DB3;
// }
// .footer a, .footer a:hover {
// \tcolor: #999999;
// }

//  \t</style>

// \t<!-- MESSAGE SUBJECT -->
// \t<title>Get this responsive email template</title>

// </head>

// <!-- BODY -->
// <!-- Set message background color (twice) and text color (twice) -->
// <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
// \tbackground-color: #FFFFFF;
// \tcolor: #000000;"
// \tbgcolor="#FFFFFF"
// \ttext="#000000">

// <!-- SECTION / BACKGROUND -->
// <!-- Set section background color -->
// <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
// \tbgcolor="#127DB3">

// <!-- WRAPPER -->
// <!-- Set wrapper width (twice) -->
// <table border="0" cellpadding="0" cellspacing="0" align="center"
// \twidth="600" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
// \tmax-width: 600px;" class="wrapper">

// \t<tr>
// \t\t<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
// \t\t\tpadding-top: 20px;">

// \t\t\t<!-- PREHEADER -->
// \t\t\t<!-- Set text color to background color -->
// \t\t\t<div style="display: none; visibility: hidden; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; height: 0; max-height: 0; max-width: 0;
// \t\t\tcolor: #FFFFFF;" class="preheader">
// \t\t\t\tAvailable on&nbsp;retrospective and&nbsp;CodePen. Highly compatible. Designer friendly. More than 50%&nbsp;of&nbsp;development team use Retrospective for saving time.</div>

// \t\t\t<!-- LOGO -->
// \t\t\t<!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2. URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content=logo&utm_campaign={{Campaign-Name}} -->
// \t\t

// \t\t</td>
// \t</tr>
// \t<tr>
// \t\t<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
// \t\t\tpadding-top: 20px;
// \t\t\tcolor: #FFFFFF;
// \t\t\tfont-family: sans-serif;" class="header">
// \t\t\t\tYou are invited to a board on Retrospective !
// \t\t</td>
// \t</tr>

// \t<!-- SUBHEADER -->
// \t<!-- Set text color and font family ("sans-serif" or "Georgia, serif") -->
// \t<tr>
// \t\t<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-bottom: 3px; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 18px; font-weight: 300; line-height: 150%;
// \t\t\tpadding-top: 5px;
// \t\t\tcolor: #FFFFFF;
// \t\t\tfont-family: sans-serif;" class="subheader">
// \t\t\t\tAvailable on&nbsp;Retrospective&nbsp;
// \t\t</td>
// \t</tr>

// \t<!-- HERO IMAGE -->
// \t<!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 (wrapper x2). Do not set height for flexible images (including "auto"). URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Ìmage-Name}}&utm_campaign={{Campaign-Name}} -->
// \t<tr>
// \t\t<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
// \t\t\tpadding-top: 20px;" class="hero"><a target="_blank" style="text-decoration: none;"
// \t\t\thref="http://retrospective.ai"><img border="0" vspace="0" hspace="0"
// \t\t\tsrc="https://i.imgur.com/fhW7SoU.png"
// \t\t\talt="Please enable images to view this content" title="Hero Image"
// \t\t\twidth="530" style="
// \t\t\twidth: 88.33%;
// \t\t\tmax-width: 530px;
// \t\t\tcolor: #FFFFFF; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"/></a></td>
// \t</tr>

// \t<!-- PARAGRAPH -->
// \t<!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
// \t<tr>
// \t\t<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
// \t\t\tpadding-top: 25px; 
// \t\t\tcolor: #FFFFFF;
// \t\t\tfont-family: sans-serif;" class="paragraph">
// \t\t\t\tMore than 50%&nbsp;of&nbsp;development team uses Retrospective.
// \t\t</td>
// \t</tr>

// \t<!-- BUTTON -->
// \t<!-- Set button background color at TD, link/text color at A and TD, font family ("sans-serif" or "Georgia, serif") at TD. For verification codes add "letter-spacing: 5px;". Link format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Button-Name}}&utm_campaign={{Campaign-Name}} -->
// \t<tr>
// \t\t<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
// \t\t\tpadding-top: 25px;
// \t\t\tpadding-bottom: 35px;" class="button"><a
// \t\t\thref="https://github.com/konsav/email-templates/" target="_blank" style="text-decoration: underline;">
// \t\t\t\t<table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;"><tr><td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
// \t\t\t\t\tbgcolor="#0B5073"><a target="_blank" style="text-decoration: underline;
// \t\t\t\t\tcolor: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;"
// \t\t\t\t\thref="http://retrospective.ai">
// \t\t\t\t\t\tJoin now
// \t\t\t\t\t</a>
// \t\t\t</td></tr></table></a>
// \t\t</td>
// \t</tr>
// </table>

// <!-- SECTION / BACKGROUND -->
// <!-- Set section background color -->
// </td></tr><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
// \tpadding-top: 5px;"
// \tbgcolor="#FFFFFF">

// <!-- WRAPPER -->
// <!-- Set conteiner background color -->
// <table border="0" cellpadding="0" cellspacing="0" align="center"
// \twidth="600" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
// \tmax-width: 600px;">

//  \t<tr>
// \t\t<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
// \t\t\tpadding-top: 30px;
// \t\t\tpadding-bottom: 35px;" class="button"><a
// \t\t\thref="https://github.com/konsav/email-templates/" target="_blank" style="text-decoration: underline;">
// \t\t\t\t</a>
// \t\t</td>
// \t</tr>

// </table>
// </td></tr><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
// \tbgcolor="#F0F0F0">

// <table border="0" cellpadding="0" cellspacing="0" align="center"
// \twidth="600" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
// \tmax-width: 600px;" class="wrapper">

// \t<tr>
// \t\t<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
// \t\t\tpadding-top: 25px;" class="social-icons"><table
// \t\t\twidth="256" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse; border-spacing: 0; padding: 0;">
// \t\t\t<tr>
// \t\t\t\t<td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
// \t\t\t\t\thref="https://fb.com/retrospectiveai/"
// \t\t\t\tstyle="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
// \t\t\t\t\tcolor: #000000;"
// \t\t\t\t\talt="F" title="Facebook"
// \t\t\t\t\twidth="44" height="44"
// \t\t\t\t\tsrc="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/facebook.png"></a></td>

// \t</tr>

// \t<tr>
// \t\t<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;
// \t\t\tpadding-top: 20px;
// \t\t\tpadding-bottom: 20px;
// \t\t\tcolor: #999999;
// \t\t\tfont-family: sans-serif;" class="footer">

// \t\t\t\tThis email template was sent to&nbsp;you becouse we&nbsp;want to&nbsp;make the&nbsp;world a&nbsp;better place.<br/> You&nbsp;could change your <a href="https://github.com/konsav/email-templates/" target="_blank" style="text-decoration: underline; color: #999999; font-family: sans-serif; font-size: 13px; font-weight: 400; line-height: 150%;">subscription settings</a> anytime.
// \t\t\t\t<img width="1" height="1" border="0" vspace="0" hspace="0" style="margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"
// \t\t\t\tsrc="https://raw.githubusercontent.com/konsav/email-templates/master/images/tracker.png" />

// \t\t</td>
// \t</tr>

// <!-- End of WRAPPER -->
// </table>

// <!-- End of SECTION / BACKGROUND -->
// </td></tr></table>

// </body>
// </html>`;