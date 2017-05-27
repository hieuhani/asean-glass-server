const functions = require('firebase-functions');
const _ = require('lodash');
const { responseError } = require('./error-handlers');
const admin = require('firebase-admin');

const serviceAccount = require('./service-account-credentials.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://aseanglass-cf37f.firebaseio.com',
});

exports.register = functions.https.onRequest((req, res) => {
    // TODO: Validate JSON schema
    const { attendees } = req.body;
    const masterAttendee = _.head(attendees);
    if (!(masterAttendee && (masterAttendee.email && masterAttendee.password))) {
        responseError(400, 'Master attendee email and password is required', res);
    }
    const account = _.pick(masterAttendee, ['email', 'password', 'phone', 'first_name']);

    return admin.auth().createUser(account).then((userRecord) => {
        return admin.auth().createCustomToken(userRecord.uid).then((token) => {
            return Promise.resolve({ uid: userRecord.uid, token });
        });
    }).then(({ uid, token }) => {
        const registrationData = {};
        registrationData.attendees = attendees;
        return admin.database().ref(`/registration_forms/${uid}`).push(registrationData).then(() => {
            res.json({ token });
        });
    }).catch((error) => {
        console.error(error);
        res.status(400);
        res.json(error);
    });
});
