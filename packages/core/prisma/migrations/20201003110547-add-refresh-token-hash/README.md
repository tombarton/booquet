# Migration `20201003110547-add-refresh-token-hash`

This migration has been generated at 10/3/2020, 11:05:47 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."User" ADD COLUMN "refreshTokenHash" text   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200519210530-remove-event-auto-generated-id..20201003110547-add-refresh-token-hash
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("PRISMA_DB_URL")
 }
 model User {
   email            String    @unique
@@ -15,8 +15,9 @@
   password         String
   registeredAt     DateTime  @default(now())
   resetToken       String?   @unique
   resetTokenExpiry DateTime?
+  refreshTokenHash String?
   updatedAt        DateTime  @updatedAt
   role             Role
   Cart             Cart?
   Order            Order[]
```


