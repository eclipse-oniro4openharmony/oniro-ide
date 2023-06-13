
import { MaybePromise } from '@theia/core';
import { WsRequestValidatorContribution } from '@theia/core/lib/node/ws-request-validators'
import { IncomingMessage } from 'http';
import { injectable } from '@theia/core/shared/inversify'

// as disucssed this is a hardcoded switch to activate/deactiveate the authentication
// deactivated by default in the POC
const AUTH_ACIVTE = false;


const HARDCODED_USERNAME = 'user';
const HARDCODED_PASSWORD = 'password';

/**
 * validates connections for having an authorization header
 * currently for the POC only supports basic auth against hardcoded username and password 
 */
@injectable()
export class AuthRequestValidatorContribution implements WsRequestValidatorContribution {
    allowWsUpgrade(request: IncomingMessage): MaybePromise<boolean> {
        if(AUTH_ACIVTE) {
            const auth = request.headers.authorization?.trim();
            if(auth && auth.startsWith('Basic')) {
                const basicAuth = Buffer.from(auth.split(' ')[1], 'base64').toString();
                const [username, password] = basicAuth.split(':');
                return username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD; 
            }
            return false;
        }

        return true;
    }

}