import { ToolbarContribution } from '@theia/toolbar/lib/browser/toolbar-interfaces';
import { ToolbarDefaultsFactory } from '@theia/toolbar/lib/browser/toolbar-defaults';
import { OniroToolbarDefaults } from './oniro-toolbar-defaults';
import { OniroToolbarSideContribution } from './layout/oniro-toolbar-side-contribution';
import { CommandContribution, MenuContribution } from '@theia/core';
import { Container, interfaces } from '@theia/core/shared/inversify';
import { OniroToolbarManagerContribution } from './manager/oniro-toolbar-manager-contribution';
import { OniroToolbarCommands } from './manager/oniro-toolbar-commands';
import { OniroIconService } from '../services/oniro-icon-service';
import { OniroApplicationShellToolbarOverride } from './oniro-application-shell-toolbar-override';
import { ApplicationShell, PreferenceContribution, SidePanelHandlerFactory } from '@theia/core/lib/browser';
import { PreferenceProxyFactory } from '@theia/core/lib/browser/preferences/injectable-preference-proxy';
import { OniroSidePanelHandler } from './oniro-sidepanel-handler';
import '../../../src/browser/toolbar/index.css'
import { OniroVerticalToolbarImpl } from './oniro-vertical-toolbar';
import { OniroVerticalToolbarController } from './oniro-vertical-toolbar-controller';
import { OniroVerticalToolbarFactory, OniroVerticalToolbar } from './oniro-toolbar-interfaces';
import { OniroToolbarPreferences, OniroToolbarPreferencesContribution, OniroToolbarPreferencesSchema } from './oniro-toolbar-preference-contribution';
import { LayoutSelectionContribution } from './layout/layout-selection';

export const bindOniroToolbarContribution = (bind: interfaces.Bind, rebind: interfaces.Rebind) => {
    bind(OniroToolbarSideContribution).toSelf().inSingletonScope();
    bind(ToolbarContribution).toService(OniroToolbarSideContribution);
    bind(CommandContribution).toService(OniroToolbarSideContribution);
    bind(MenuContribution).toService(OniroToolbarSideContribution);
    bind(LayoutSelectionContribution).toSelf().inSingletonScope();
    bind(ToolbarContribution).toService(LayoutSelectionContribution);
    bind(CommandContribution).toService(LayoutSelectionContribution);
    bind(MenuContribution).toService(LayoutSelectionContribution);
    bind(OniroToolbarManagerContribution).toSelf().inSingletonScope();
    bind(CommandContribution).toService(OniroToolbarManagerContribution);
    bind(OniroToolbarCommands).toSelf().inSingletonScope();
    bind(CommandContribution).toService(OniroToolbarCommands);
    rebind(ToolbarDefaultsFactory).toFactory(OniroToolbarDefaults);
    bind(OniroIconService).toSelf().inSingletonScope();

    bind(OniroApplicationShellToolbarOverride).toSelf().inSingletonScope();
    rebind(ApplicationShell).toService(OniroApplicationShellToolbarOverride);
    rebind(SidePanelHandlerFactory).toAutoFactory(OniroSidePanelHandler);
    bind(OniroSidePanelHandler).toSelf();

    bindVerticalToolbar(bind);
    bindOniroToolbarPreferences(bind);
};

function bindVerticalToolbar(bind: interfaces.Bind): void {
    bind(OniroVerticalToolbarFactory).toFactory(({ container }) => (): OniroVerticalToolbar => {
        const child = new Container({ defaultScope: 'Singleton' });
        child.parent = container;
        child.bind(OniroVerticalToolbar).to(OniroVerticalToolbarImpl);
        return child.get(OniroVerticalToolbar);
    });

    bind(OniroVerticalToolbarController).toSelf().inSingletonScope();
}

function bindOniroToolbarPreferences(bind: interfaces.Bind): void {
    bind(OniroToolbarPreferences).toDynamicValue(ctx => {
        const factory = ctx.container.get<PreferenceProxyFactory>(PreferenceProxyFactory);
        return factory(OniroToolbarPreferencesSchema);
    }).inSingletonScope();
    bind(OniroToolbarPreferencesContribution).toConstantValue({ schema: OniroToolbarPreferencesSchema });
    bind(PreferenceContribution).toService(OniroToolbarPreferencesContribution);
}
