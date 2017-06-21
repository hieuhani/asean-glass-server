const functions = require('firebase-functions');
const _ = require('lodash');
const admin = require('firebase-admin');
const { sendEmail, EMAIL_TEMPLATES, EMAIL_FROM } = require('./emailer');


const serviceAccount = require('./service-account-credentials.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://aseanglass-cf37f.firebaseio.com',
});

exports.newRegistrationEvent = functions.database.ref('/registration_forms/{userID}').onWrite(event => {
    const data = event.data.val();    
    if (!data) {
        return Promise.resolve();
    }
    if (_.has(data, 'status')) {
        console.log('This registration form is reviewed');
        return Promise.resolve();
    }
    console.log('Send welcome email to this user');
    const primaryEmail = _.get(data, 'attendees.0.email');
    if (primaryEmail) {
        const mailOptions = {
            from: EMAIL_FROM,
            to: primaryEmail,
            subject: 'Thanks for registering 41st Asean Glass Conference',
        };
        mailOptions.template = EMAIL_TEMPLATES.WELCOME_EMAIL;

        return sendEmail(mailOptions);
    }

    return Promise.resolve();
});
