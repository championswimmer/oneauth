# oneauth
[![Code Climate](https://lima.codeclimate.com/github/coding-blocks/oneauth/badges/gpa.svg)](https://lima.codeclimate.com/github/coding-blocks/oneauth)
[![bitHound Code](https://www.bithound.io/github/coding-blocks/oneauth/badges/code.svg)](https://www.bithound.io/github/coding-blocks/oneauth)
[![bitHound Dependencies](https://www.bithound.io/github/coding-blocks/oneauth/badges/dependencies.svg)](https://www.bithound.io/github/coding-blocks/oneauth/master/dependencies/npm)




## OAuth2 Server
_**oneauth**_ is an OAuth2 server, that you can consume

### Grant Code
This will get you a grant code (that can be exchanged for an auth token).
```
GET
http://localhost:3838/oauth/dialog/authorize?
        response_type=code
    &   client_id=9990781661
    &   redirect_uri=http://hackerblocks.com/callback
```

### Implicit Auth Token
This will get you a bearer token straight away
```
GET
http://localhost:3838/oauth/dialog/authorize?
        response_type=token
    &   client_id=9990781661
    &   redirect_uri=http://hackerblocks.com/callback
```

## Oauth2 Consumer
_**oneauth**_ is also an OAuth2 consumer, so users can link other accounts
they have on Facebook/Twitter/Google etc