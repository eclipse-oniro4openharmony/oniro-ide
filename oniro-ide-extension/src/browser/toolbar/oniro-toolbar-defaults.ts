import { DeflatedToolbarTree, ToolbarAlignment } from '@theia/toolbar/lib/browser/toolbar-interfaces';
import { OniroToolbarSideContribution } from './layout/oniro-toolbar-side-contribution';

// This file specifies the default layout of the toolbar. This binding should be overridden for extenders.
// Both Toolbar Command Items and Toolbar Contributions can be specified here.
export const OniroToolbarDefaults: () => DeflatedToolbarTree = () => ({
    items: {
        [ToolbarAlignment.LEFT]: [],
        [ToolbarAlignment.CENTER]: [[]],
        [ToolbarAlignment.RIGHT]: [
            [
                {
                    id: OniroToolbarSideContribution.ID,
                    group: 'contributed'
                }
            ]
        ]
    },
});
