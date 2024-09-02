import { authFirebase } from '../firebase/firebaseAdmin';

export async function ValidatedToken(token: string) {
  const result = await authFirebase.auth().verifyIdToken(token);
  return result;
}
