import { ContainerModule } from '@theia/core/shared/inversify';
import { LocalizationContribution } from '@theia/core/lib/node/i18n/localization-contribution';

import { OniroLocalizationContribution } from './i18n/oniro-localization-contribution';
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core';
import { OniroClient, OniroServer, servicePath } from '../common/oniro-protocol';
import { DeviceToolProvider } from './device-tool-provider';
import { BackendApplicationContribution } from "@theia/core/lib/node";
import { DeviceToolBackendContribution } from './device-tool-backend-contribution';
import { OniroFileSearch } from './oniro-file-search';
import { FileSearchService } from '@theia/file-search/lib/common/file-search-service';


export default new ContainerModule((bind, _, __, rebind) => {
    bind(LocalizationContribution).to(OniroLocalizationContribution).inSingletonScope();

    bind(DeviceToolProvider).toSelf().inSingletonScope();
    bind(OniroServer).to(DeviceToolProvider).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx => 
        new JsonRpcConnectionHandler<OniroClient>(servicePath, client => {
            const oniroServer = ctx.container.get<OniroServer>(OniroServer);
            oniroServer.setClient(client);
            return oniroServer;
        })).inSingletonScope();

    bind(DeviceToolBackendContribution).toSelf().inSingletonScope();
    bind(BackendApplicationContribution).toService(DeviceToolBackendContribution);
    rebind(FileSearchService).to(OniroFileSearch).inSingletonScope();
});
