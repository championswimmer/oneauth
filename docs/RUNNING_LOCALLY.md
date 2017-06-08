
# Testing on Localhost

To properly test this, simple running it as `node server.js` won't work.
It needs to run on it's own domain and run on https.

_NOTE: Since I already have taken account.codingblocks.com, using the same domain
will not work, because I have apps registered with this domain on Facebook,
Twitter and Github. So wherever **account.codingblocks.com** is written below, change it
to a domain of your liking that you'll use for testing._

## Step1: Register Apps
 - Register a developer account and create apps on Facebook, Twitter and Github.
 - Register your own app on these platforms, and get Oauth client ids and secrets.
 - Make a copy of `secrets-sample.json` to `secrets.json` and fill it up.

## Step2: Setup HTTPS proxy on localhost

You need to setup Apache or Nginx to proxy account.codingblocks.com requests to
port 3838 (on which this app usually runs)

Example for nginx -
```conf
server {
    listen   80;
    server_name   account.codingblocks.com;
    access_log  logs/nginx/oneauth-http.log;

        # Pass requests for / to localhost:3838:
        location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://localhost:3838/;
                proxy_ssl_session_reuse off;
                proxy_set_header Host $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
        }
}
server {
    listen       443 ssl;
    server_name  account.codingblocks.com;

    ssl on;

    ssl_certificate      cert.pem;
    ssl_certificate_key  key.pem;

    access_log logs/nginx/oneauth-https.log;

#       Optional Stuff- not required, will work without these
#        ssl_session_timeout 5m;
#        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
#        ssl_prefer_server_ciphers on;
#        ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

        # Pass requests for / to localhost:3838:
        location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://localhost:3838/;
                proxy_ssl_session_reuse off;
                proxy_set_header Host $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
        }
}
```

## Step3: Get your SSL certificate
Use one of the following guides -

<https://www.ibm.com/support/knowledgecenter/en/SSWHYP_4.0.0/com.ibm.apimgmt.cmc.doc/task_apionprem_gernerate_self_signed_openSSL.html>

<https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs>


