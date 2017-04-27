# Oneauth API

## `/api/users`

### GET `/api/users/me`

Return details of the user whose auth token is present in the header

| Header        | Value           |
| ------------- |:-------------:|
| Authorization | (required), eg `Bearer jb1jv3jh4v1jkh41h1b` |

| Query Parameter | Value | Description |
| ------------- |:-------------:|:----|
| include | (optional), eg. `?include=facebook,github` | Gets user's social account related details (if available) |





### GET `/api/users/:id`

Return details (public info) about any user, provided request is authorized via
any registered user.

| Header        | Value           |
| ------------- |:-------------:|
| Authorization | (required), eg `Bearer jb1jv3jh4v1jkh41h1b` |



## `/api/clients`

### POST `/api/clients/add`