import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';
import { ProjectMenuContribution } from './menus/project-menu';
import { ProjectCommandContribution } from './commands/project-commands';
import { LocalizationMenuContribution } from './menus/localization-menu';

export default new ContainerModule(bind => {

    bind(CommandContribution).to(ProjectCommandContribution).inSingletonScope();
    bind(MenuContribution).to(ProjectMenuContribution).inSingletonScope();
    bind(MenuContribution).to(LocalizationMenuContribution).inSingletonScope();
});
