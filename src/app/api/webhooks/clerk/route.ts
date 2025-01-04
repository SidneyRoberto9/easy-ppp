import { headers } from 'next/headers';
import { Webhook } from 'svix';

import { env } from '@/data/env/server';
import { createUserSubscription } from '@/server/db/subscription';
import { deleteUser } from '@/server/db/users';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET_KEY);

  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  switch (event.type) {
    case 'user.created':
      await createUserSubscription({
        clerkUserId: event.data.id,
        tier: 'Free',
      });
      break;

    case 'user.deleted':
      if (event.data.id != null) {
        await deleteUser(event.data.id);
        // TODO: Delete Stripe customer and subscription
      }
      break;
  }

  return new Response('Webhook received', { status: 200 });
}
