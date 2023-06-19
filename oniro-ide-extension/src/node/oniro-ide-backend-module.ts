import { ContainerModule } from '@theia/core/shared/inversify';
import { LocalizationContribution } from '@theia/core/lib/node/i18n/localization-contribution';

import { OniroLocalizationContribution } from './i18n/oniro-localization-contribution';
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core';
import { OniroClient, OniroServer, servicePath } from '../common/oniro-protocol';
import { ProjectTasksProvider } from './project-tasks-provider';
import { BackendApplicationContribution } from "@theia/core/lib/node";
import { DeviceToolBackendContribution } from './device-tool-backend-contribution';
import { OniroFileSearch } from './oniro-file-search';
import { FileSearchService } from '@theia/file-search/lib/common/file-search-service';
import { WsRequestValidatorContribution } from '@theia/core/lib/node/ws-request-validators'
import { AuthRequestValidatorContribution } from './auth/auth-validator-contribution';

export default new ContainerModule((bind, _, __, rebind) => {
    bind(LocalizationContribution).to(OniroLocalizationContribution).inSingletonScope();

    bind(ProjectTasksProvider).toSelf().inSingletonScope();
    bind(OniroServer).to(ProjectTasksProvider).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx => 
        new JsonRpcConnectionHandler<OniroClient>(servicePath, client => {
            const oniroServer = ctx.container.get<OniroServer>(OniroServer);
            oniroServer.setClient(client);
            return oniroServer;
        })).inSingletonScope();

    bind(DeviceToolBackendContribution).toSelf().inSingletonScope();
    bind(BackendApplicationContribution).toService(DeviceToolBackendContribution);
    rebind(FileSearchService).to(OniroFileSearch).inSingletonScope();

    bind(AuthRequestValidatorContribution).toSelf().inSingletonScope();
    bind(WsRequestValidatorContribution).toService(AuthRequestValidatorContribution);
});
