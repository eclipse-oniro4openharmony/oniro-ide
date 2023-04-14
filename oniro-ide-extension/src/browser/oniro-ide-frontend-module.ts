/**
 * Generated using theia-extension-generator
 */
import { OniroIdeCommandContribution, OniroIdeMenuContribution } from './oniro-ide-contribution';
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';
import { ProjectMenuContribution } from './menus/project-menu';
import { ProjectCommandContribution } from './commands/project-commands';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(OniroIdeCommandContribution);
    bind(MenuContribution).to(OniroIdeMenuContribution);

    bind(CommandContribution).to(ProjectCommandContribution).inSingletonScope();
    bind(MenuContribution).to(ProjectMenuContribution).inSingletonScope();
});
