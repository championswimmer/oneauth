update users set photo = userfacebooks.photo from userfacebooks where users.id = userfacebooks."userId" and (users.photo = '' or users.photo is null) and userfacebooks.photo like '%graph%';
