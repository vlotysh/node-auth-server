declare namespace Express {
    interface Request {
        user?: Object
    }
}



declare module jsonwebtoken {
    export function verify(token: String, tokenSecret: String): Object;

    export function verify(token: String, tokenSecret: String): Object;
}