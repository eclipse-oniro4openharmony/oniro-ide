import { ToolbarContribution } from '@theia/toolbar/lib/browser/toolbar-interfaces';
import { ToolbarDefaultsFactory } from '@theia/toolbar/lib/browser/toolbar-defaults';
import { OniroToolbarDefaults } from './oniro-toolbar-defaults';
import { OniroToolbarSideContribution } from './layout/oniro-toolbar-side-contribution';
import { CommandContribution, MenuContribution } from '@theia/core';
import { interfaces } from '@theia/core/shared/inversify';
import { OniroToolbarManagerContribution } from './manager/oniro-toolbar-manager-contribution';
import { OniroToolbarCommands } from './manager/oniro-toolbar-commands';

export const bindOniroToolbarContribution = (bind: interfaces.Bind, rebind: interfaces.Rebind) => {
    bind(OniroToolbarSideContribution).toSelf().inSingletonScope();
    bind(ToolbarContribution).toService(OniroToolbarSideContribution);
    bind(CommandContribution).toService(OniroToolbarSideContribution);
    bind(MenuContribution).toService(OniroToolbarSideContribution);
    bind(OniroToolbarManagerContribution).toSelf().inSingletonScope();
    bind(CommandContribution).toService(OniroToolbarManagerContribution);
    bind(OniroToolbarCommands).toSelf().inSingletonScope();
    bind(CommandContribution).toService(OniroToolbarCommands);
    rebind(ToolbarDefaultsFactory).toConstantValue(OniroToolbarDefaults);
};