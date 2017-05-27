const Promise = require('bluebird');
const functions = require('firebase-functions');
const path = require('path');
const _ = require('lodash');
const { EmailTemplate } = require('email-templates');
const nodemailer = require('nodemailer');
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);


const getEmailTemplate = (templateName, templateData) => {
    const templateDir = path.join(__dirname, './templates', templateName);
    const template = new EmailTemplate(templateDir);
    return Promise.fromCallback(cb => {
        template.render(templateData, cb);
    });
};

const sendEmail = (options) => {
    return getEmailTemplate(options.template, options.data).then(result => {
        const mailOptions = _.pick(options, ['from', 'to', 'subject'])
        mailOptions.html = result.html;
        return mailTransport.sendMail(mailOptions);
    })
    
}
exports.sendEmail = sendEmail;

const EMAIL_TEMPLATES = {
    WELCOME_EMAIL: 'welcome-email',
};
exports.EMAIL_TEMPLATES = EMAIL_TEMPLATES;

const EMAIL_FROM = '"AseanGlass 41th Conference" <aseanglass41@gmail.com>';
exports.EMAIL_FROM = EMAIL_FROM;