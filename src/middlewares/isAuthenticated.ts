import { Request, Response, NextFunction } from 'express';
import { authFirebase } from '../firebase/firebaseAdmin';

export function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader) {
    return response.status(401).send({ error: 'Unauthorized' });
  }
  const [, token] = authorizationHeader.split(' ');

  authFirebase.auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      const { sub } = decodedToken;
      request.user_id = sub;
      return next();
    })
    .catch(() => {
      return response.status(401).send({ error: 'Invalid token' });
    });
}
