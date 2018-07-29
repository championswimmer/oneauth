# CHANGELOG

## 1.0.0

### 0.5.0

  - show all clients to admins
  - show connected apps to the user
  - convert promises in strategies to async-await
  - make users paranoid (not what you're thinking)

#### 0.4.8

  - Add college and branch details

#### 0.4.7

  - Add address to users

#### 0.4.2

  - Make username field non-null

#### 0.4.1

  - [hotfix] clear cookies so older logins get cleared
  - some fixed to make it deploy on heroku properly

### 0.4

  - create heroku-deployable setup for staging
  - improve user profile ui
  - better handling of secrets.json file
  - [fix frontend] bootstrap 4 needs tether.io
  - set global .codingblocks.com cookie
  - allow frontend clients access to /api/user/me
  - drop dependency on cookie-parser (not needed)
  
#### 0.3.3 

  - \[validation\] check empty email
  - [validation] give user feedback on frontend 
  - redirect away from /login or /signup if already logged in
  - allow ?redirect=xxxx on /logout path
#### 0.3.2

  - [temporarily] downgrade to pg v6

#### 0.3.1

  - Fix github missing first/last names
  - Add DataDog metrics

### 0.3

  - fix Twitter authorize
  - fix Github connect 
  - add sentry error reporting 

### 0.2

  - update to use node 8
  - fix all unhandled promises

#### 0.1.2

 - added roles to users
 - scripts to set roles

#### 0.1.1

 - logout user via api `/api/users/me/logout`
 - editing user (only browser session for now, not API)

### 0.1

 - connect twitter if signed in with other means
 - connect github if signed in with other means
 - add google analytics
 - beautify the auth dialog

#### 0.0.9

 - add course details to lms table

#### 0.0.8

 - same user on multiple social account bug fixed
 - modularized the passport handlers

#### 0.0.7

 - fix LMS base64
 - add API includes for full profile data
 - fix string type for roll number
 - larger facebook photos

#### 0.0.6

 - enable twitter login
 - enable github login
 - enable login with students.codingblocks.com

#### 0.0.5

 - passwords are salted and hashed (bcrypt)