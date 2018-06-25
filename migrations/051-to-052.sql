alter table clients add column "defaultURL" varchar(255) NOT NULL default 'https://codingblocks.com/';
alter table sessions add column "ipAddr" varchar(15);