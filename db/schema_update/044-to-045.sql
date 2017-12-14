update users
set username = concat(firstname, lastname, id)
where username is null;
