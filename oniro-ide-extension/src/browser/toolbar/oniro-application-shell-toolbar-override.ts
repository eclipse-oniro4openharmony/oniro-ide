import { MAXIMIZED_CLASS } from '@theia/core/lib/browser/shell/theia-dock-panel';
import { ApplicationShellWithToolbarOverride } from '@theia/toolbar/lib/browser/application-shell-with-toolbar-override';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { BoxPanel, Layout, SplitPanel } from '@theia/core/lib/browser';
import { OniroVerticalToolbar, OniroVerticalToolbarFactory } from './oniro-toolbar-interfaces';
import { ONIRO_TOOLBAR_SIDE_ID, OniroToolbarPreferences } from './oniro-toolbar-preference-contribution';
import { ToolbarController } from '@theia/toolbar/lib/browser/toolbar-controller';
import { movableDefaultItems } from './oniro-toolbar-defaults';

@injectable()
export class OniroApplicationShellToolbarOverride extends ApplicationShellWithToolbarOverride {
    @inject(OniroToolbarPreferences) protected oniroToolbarPreferences: OniroToolbarPreferences;
    @inject(OniroVerticalToolbarFactory) protected readonly verticalToolbarFactory: () => OniroVerticalToolbar;
    @inject(ToolbarController) protected toolbarController: ToolbarController;

    protected leftToolbar: OniroVerticalToolbar;
    protected rightToolbar: OniroVerticalToolbar;

    @postConstruct()
    protected override async init(): Promise<void> {
        this.leftToolbar = this.verticalToolbarFactory();
        this.leftToolbar.id = 'left-toolbar';
        this.rightToolbar = this.verticalToolbarFactory();
        this.rightToolbar.id = 'right-toolbar';
        super.init();
        await this.toolbarPreferences.ready;
        this.tryShowVerticalToolbar();
        this.mainPanel.onDidToggleMaximized(() => {
            this.tryShowVerticalToolbar();
        });
        this.bottomPanel.onDidToggleMaximized(() => {
            this.tryShowVerticalToolbar();
        });
        this.preferenceService.onPreferenceChanged(event => {
            if (event.preferenceName === ONIRO_TOOLBAR_SIDE_ID) {
                this.tryShowVerticalToolbar();
            }
        });
    }

    protected tryShowVerticalToolbar(): boolean {
        const toolbarSide = this.oniroToolbarPreferences[ONIRO_TOOLBAR_SIDE_ID];
        const isShellMaximized = this.mainPanel.hasClass(MAXIMIZED_CLASS) || this.bottomPanel.hasClass(MAXIMIZED_CLASS);
        this.updateMainToolbarItems(toolbarSide);
        if (toolbarSide === 'left' && !isShellMaximized) {
            this.leftToolbar.show();
            this.rightToolbar.hide();
            
            return true;
        } else if (toolbarSide === 'right' && !isShellMaximized) {
            this.rightToolbar.show();
            this.leftToolbar.hide();
            return true;
        }
        this.leftToolbar.hide();
        this.rightToolbar.hide();
        return false;
    }

    protected async updateMainToolbarItems(toolbarSide: string) {
        if(this.toolbarController.toolbarItems) {
            const toolbarItems = this.toolbarController.toolbarItems;
            await this.toolbarController.clearAll();
            if (toolbarSide === 'top') {
                if(toolbarItems.items.right.length > 1) {
                    toolbarItems.items.right[0].push(...movableDefaultItems)
                } else {
                    toolbarItems.items.right.splice(0, 0, movableDefaultItems)
                }
            } else if(toolbarItems.items.right.length > 1) {
                toolbarItems.items.right[0] = [];
            }
            this.toolbarController.toolbarItems = toolbarItems; // notifiy toolbar about changed items
            await this.toolbarController.openOrCreateJSONFile();
        }
    }

    protected override createLayout(): Layout {
        const bottomSplitLayout = this.createSplitLayout(
            [this.mainPanel, this.bottomPanel],
            [1, 0],
            { orientation: 'vertical', spacing: 0 },
        );
        const panelForBottomArea = new SplitPanel({ layout: bottomSplitLayout });
        panelForBottomArea.id = 'theia-bottom-split-panel';

        const leftRightSplitLayout = this.createSplitLayout(
            [this.leftPanelHandler.container, panelForBottomArea, this.rightPanelHandler.container],
            [0, 1, 0],
            { orientation: 'horizontal', spacing: 0 },
        );
        const panelForSideAreas = new SplitPanel({ layout: leftRightSplitLayout });
        panelForSideAreas.id = 'theia-left-right-split-panel';

        const leftRightBoxLayout = this.createBoxLayout(
            [this.leftToolbar, panelForSideAreas, this.rightToolbar],
            [0, 0, 0],
            { direction: 'left-to-right', spacing: 0 },
        );
        const panelForVerticalToolbarAreas = new BoxPanel({ layout: leftRightBoxLayout });
        panelForSideAreas.id = 'theia-left-right-box-panel';
        return this.createBoxLayout(
            [this.topPanel, this.toolbar, panelForVerticalToolbarAreas, this.statusBar],
            [0, 0, 1, 0],
            { direction: 'top-to-bottom', spacing: 0 },
        );
    }
}
