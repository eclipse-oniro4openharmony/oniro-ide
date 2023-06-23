import { DefaultEventsMap } from '@socket.io/component-emitter'
import { WebSocketConnectionProvider } from '@theia/core/lib/browser/messaging/ws-connection-provider'
import { injectable, inject } from '@theia/core/shared/inversify'
import { io, Socket } from 'socket.io-client';
import { AuthService, AUTH_STORAGE_KEY } from './auth-service';

@injectable()
export class AuthenticatingWebsocketConnectionProvider extends WebSocketConnectionProvider {

    @inject(AuthService)
    private readonly authService: AuthService;

    // cant use auth service in here since its called in the constructor
    protected override createWebSocket(url: string): Socket<DefaultEventsMap, DefaultEventsMap> {
        const auth = localStorage.getItem(AUTH_STORAGE_KEY);
        const authHeader = auth ? {'Authorization': auth} : undefined 
        const socket = io(url, {
            path: this.createSocketIoPath(url),
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10000,
            reconnectionAttempts: Infinity,
            extraHeaders: {
                ...authHeader,
                // Socket.io strips the `origin` header
                // We need to provide our own for validation
                'fix-origin': window.location.origin,
            }
        });
        socket.on('disconnect', (reason) => {
            if(reason === 'io server disconnect') {
                this.authService.onAuthFailed();
            }
        });

        return socket;
    }
}
