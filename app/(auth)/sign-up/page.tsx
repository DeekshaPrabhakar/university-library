'use client';

import AuthForm from '@/components/AuthForm';
import { signUpSchema } from '@/lib/validations';

const Page = () => (
  <AuthForm
    type="SIGN_UP"
    schema={signUpSchema}
    defaultValues={{
      email: '',
      password: '',
      fullName: '',
      universityId: 0,
      universityCard: '',
    }}
    onSubmit={async (data) => {
      console.log('sign up');
      return { success: true };
    }}
  />
);

export default Page;
