ALTER TABLE users ADD COLUMN "mobile_number" VARCHAR(255);
CREATE TYPE "public"."enum_users_gender" AS ENUM('MALE', 'FEMALE', 'UNDISCLOSED');ALTER TABLE "public"."users" ADD COLUMN "gender" "public"."enum_users_gender";
ALTER TABLE "public"."users" ADD COLUMN "gender" "public"."enum_users_gender" DEFAULT 'UNDISCLOSED'::enum_users_gender;