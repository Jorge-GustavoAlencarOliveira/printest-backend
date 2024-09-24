import { Request, Response } from 'express';
import { ValidatedToken } from '../../actions/authSession';

export class AuthSessionController {
  async handle(request: Request, response: Response) {
    const authorizationHeader = request.headers.authorization;
    const [, token] = authorizationHeader.split(' ');
    const validation = await ValidatedToken(token);
    return response.json(validation);
  }
}
