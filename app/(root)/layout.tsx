import { ReactNode } from 'react';
import Header from '../../components/Header';
import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import { after } from 'next/server';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) redirect('/sign-in');

  //update user lastActivityDate when user visits the site
  after(async () => {
    if (!session?.user?.id) return;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session?.user?.id))
      .limit(1);

    //if user has already visited the site today, return
    if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10))
      return;

    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, session?.user?.id));
  });
  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
