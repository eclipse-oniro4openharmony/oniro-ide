/**
 * Generated using theia-extension-generator
 */
import { OniroIdeCommandContribution, OniroIdeMenuContribution } from './oniro-ide-contribution';
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(OniroIdeCommandContribution);
    bind(MenuContribution).to(OniroIdeMenuContribution);
});
