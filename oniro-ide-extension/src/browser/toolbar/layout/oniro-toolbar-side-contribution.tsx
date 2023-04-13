import { CommandContribution, CommandRegistry, MenuModelRegistry, MenuPath } from '@theia/core';
import { inject, injectable } from '@theia/core/shared/inversify';
import * as React from '@theia/core/shared/react';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { AbstractToolbarContribution } from '@theia/toolbar/lib/browser/abstract-toolbar-contribution';
import { ReactInteraction } from '@theia/toolbar/lib/browser/toolbar-constants';
import '../../../../src/browser/toolbar/layout/oniro-toolbar-side-contribution.css';

export const PLACE_TOOLBAR_LEFT = {
    id: 'place.toolbar.left',
    category: 'ToolbarLayout',
    label: 'Place toolbar left'
};
export const PLACE_TOOLBAR_RIGHT = {
    id: 'place.toolbar.right',
    category: 'ToolbarLayout',
    label: 'Place toolbar right'
};
export const PLACE_TOOLBAR_TOP = {
    id: 'place.toolbar.top',
    category: 'ToolbarLayout',
    label: 'Place toolbar top'
};
export const ONIRO_TOOLBAR_SIDE_CONTEXT_MENU: MenuPath = ['toolbar:toolbarSideContextMenu'];

@injectable()
export class OniroToolbarSideContribution extends AbstractToolbarContribution implements CommandContribution {
    @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService;

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
                title='Place toolbar to side or top'
            >
            </div>);
    }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(PLACE_TOOLBAR_LEFT, {
            execute: async () => {
                alert('Place toolbar to left');
            },
        });
        registry.registerCommand(PLACE_TOOLBAR_RIGHT, {
            execute: async () => {
                alert('Place toolbar to right');
            },
        });
        registry.registerCommand(PLACE_TOOLBAR_TOP, {
            execute: async () => {
                alert('Place toolbar to top');
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
