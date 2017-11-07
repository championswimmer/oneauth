# CHANGELOG

## 1.0.0

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