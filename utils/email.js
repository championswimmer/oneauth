const sgMail = require('@sendgrid/mail');
const secret = require('../secrets-sample');
const config = require('../config');

sgMail.setApiKey(config.SECRETS.SENDGRID_API_KEY);
sgMail.setSubstitutionWrappers('{{', '}}');

const sendgridTemplatesid = {
  'welcomeEmail':'b318c5d0-44b9-4a69-9d9a-01f08284b9a6',
  'verifyEmail':'98855b98-08fd-482f-b273-273038d4f75f',
  'forgotUserEmail':'fab9108c-90ca-4612-b401-b089d06417be',
  'forgotPassEmail':'fab9108c-90ca-4612-b401-b089d06417be'
}

const senderEmail = config.EMAIL_SENDER_ADDR;


const welcomeEmail = function(user) {

  let msgTemplate = {};
  msgTemplate.template_id = config.WELCOME_EMAIL;
  msgTemplate.from = senderEmail;

  msgTemplate.to = {
    name : user.firstname,
    email : user.email,
  };

  msgTemplate.substitutions = {
    "name": user.firstname ,
  };

  return sgMail.send(msgTemplate)
  .then(() => {
  //  console.log('mail sent');
  })
  .catch(error => {
  //  Raven.captureException(error);
    console.error(error.toString());

  });


}

//Send a Single Email to Single or Multiple Recipients where they see each others email addresses

const verifyEmail = function(userEmails) {

  let msgTemplate = {};
  msgTemplate.template_id = config.VERIFY_EMAIL;
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


const forgotPassEmail = function(user , key) {

  let msgTemplate = {};
  msgTemplate.template_id = config.FORGOT_PASS_EMAIL;
  msgTemplate.from = senderEmail;

  msgTemplate.to = user.email;

  let link = "https://account.codingblocks.com/setnewpassword/" + key;
  msgTemplate.substitutions = {
    "subject": "Forgot password codingblocks",
    "username": user.username ,
    "link": link
  };
  return sgMail.send(msgTemplate)

}

//Send a Single Email to Single or Multiple Recipients where they don't see each others email addresses

const verifyEmailPrivate = function(userEmails) {

  let msgTemplate = {};
  msgTemplate.template_id = config.VERIFY_EMAIL;
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

const forgotUsernameEmail = function(user) {

   let msgTemplate = {};
   msgTemplate.template_id = sendgridTemplatesid.forgotUserEmail;
   msgTemplate.from = senderEmail;

   msgTemplate.to = user.email;

   let username =  user.username;

   msgTemplate.substitutions = {
     "subject": "Forgot username codingblocks",
     "username": user.username ,
   };
   return sgMail.send(msgTemplate)

 }


module.exports = {'welcomeEmail':welcomeEmail , 'verifyEmail':verifyEmail , 'forgotPasswordEmail':forgotPassEmail , 'verifyEmailPrivate':verifyEmailPrivate };
