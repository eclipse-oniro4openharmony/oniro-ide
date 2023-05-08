import { DeflatedToolbarTree, ToolbarAlignment } from '@theia/toolbar/lib/browser/toolbar-interfaces';
import { OniroToolbarSideContribution } from './layout/oniro-toolbar-side-contribution';
import { GettingStartedCommand } from '@theia/getting-started/lib/browser/getting-started-contribution';
import { FILE_NAVIGATOR_TOGGLE_COMMAND_ID } from '@theia/navigator/lib/browser/navigator-contribution';

// This file specifies the default layout of the toolbar. This binding should be overridden for extenders.
// Both Toolbar Command Items and Toolbar Contributions can be specified here.
export const OniroToolbarDefaults: () => DeflatedToolbarTree = () => ({
    items: {
        [ToolbarAlignment.LEFT]: [],
        [ToolbarAlignment.CENTER]: [[]],
        [ToolbarAlignment.RIGHT]: [
            [
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
                }
            ],
            [
                {
                    id: OniroToolbarSideContribution.ID,
                    group: 'contributed'
                }
            ]
        ]
    },
});
