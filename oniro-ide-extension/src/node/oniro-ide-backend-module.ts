import { ContainerModule } from '@theia/core/shared/inversify';
import { LocalizationContribution } from '@theia/core/lib/node/i18n/localization-contribution';

import { OniroLocalizationContribution } from './i18n/oniro-localization-contribution';
import { ConnectionHandler, RpcConnectionHandler } from '@theia/core';
import { OniroServer, servicePath } from '../common/oniro-protocol';
import { DeviceToolProvider } from './device-tool-provider';
import { BackendApplicationContribution } from "@theia/core/lib/node";
import { DeviceToolBackendContribution } from './device-tool-backend-contribution';
import { WsRequestValidatorContribution } from '@theia/core/lib/node/ws-request-validators'
import { AuthRequestValidatorContribution } from './auth/auth-validator-contribution';

export default new ContainerModule(bind => {
    bind(LocalizationContribution).to(OniroLocalizationContribution).inSingletonScope();

    bind(DeviceToolProvider).toSelf().inSingletonScope();
    bind(OniroServer).to(DeviceToolProvider).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx => 
        new RpcConnectionHandler(servicePath, () => {
            const oniroServer = ctx.container.get<OniroServer>(OniroServer);
            return oniroServer;
        })).inSingletonScope();

    bind(DeviceToolBackendContribution).toSelf().inSingletonScope();
    bind(BackendApplicationContribution).toService(DeviceToolBackendContribution);

    bind(AuthRequestValidatorContribution).toSelf().inSingletonScope();
    bind(WsRequestValidatorContribution).toService(AuthRequestValidatorContribution);
});
