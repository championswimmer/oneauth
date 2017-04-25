# oneauth
[![Code Climate](https://lima.codeclimate.com/github/coding-blocks/oneauth/badges/gpa.svg)](https://lima.codeclimate.com/github/coding-blocks/oneauth)
[![bitHound Code](https://www.bithound.io/github/coding-blocks/oneauth/badges/code.svg)](https://www.bithound.io/github/coding-blocks/oneauth)
[![bitHound Dependencies](https://www.bithound.io/github/coding-blocks/oneauth/badges/dependencies.svg)](https://www.bithound.io/github/coding-blocks/oneauth/master/dependencies/npm)
[![CodeFactor](https://www.codefactor.io/repository/github/coding-blocks/oneauth/badge)](https://www.codefactor.io/repository/github/coding-blocks/oneauth)
[![codebeat badge](https://codebeat.co/badges/93d5f023-5bab-40c0-9c65-aeb724814bd3)](https://codebeat.co/projects/github-com-coding-blocks-oneauth-master)

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=championswimmer&url=https://github.com/coding-blocks/oneauth&title=oneauth&language=&tags=github&category=software)

## Installation

### Step 1 : Database Setup

### Step 2 : Deploy

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
        client_id=9990781661
    &   redirect_uri=hackerblocks.com/authback
    &   client_secret=ZyTe3zCR67REHND7CHa9zH39NllvLWYULCedocZDLaCkSVTA7GGE1s1Hjrgkos09
    &   grant_type=authorization_code
    &   code=MyiLDqJwTpzEXqYOG1jNFCtjEzYHAR4U
```
Retrieve the bearer token from the response body

_Ensure you do not leak client secret
to the frontend_

Read in detailed [step by step instructions here](docs/AUTHENTICATE_EXPLICIT.md)

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

#### /login
Existing user login

#### /signup
New user signup

#### /user/me
User profile data of logged in user

#### /user/{userid}
User profie data (only public data) of any user

#### /clients
All clients created by currently logged in user

#### /clients/{clientid}
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