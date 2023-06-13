import { interfaces } from '@theia/core/shared/inversify';
import { AuthenticatingWebsocketConnectionProvider } from './authenticating-websocket-connection-provider';
import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { AuthService, AuthWidgetFactory } from './auth-service';
import { AuthWidget } from './auth-widget';
import '../../../src/browser/auth/index.css'
import { AuthenticationContribution } from './authentication-contribution';
import { CommandContribution, MenuContribution } from '@theia/core';

export const bindOniroFrontendAuthContribution = (bind: interfaces.Bind, rebind: interfaces.Rebind) => {
    bind(AuthService).toSelf().inSingletonScope();

    bind(AuthWidgetFactory).toFactory(ctx => () => {
        const continer = ctx.container.createChild();
        continer.bind(AuthWidget).toSelf().inSingletonScope();
        return continer.get(AuthWidget);
    });

    rebind(WebSocketConnectionProvider).to(AuthenticatingWebsocketConnectionProvider).inSingletonScope();

    bind(AuthenticationContribution).toSelf().inSingletonScope();
    bind(CommandContribution).toService(AuthenticationContribution);
    bind(MenuContribution).toService(AuthenticationContribution);
}