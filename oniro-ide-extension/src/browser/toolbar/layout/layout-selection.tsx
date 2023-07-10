import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, nls } from "@theia/core";
import { AbstractToolbarContribution } from '@theia/toolbar/lib/browser/abstract-toolbar-contribution';
import * as React from '@theia/core/shared/react';
import { ReactInteraction } from '@theia/toolbar/lib/browser/toolbar-constants';
import { inject, injectable } from "@theia/core/shared/inversify";
import { ApplicationShell, codicon } from "@theia/core/lib/browser";
import { FILE_NAVIGATOR_TOGGLE_COMMAND_ID } from "@theia/navigator/lib/browser/navigator-contribution";

interface Layout {
    name: string
    icon?: string
    toggle: string[]
}

const layouts: Layout[] = [
    {
        name: 'File',
        icon: codicon('files'),
        toggle: [
            FILE_NAVIGATOR_TOGGLE_COMMAND_ID
        ]
    },
    {
        name: 'Debug',
        icon: codicon('debug'),
        toggle: [
            'debug:toggle'
        ]
    }
]

const ONIRO_LAYOUT_SELECTION_MENU = ['layout_menu_selection'];

@injectable()
export class LayoutSelectionContribution extends AbstractToolbarContribution implements CommandContribution, MenuContribution  {

    @inject(ApplicationShell)
    protected readonly applicationShell: ApplicationShell;

    static ID = 'oniro-toolbar-layout-selection';
    id = LayoutSelectionContribution.ID;

    protected handleOnClick = (e: ReactInteraction<HTMLSpanElement>): void => this.doHandleOnClick(e);
    protected doHandleOnClick(e: ReactInteraction<HTMLSpanElement>): void {
        e.stopPropagation();
        const toolbar = document.querySelector<HTMLDivElement>('#main-toolbar');
        if (toolbar) {
            const { bottom } = toolbar.getBoundingClientRect();
            const { left } = e.currentTarget.getBoundingClientRect();
            this.contextMenuRenderer.render({
                includeAnchorArg: false,
                menuPath: ONIRO_LAYOUT_SELECTION_MENU,
                anchor: { x: left, y: bottom },
            });
        }
    }
    render(): React.ReactNode {
        return (
            <div
                role='button'
                tabIndex={0}
                className='icon-wrapper action-label item enabled codicon codicon-layout'
                id='toolbar-side-icon'
                onClick={this.handleOnClick}
                title={nls.localize('oniro/toolbar/switchLayout', 'Switch Layout')}
            >
            </div>);
    }

    registerMenus(menus: MenuModelRegistry): void {
        let i = 0;
        for (const layout of layouts) {
            menus.registerMenuAction(ONIRO_LAYOUT_SELECTION_MENU, {
                commandId: `oniro.layout.${layout.name}`,
                label: layout.name,
                icon: layout.icon,
                order: (i++).toString()
            });
        }
    }
    registerCommands(commands: CommandRegistry): void {
        for (const layout of layouts) {
            commands.registerCommand({
                id: `oniro.layout.${layout.name}`
            }, {
                execute: () => this.switchLayout(layout)
            })
        }
    }

    protected async switchLayout(layout: Layout): Promise<void> {
        const allPanelWidgets = [
            this.applicationShell.rightPanelHandler.dockPanel.widgets(),
            this.applicationShell.leftPanelHandler.dockPanel.widgets(),
            this.applicationShell.bottomPanel.widgets()
        ];
        for (const iterator of allPanelWidgets) {
            let widget = iterator.next();
            while (widget !== undefined) {
                widget.close();
                widget = iterator.next();
            }
        }
        await Promise.all(layout.toggle.map(toggle => this.commandService.executeCommand(toggle)));
    }

}