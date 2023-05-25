import { DeflatedToolbarTree, ToolbarAlignment } from '@theia/toolbar/lib/browser/toolbar-interfaces';
import { OniroToolbarSideContribution } from './layout/oniro-toolbar-side-contribution';
import { GettingStartedCommand } from '@theia/getting-started/lib/browser/getting-started-contribution';
import { FILE_NAVIGATOR_TOGGLE_COMMAND_ID } from '@theia/navigator/lib/browser/navigator-contribution';
import { interfaces } from '@theia/core/shared/inversify';
import { OniroToolbarPreferences, ONIRO_TOOLBAR_SIDE_ID } from './oniro-toolbar-preference-contribution';

// This file specifies the default layout of the toolbar. This binding should be overridden for extenders.
// Both Toolbar Command Items and Toolbar Contributions can be specified here.
export const OniroToolbarDefaults: (ctx: interfaces.Context) => () => DeflatedToolbarTree = (ctx) => () => ({
    items: {
        [ToolbarAlignment.LEFT]: [],
        [ToolbarAlignment.CENTER]: [[]],
        [ToolbarAlignment.RIGHT]: [
            ctx.container.get<OniroToolbarPreferences>(OniroToolbarPreferences)[ONIRO_TOOLBAR_SIDE_ID] === 'top' ? movableDefaultItems : [],
            [
                {
                    id: OniroToolbarSideContribution.ID,
                    group: 'contributed'
                }
            ]
        ]
    },
});

// items that are allways there and can "move" to the sidetoolbar
export const movableDefaultItems = [
    {
        id: GettingStartedCommand.id,
        command: GettingStartedCommand.id,
        tooltip: 'Getting Started',
        icon: 'codicon codicon-home',
    },
    {
        id: FILE_NAVIGATOR_TOGGLE_COMMAND_ID,
        command: FILE_NAVIGATOR_TOGGLE_COMMAND_ID,
        tooltip: 'Explorer',
        icon: 'codicon codicon-files'
    },
    {
        id: 'debug:toggle',
        command: 'debug:toggle',
        tooltip: 'Debug',
        icon: 'codicon codicon-debug',
    }
];
