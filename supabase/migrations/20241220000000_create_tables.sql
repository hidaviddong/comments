-- 创建必要的扩展（只包含常用的）
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- 创建同步用户资料的函数
CREATE OR REPLACE FUNCTION "public"."sync_profiles"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- 检查auth.users表中的新记录是否已经存在于public.profiles中
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE profile_id = NEW.id) THEN
    -- 如果不存在，则插入新记录到public.profiles
    INSERT INTO public.profiles (profile_id, profile_info)
    VALUES (NEW.id, NEW.raw_user_meta_data);
  END IF;
  RETURN NEW;
END;
$$;

-- 创建表结构
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "profile_id" "uuid" NOT NULL,
    "profile_info" "jsonb"
);

CREATE TABLE IF NOT EXISTS "public"."projects" (
    "project_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_name" character varying(255)
);

CREATE TABLE IF NOT EXISTS "public"."project_profiles" (
    "project_id" "uuid" NOT NULL,
    "profile_id" "uuid" NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."tooltips" (
    "tooltip_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "x" double precision,
    "y" double precision,
    "project_id" "uuid"
);

CREATE TABLE IF NOT EXISTS "public"."comments" (
    "comment_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "comment_content" "text",
    "comment_resolved" boolean DEFAULT false,
    "tooltip_id" "uuid",
    "profile_id" "uuid",
    "create_time" timestamp with time zone DEFAULT "now"() NOT NULL
);

-- 添加主键约束
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("profile_id");

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("project_id");

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_project_id_key" UNIQUE ("project_id");

ALTER TABLE ONLY "public"."project_profiles"
    ADD CONSTRAINT "project_profiles_pkey" PRIMARY KEY ("project_id", "profile_id");

ALTER TABLE ONLY "public"."tooltips"
    ADD CONSTRAINT "tooltips_pkey" PRIMARY KEY ("tooltip_id");

ALTER TABLE ONLY "public"."tooltips"
    ADD CONSTRAINT "tooltips_tooltip_id_key" UNIQUE ("tooltip_id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("comment_id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_comment_id_key" UNIQUE ("comment_id");

-- 添加外键约束
ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."project_profiles"
    ADD CONSTRAINT "project_profiles_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id");

ALTER TABLE ONLY "public"."project_profiles"
    ADD CONSTRAINT "project_profiles_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id");

ALTER TABLE ONLY "public"."tooltips"
    ADD CONSTRAINT "tooltips_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id");

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_tooltip_id_fkey" FOREIGN KEY ("tooltip_id") REFERENCES "public"."tooltips"("tooltip_id");

-- 设置权限
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."sync_profiles"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_profiles"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_profiles"() TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";

GRANT ALL ON TABLE "public"."project_profiles" TO "anon";
GRANT ALL ON TABLE "public"."project_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."project_profiles" TO "service_role";

GRANT ALL ON TABLE "public"."tooltips" TO "anon";
GRANT ALL ON TABLE "public"."tooltips" TO "authenticated";
GRANT ALL ON TABLE "public"."tooltips" TO "service_role";

GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";

-- 创建触发器
DROP TRIGGER IF EXISTS "on_auth_user_created" ON "auth"."users";
CREATE TRIGGER "on_auth_user_created"
  AFTER INSERT ON "auth"."users"
  FOR EACH ROW EXECUTE FUNCTION "public"."sync_profiles"(); 