# Explicit Authentication
Use this when your website has a frontend and a backend

## Register a client
### 1. Create User on account.codingblocks.com
Create user, and login

https://account.codingblocks.com/login

### 2. Create a client

https://account.codingblocks.com/clients/add

Save the client id and client secret. You'll need them.

## Redirect user to get a grant code

### 1. Send to oneauth for grant code

```
GET
https://account.codingblocks.com/oauth/authorize?
        response_type=code
    &   client_id=9990781661
    &   redirect_uri=http://hackerblocks.com/callback
```

Upon going there, the user is redirected back (if logged in and authorized)
to the following place -

```
http://hackerblocks.com/callback?code=HaFn5uq9j8IkFr2LaRanXCCypla03raF
```

### From backend exchange grant code for auth token

```
POST
https://account.codingblocks.com/oauth/token
        client_id=9990781661
    &   redirect_uri=http://hackerblocks.com/callback
    &   client_secret=ZyTe3zCR67REHND7CHa9zH39NllvLWYULCedocZDLaCkSVTA7GGE1s1Hjrgkos09
    &   grant_type=authorization_code
    &   code=MyiLDqJwTpzEXqYOG1jNFCtjEzYHAR4U
```
NOTE that re-sending the redirect-uri is important (only for verification purpose).

The auth token will be in response body like this -

```js
{
  "access_token": "hm2AuJgHPVWXDDpaj1iB2mznBUXjtOC2WSfno1u2hBx75eK8eQOjdu77WD3biyIU",
  "token_type": "Bearer"
}
```

### Get user details -
You can get details of the user using the bearer token you got -

```GET
https://account.codingblocks.com/api/v1/user/me

HEADERS:
    Authorization: Bearer hm2AuJgHPVWXDDpaj1iB2mznBUXjtOC2WSfno1u2hBx75eK8eQOjdu77WD3biyIU
```
