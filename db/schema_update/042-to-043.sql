update users set photo = concat('https://graph.facebook.com/',userfacebooks.id,'/picture?type=large') from userfacebooks where users.id = userfacebooks."userId" and users.photo like '%akamai%'
