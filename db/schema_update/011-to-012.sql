﻿CREATE TYPE public.enum_users_role AS ENUM ('employee', 'intern', 'admin');
ALTER TABLE public.users ADD COLUMN role enum_users_role;
