# Explicit Authentication
Use this when your website has a frontend and a backend

## Register a client
### 1. Create User on account.codingblocks.com
Create user, and login

https://account.codingblocks.com/login

### 2. Create a client

https://account.codingblocks.com/clients/add

Save the client id and client secret. You'll need them.

## 1. Redirect user to get a grant code

### 1.1. Send to oneauth for access token

```
GET
http://localhost:3838/oauth/authorize?
        response_type=token
    &   client_id=9990781661
    &   redirect_uri=http://hackerblocks.com/callback
```

Upon going there, the user is redirected back (if logged in and authorized)
to the following place -

```
http://hackerblocks.com/callback?token=HaFn5uq9j8IkFr2LaRanXCCypla03raF
```

Retrieve token from URL.

## 2. Get user details -
You can get details of the user using the bearer token you got -

```GET
https://account.codingblocks.com/api/users/me

HEADERS:
    Authorization: Bearer hm2AuJgHPVWXDDpaj1iB2mznBUXjtOC2WSfno1u2hBx75eK8eQOjdu77WD3biyIU
```
