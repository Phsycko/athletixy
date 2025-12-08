// prisma.config.ts
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: "postgresql://postgres:GUgHJBmqYCW1wQZB@aws-0-us-west-2.pooler.supabase.com:5432/postgres",
  },
});
