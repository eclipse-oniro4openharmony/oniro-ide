
import { injectable, inject } from '@theia/core/shared/inversify';
import { Widget } from '@theia/core/lib/browser'
import { WindowService } from '@theia/core/lib/browser/window/window-service'

export const AuthWidgetFactory = Symbol();

export const AUTH_STORAGE_KEY = 'oniro-auth';

@injectable()
export class AuthService {

    @inject(AuthWidgetFactory)
    private authWidgetFactory: () => Widget;

    @inject(WindowService)
    private windowService: WindowService;

    onAuthFailed() {
        const authWidget = this.authWidgetFactory();
        const startupIndicator = this.getStartupIndicator(document.body)
        Widget.attach(authWidget, document.body, startupIndicator);
        if(startupIndicator) {
            document.body.removeChild(startupIndicator)
        }
        
    }

    loginWithBasicAuth(user: string, password: string) {
        // Using Basic auth and storing login data in basic storage is just for the POC. use an Identity for actual release
        localStorage.setItem(AUTH_STORAGE_KEY, `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`);
        // cant use window service here because for electron the reload handler is not yet registered 
        location.reload(); 
    }

    logout() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        this.windowService.reload();
    }

    private getStartupIndicator(host: HTMLElement): HTMLElement | undefined {
        const startupElements = host.getElementsByClassName('theia-preload');
        return startupElements.length === 0 ? undefined : startupElements[0] as HTMLElement;
    }

}