import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MenuPath, nls } from '@theia/core';
import { inject, injectable } from '@theia/core/shared/inversify';
import * as React from '@theia/core/shared/react';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { AbstractToolbarContribution } from '@theia/toolbar/lib/browser/abstract-toolbar-contribution';
import { ReactInteraction } from '@theia/toolbar/lib/browser/toolbar-constants';
import '../../../../src/browser/toolbar/layout/oniro-toolbar-side-contribution.css';
import { PreferenceService } from '@theia/core/lib/browser';
import { ONIRO_TOOLBAR_SIDE_ID } from '../oniro-toolbar-preference-contribution';

const ToolbarCategory = 'Toolbar';
const ToolbarCategoryKey = 'oniro/toolbar/category';

export const PLACE_TOOLBAR_LEFT = Command.toLocalizedCommand({
    id: 'place.toolbar.left',
    category: ToolbarCategory,
    label: 'Place toolbar left'
}, 'oniro/toolbar/placeLeft', ToolbarCategoryKey);
export const PLACE_TOOLBAR_RIGHT = Command.toLocalizedCommand({
    id: 'place.toolbar.right',
    category: ToolbarCategory,
    label: 'Place toolbar right'
}, 'oniro/toolbar/placeRight', ToolbarCategoryKey);
export const PLACE_TOOLBAR_TOP = Command.toLocalizedCommand({
    id: 'place.toolbar.top',
    category: ToolbarCategory,
    label: 'Place toolbar top'
}, 'oniro/toolbar/placeTop', ToolbarCategoryKey);
export const ONIRO_TOOLBAR_SIDE_CONTEXT_MENU: MenuPath = ['toolbar:toolbarSideContextMenu'];

@injectable()
export class OniroToolbarSideContribution extends AbstractToolbarContribution implements CommandContribution, MenuContribution {
    @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService;
    @inject(PreferenceService) protected readonly preferenceService: PreferenceService;

    static ID = 'oniro-toolbar-side-contribution';
    id = OniroToolbarSideContribution.ID;

    protected handleOnClick = (e: ReactInteraction<HTMLSpanElement>): void => this.doHandleOnClick(e);
    protected doHandleOnClick(e: ReactInteraction<HTMLSpanElement>): void {
        e.stopPropagation();
        const toolbar = document.querySelector<HTMLDivElement>('#main-toolbar');
        if (toolbar) {
            const { bottom } = toolbar.getBoundingClientRect();
            const { left } = e.currentTarget.getBoundingClientRect();
            this.contextMenuRenderer.render({
                includeAnchorArg: false,
                menuPath: ONIRO_TOOLBAR_SIDE_CONTEXT_MENU,
                anchor: { x: left, y: bottom },
            });
        }
    }

    render(): React.ReactNode {
        return (
            <div
                role='button'
                tabIndex={0}
                className='icon-wrapper action-label item enabled codicon codicon-layout-activitybar-right'
                id='toolbar-side-icon'
                onClick={this.handleOnClick}
                title={nls.localize('oniro/toolbar/placeTitle', 'Place toolbar to side or top')}
            >
            </div>);
    }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(PLACE_TOOLBAR_LEFT, {
            execute: async () => {
                this.preferenceService.set(ONIRO_TOOLBAR_SIDE_ID, 'left')
            },
        });
        registry.registerCommand(PLACE_TOOLBAR_RIGHT, {
            execute: async () => {
                this.preferenceService.set(ONIRO_TOOLBAR_SIDE_ID, 'right')
            },
        });
        registry.registerCommand(PLACE_TOOLBAR_TOP, {
            execute: async () => {
                this.preferenceService.set(ONIRO_TOOLBAR_SIDE_ID, 'top')
            },
        });
    }

    registerMenus(registry: MenuModelRegistry): void {
        registry.registerMenuAction(ONIRO_TOOLBAR_SIDE_CONTEXT_MENU, {
            commandId: PLACE_TOOLBAR_LEFT.id,
            order: 'a',
        });
        registry.registerMenuAction(ONIRO_TOOLBAR_SIDE_CONTEXT_MENU, {
            commandId: PLACE_TOOLBAR_RIGHT.id,
            order: 'b',
        });
        registry.registerMenuAction(ONIRO_TOOLBAR_SIDE_CONTEXT_MENU, {
            commandId: PLACE_TOOLBAR_TOP.id,
            order: 'c',
        });
    }
}
