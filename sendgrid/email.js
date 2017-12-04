const sgMail = require('@sendgrid/mail');
const secret = require('../secrets-sample');
const config = require('../config');
sgMail.setApiKey(secret.SENDGRID_API_KEY);
sgMail.setSubstitutionWrappers('{{', '}}');


const sendgridTemplatesid = {
  'welcomeEmail':'1e4b2b6f-be9a-478a-b1b4-1ecd1c8ecbc5',
  'verifyEmail':''
}

const senderEmail = config.EMAIL_SENDER_ADDR;


const welcomeMail = function(user) {

  let msgTemplate = {};
  msgTemplate.template_id = sendgridTemplatesid.welcomeEmail;
  msgTemplate.from = senderEmail;

  msgTemplate.to = {
    name : user.firstname,
    email : user.email,
  };

  msgTemplate.substitutions = {
    "name": user.firstname ,
  };

  sgMail.send(msgTemplate)
  .then(() => {
  //  console.log('mail sent');
  })
  .catch(error => {

    Raven.captureException(error);
    console.error(error.toString());

  });


}

//Send a Single Email to Single or Multiple Recipients where they see each others email addresses

const verifyEmail = function(userEmails) {

  let msgTemplate = {};
  msgTemplate.template_id = '';
  msgTemplate.from = senderEmail;

  msgTemplate.to = userEmails;

  sgMail.send(msgTemplate)
  .then(() => {
  //  console.log('mail sent');
  })
  .catch(error => {

    Raven.captureException(error);
    console.error(error.toString());

  });


}

//Send a Single Email to Multiple Recipients where they don't see each others email addresses
const verifyEmail_private = function(userEmails) {

  let msgTemplate = {};
  msgTemplate.template_id = '';
  msgTemplate.from = senderEmail;

  msgTemplate.to = userEmails;

  sgMail.sendMultiple(msgTemplate)
  .then(() => {
  //  console.log('mail sent');
  })
  .catch(error => {

    Raven.captureException(error);
    console.error(error.toString());

  });


}



module.exports = {'welcomeMail':welcomeMail , 'verifyEmail':verifyEmail };
