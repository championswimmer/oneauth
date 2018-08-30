ALTER TABLE "userlocals"  ADD UNIQUE ("userId");
ALTER TABLE "usergithubs"  ADD UNIQUE ("userId");
ALTER TABLE "usergoogles"  ADD UNIQUE ("userId");
ALTER TABLE "usertwitters"  ADD  UNIQUE ("userId");
ALTER TABLE "userlms"  ADD UNIQUE ("userId");
ALTER TABLE "userfacebooks"  ADD UNIQUE ("userId");
ALTER TABLE "userlinkedins"  ADD UNIQUE ("userId");
