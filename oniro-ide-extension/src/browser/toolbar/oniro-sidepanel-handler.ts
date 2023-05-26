import { BoxLayout, BoxPanel, Panel, SidePanelHandler } from '@theia/core/lib/browser';
import { injectable } from 'inversify';

@injectable()
export class OniroSidePanelHandler extends SidePanelHandler {
    protected createContainer(): Panel {
        const contentBox = new BoxLayout({ direction: 'top-to-bottom', spacing: 0 });
        BoxPanel.setStretch(this.toolBar, 0);
        contentBox.addWidget(this.toolBar);
        BoxPanel.setStretch(this.dockPanel, 1);
        contentBox.addWidget(this.dockPanel);
        const contentPanel = new BoxPanel({ layout: contentBox });

        const side = this.side;
        let direction: BoxLayout.Direction;
        switch (side) {
            case 'left':
                direction = 'left-to-right';
                break;
            case 'right':
                direction = 'right-to-left';
                break;
            default:
                throw new Error('Illegal argument: ' + side);
        }
        const containerLayout = new BoxLayout({ direction, spacing: 0 });
        BoxPanel.setStretch(contentPanel, 1);
        containerLayout.addWidget(contentPanel);
        const boxPanel = new BoxPanel({ layout: containerLayout });
        boxPanel.addClass('theia-sidebar-content');
        boxPanel.id = 'theia-' + side + '-content-panel';
        return boxPanel;
    }
}