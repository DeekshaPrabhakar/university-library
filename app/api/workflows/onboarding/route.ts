import { serve } from '@upstash/workflow/nextjs';
import { sendEmail } from '../../../../lib/workflow';

type InitialData = {
  email: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  // Welcome email
  await context.run('new-signup', async () => {
    await sendEmail({
      email,
      subject: 'Welcome to our platform',
      message: `Hi ${fullName}, welcome to our platform!`,
    });
  });

  await context.sleep('wait-for-3-days', 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run('check-user-state', async () => {
      return await getUserState();
    });

    if (state === 'non-active') {
      await context.run('send-email-non-active', async () => {
        await sendEmail({
          email,
          subject: 'Are you still there?',
          message: `Hi ${fullName}, we miss you!`,
        });
      });
    } else if (state === 'active') {
      await context.run('send-email-active', async () => {
        await sendEmail({
          email,
          subject: 'Welcome back!',
          message: `Hi ${fullName}, welcome back!`,
        });
      });
    }

    await context.sleep('wait-for-1-month', 60 * 60 * 24 * 30);
  }
});

type UserState = 'non-active' | 'active';

const getUserState = async (): Promise<UserState> => {
  // Implement user state logic here
  return 'non-active';
};
