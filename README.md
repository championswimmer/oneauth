# oneauth
[![Build Status](https://travis-ci.org/coding-blocks/oneauth.svg)](https://travis-ci.org/coding-blocks/oneauth)
[![CircleCI](https://circleci.com/gh/coding-blocks/oneauth.svg?style=svg)](https://circleci.com/gh/coding-blocks/oneauth)
[![Coverage Status](https://codecov.io/github/coding-blocks/oneauth/badge.svg)](https://codecov.io/gh/coding-blocks/oneauth)
[![Code Climate](https://lima.codeclimate.com/github/coding-blocks/oneauth/badges/gpa.svg)](https://lima.codeclimate.com/github/coding-blocks/oneauth)
[![CodeFactor](https://www.codefactor.io/repository/github/coding-blocks/oneauth/badge)](https://www.codefactor.io/repository/github/coding-blocks/oneauth)
[![codebeat badge](https://codebeat.co/badges/93d5f023-5bab-40c0-9c65-aeb724814bd3)](https://codebeat.co/projects/github-com-coding-blocks-oneauth-master)
[![Known Vulnerabilities](https://snyk.io/test/github/coding-blocks/oneauth/badge.svg)](https://snyk.io/test/github/coding-blocks/oneauth)

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=championswimmer&url=https://github.com/coding-blocks/oneauth&title=oneauth&language=&tags=github&category=software)

## Design and Styles

**IMPORTANT NOTE** The css is picked from [motley](https://github.com/coding-blocks/motley)
If there are any UI changes to be made, please make on motley.

## Installation

### Step 1 : Database Setup

### Step 2 : Deploy
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Running Locally (for Development)

### Option 1: Without SSL, only local logins
Simple clone and  -

```
npm install
git submodule init
git submodule update
npm run start:dev
```

### Option 2: With SSL (HTTPS), and try out social logins too

If you want to run it with https, and run it on a proper domain
(not 127.0.0.1), and enable Facebook/Twitter/Github logins, you'll need to take care of
a few additional steps -

Please read the [required steps in the wiki](https://github.com/coding-blocks/oneauth/wiki/)

-------------------------

## OAuth2 Server Usage
_**oneauth**_ is an OAuth2 server, that you can consume

A few terms to remember -

| Term | Definition |
| -----|------------|
| auth token | A token, used in lieu of user+password credentials, to make API requests |
| grant code | A code that can be exchanged for a auth token |
| client id | Unique identifier for each client |
| client secret| A secret key, to be used to exchange codes for tokens |

-------------------------

### Grant Code Flow (frontend + backend clients)
This will get you a grant code (that can be exchanged for an auth token).
Redirect the user to the below URL on the frontend
```
GET
http://localhost:3838/oauth/authorize?
        response_type=code
    &   client_id=9990781661
    &   redirect_uri=http://hackerblocks.com/callback
```
Then from your backend get the auth token
```
POST
http://localhost:3838/oauth/token

    {
         "client_id" : 9990781661,
         "redirect_uri" : "http://hackerblocks.com/callback",
         "client_secret" : "ZyTe3zCR67REHND7CHa9zH39NllvLWYULCedocZDLaCkSVTA7GGE1s1Hjrgkos09",
         "grant_type" : "authorization_code",
         "code"  : "MyiLDqJwTpzEXqYOG1jNFCtjEzYHAR4U"
     }
```
Retrieve the bearer token from the response body

_Ensure you do not leak client secret
to the frontend_

Read in detailed [step by step instructions in the wiki](wiki)

-------------------------

### Implicit Auth Token Flow (pure frontend clients)
This will get you a bearer token straight away on frontend
```
GET
http://localhost:3838/oauth/authorize?
        response_type=token
    &   client_id=9990781661
    &   redirect_uri=http://hackerblocks.com/callback
```
Retrive the bearer token from the URL

-------------------------


## Oauth2 Consumer Usage
_**oneauth**_ is also an OAuth2 consumer, so users can link other accounts
they have on Facebook/Twitter/Google etc

## Pages

#### `/login`
Existing user login

#### `/signup`
New user signup

#### `/user/me`
User profile data of logged in user

#### `/user/{userid}`
User profie data (only public data) of any user

#### `/clients`
All clients created by currently logged in user

#### `/clients/{clientid}`
Details of the client (given the user who owns it is logged in)

-------------------------

## Credits
### Libraries Used
This is built upon the insanely useful and easy to use Oauth2 libraries
built by [jaredhanson](http://github.com/jaredhanson) from [auth0](http://github.com/auth0)
 - **[passport.js](https://github.com/jaredhanson/passport)** The universal auth solution on Nodejs
 - **[oauth2orize](https://github.com/jaredhanson/oauth2orize)** Simple Oauth2 provider middleware

### Inspirations
We built this at @coding-blocks looking at a similar solution [hasgeek](http://github.com/hasgeek)
has here - http://github.com/hasgeek/lastuser
We made our own, instead of using _lastuser_, because (a) the documentation
was a little lacking on lastuser, and (b) we were more comfortable on a
NodeJS+Postgres based stack.

## Support on Beerpay
You can support the project via BeerPay
Buy us a beer !

[![Beerpay](https://beerpay.io/coding-blocks/oneauth/badge.svg?style=beer-square)](https://beerpay.io/coding-blocks/oneauth)  [![Beerpay](https://beerpay.io/coding-blocks/oneauth/make-wish.svg?style=flat-square)](https://beerpay.io/coding-blocks/oneauth?focus=wish)
