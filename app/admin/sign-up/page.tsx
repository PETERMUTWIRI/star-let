import { redirect } from 'next/navigation';

export default function AdminSignUpRedirect() {
  redirect('/auth/sign-up');
}
