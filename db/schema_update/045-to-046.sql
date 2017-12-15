create table resetpassward(id SERIAL , key text , userid bigint references users(id) , deletedat timestamp);
