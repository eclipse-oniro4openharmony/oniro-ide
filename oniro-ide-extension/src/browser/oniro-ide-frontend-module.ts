import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { ProjectMenuContribution } from './menus/project-menu';
import { ProjectCommandContribution } from './commands/project-commands';
import { ContainerModule, interfaces } from '@theia/core/shared/inversify';
import { bindOniroToolbarContribution } from './toolbar/oniro-toolbar-frontend-module';
import { LocalizationMenuContribution } from './menus/localization-menu';

export default new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {

    bind(CommandContribution).to(ProjectCommandContribution).inSingletonScope();
    bind(MenuContribution).to(ProjectMenuContribution).inSingletonScope();
    bind(MenuContribution).to(LocalizationMenuContribution).inSingletonScope();
    
    bindOniroToolbarContribution(bind,rebind);
});
