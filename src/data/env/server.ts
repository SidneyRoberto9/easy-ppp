import { z } from 'zod';

import { createEnv } from '@t3-oss/env-nextjs';

const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SECRET_KEY: z.string(),
  },
  experimental__runtimeEnv: process.env,
});

export { env };
