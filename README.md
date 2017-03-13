# oneauth
[![Code Climate](https://lima.codeclimate.com/github/coding-blocks/oneauth/badges/gpa.svg)](https://lima.codeclimate.com/github/coding-blocks/oneauth)
[![bitHound Code](https://www.bithound.io/github/coding-blocks/oneauth/badges/code.svg)](https://www.bithound.io/github/coding-blocks/oneauth)
[![bitHound Dependencies](https://www.bithound.io/github/coding-blocks/oneauth/badges/dependencies.svg)](https://www.bithound.io/github/coding-blocks/oneauth/master/dependencies/npm)
[![CodeFactor](https://www.codefactor.io/repository/github/coding-blocks/oneauth/badge)](https://www.codefactor.io/repository/github/coding-blocks/oneauth)
[![codebeat badge](https://codebeat.co/badges/93d5f023-5bab-40c0-9c65-aeb724814bd3)](https://codebeat.co/projects/github-com-coding-blocks-oneauth-master)


## OAuth2 Server
_**oneauth**_ is an OAuth2 server, that you can consume

### Grant Code
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
<p style="color: red">Ensure you do not leak client secret
to the frontend.</p>

### Implicit Auth Token
This will get you a bearer token straight away on frontend
```
GET
http://localhost:3838/oauth/authorize?
        response_type=token
    &   client_id=9990781661
    &   redirect_uri=http://hackerblocks.com/callback
```



## Oauth2 Consumer
_**oneauth**_ is also an OAuth2 consumer, so users can link other accounts
they have on Facebook/Twitter/Google etc