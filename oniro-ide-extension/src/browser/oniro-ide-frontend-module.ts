import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';
import { ProjectMenuContribution } from './menus/project-menu';
import { ProjectCommandContribution } from './commands/project-commands';
import { LocalizationMenuContribution } from './menus/localization-menu';

import '../../src/browser/wizards/styles/wizard.css'
import '../../src/browser/wizards/styles/new-project-wizard.css'
import { NewProjectWizardFactory, createNewProjectWizardContainer } from './wizards/new-project/new-project-wizard';
import { WizardDialog } from './wizards/wizard-dialog';
import { NewProjectConfig, ProjectCreationService } from './services/project-creation-service';

export default new ContainerModule(bind => {
    bind(CommandContribution).to(OniroIdeCommandContribution);
    bind(MenuContribution).to(OniroIdeMenuContribution);
    bind(MenuContribution).to(LocalizationMenuContribution).inSingletonScope();

    bind(CommandContribution).to(ProjectCommandContribution).inSingletonScope();
    bind(MenuContribution).to(ProjectMenuContribution).inSingletonScope();

    bind(ProjectCreationService).toSelf().inSingletonScope();
    bind(NewProjectWizardFactory).toFactory(ctx => () => createNewProjectWizardContainer(ctx.container).get(WizardDialog<NewProjectConfig>));
});
