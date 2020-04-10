# Migration `20200410223355-change-token-expiry-type`

This migration has been generated by Tom Barton at 4/10/2020, 10:33:55 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."User" DROP COLUMN "resetTokenExpiry",
ADD COLUMN "resetTokenExpiry" timestamp(3)   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200410222604-rename-reset-token-expiry..20200410223355-change-token-expiry-type
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("POSTGRESQL_URL")
 }
 model User {
   email               String   @unique
@@ -14,7 +14,7 @@
   lastname            String
   password            String
   registeredAt        DateTime @default(now())
   resetToken          String?
-  resetTokenExpiry String?
+  resetTokenExpiry DateTime?
   updatedAt           DateTime @updatedAt
 }
```

