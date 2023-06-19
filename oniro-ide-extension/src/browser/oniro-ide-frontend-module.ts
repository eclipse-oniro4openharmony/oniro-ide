import '../../src/browser/styles/index.css';
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { ProjectMenuContribution } from './menus/project-menu';
import { ProjectCommandContribution } from './commands/project-commands';
import { ContainerModule, interfaces } from '@theia/core/shared/inversify';
import { bindOniroToolbarContribution } from './toolbar/oniro-toolbar-frontend-module';
import { LocalizationMenuContribution } from './menus/localization-menu';
import { NewProjectWizardFactory, createNewProjectWizardContainer } from './wizards/new-project/new-project-wizard';
import { WizardDialog } from './wizards/wizard-dialog';
import { NewProjectConfig, ProjectCreationService } from './services/project-creation-service';
import { FileNavigatorModel, FileNavigatorWidget, NavigatorDecoratorService } from '@theia/navigator/lib/browser';
import { createFileTreeContainer } from '@theia/filesystem/lib/browser';
import { FileNavigatorTree } from '@theia/navigator/lib/browser/navigator-tree';
import { ProjectSelectFileNavigatorWidget } from './views/project-select-file-navigator';
import { FILE_NAVIGATOR_PROPS } from '@theia/navigator/lib/browser/navigator-container'
import { SearchInWorkspaceFrontendContribution } from "@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution"
import { DebugFrontendApplicationContribution } from "@theia/debug/lib/browser/debug-frontend-application-contribution"
import { RightDebugFrontendApplicationContribution, RightSearchInWorkspaceFrontendContribution } from './repositioned-views';
import { OniroThemeContribution } from './theme/oniro-theme';
import { FrontendApplicationContribution, WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { OniroServer, servicePath } from '../common/oniro-protocol';
import { ProjectService } from './services/project-service';
import { bindOniroGettingStartedContribution } from './getting-started/oniro-getting-started-frontend-module';
import { bindOniroKeybindingsContribution } from './keybindings/oniro-keybindings-frontend-module';
import { bindOniroFrontendAuthContribution } from './auth/oniro-auth-frontend-module';

export default new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {

    bind(CommandContribution).to(ProjectCommandContribution).inSingletonScope();
    bind(MenuContribution).to(ProjectMenuContribution).inSingletonScope();
    bind(MenuContribution).to(LocalizationMenuContribution).inSingletonScope();
    
    bindOniroToolbarContribution(bind,rebind);
    bindOniroGettingStartedContribution(bind, rebind);
    bindOniroKeybindingsContribution(bind);
    bindOniroFrontendAuthContribution(bind, rebind);

    bind(ProjectCreationService).toSelf().inSingletonScope();
    bind(NewProjectWizardFactory).toFactory(ctx => () => createNewProjectWizardContainer(ctx.container).get(WizardDialog<NewProjectConfig>));

    rebind(SearchInWorkspaceFrontendContribution).to(RightSearchInWorkspaceFrontendContribution);
    rebind(DebugFrontendApplicationContribution).to(RightDebugFrontendApplicationContribution);

    rebind(FileNavigatorWidget).toDynamicValue(ctx => {
        return createFileTreeContainer(ctx.container, {
            tree: FileNavigatorTree,
            model: FileNavigatorModel,
            widget: ProjectSelectFileNavigatorWidget,
            decoratorService: NavigatorDecoratorService,
            props: FILE_NAVIGATOR_PROPS,
        }).get(ProjectSelectFileNavigatorWidget)
    })

    bind(FrontendApplicationContribution).to(OniroThemeContribution).inSingletonScope();

    bind(OniroServer).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        return connection.createProxy<OniroServer>(servicePath);
    });
    bind(ProjectService).toSelf().inSingletonScope();
});
