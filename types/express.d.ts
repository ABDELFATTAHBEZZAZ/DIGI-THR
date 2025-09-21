import 'express-session';

declare global {
  namespace Express {
    interface Response {
      status: (code: number) => this;
      json: (body: any) => this;
      sendStatus: (code: number) => this;
      send: (body?: any) => this;
      clearCookie: (name: string) => this;
    }
    
    interface Request {
      session: any;
    }
  }
}
