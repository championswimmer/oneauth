const sgMail = require('@sendgrid/mail');
const secret = require('../secrets-sample');
const config = require('../config');
sgMail.setApiKey(secret.SENDGRID_API_KEY);
sgMail.setSubstitutionWrappers('{{', '}}');


const sendgridTemplatesid = {
  'welcomeEmail':'b318c5d0-44b9-4a69-9d9a-01f08284b9a6',
  'verifyEmail':'98855b98-08fd-482f-b273-273038d4f75f'
}

const senderEmail = config.EMAIL_SENDER_ADDR;


const welcomeEmail = function(user) {

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
  msgTemplate.template_id = sendgridTemplatesid.verifyEmail;
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

//Send a Single Email to Single or Multiple Recipients where they don't see each others email addresses

const verifyEmailPrivate = function(userEmails) {

  let msgTemplate = {};
  msgTemplate.template_id = sendgridTemplatesid.verifyEmail;
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



module.exports = {'welcomeEmail':welcomeEmail , 'verifyEmail':verifyEmail , 'verifyEmailPrivate':verifyEmailPrivate };
