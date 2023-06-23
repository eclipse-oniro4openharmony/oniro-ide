import { createTreeContainer, ExpandableTreeNode, SelectableTreeNode, TreeImpl, TreeWidget, ViewContainer } from "@theia/core/lib/browser";
import { inject, injectable, interfaces, postConstruct } from "@theia/core/shared/inversify";
import { NavigatorWidgetFactory } from "@theia/navigator/lib/browser";
import { OniroServer } from "../../common/oniro-protocol";

export const TARGET_HARDWARE_WIDGET_ID = 'onir.target-hardware'

export class OniroNavigatorWidgetFactor extends NavigatorWidgetFactory {

    protected targetHardwareWidgetOptions: ViewContainer.Factory.WidgetOptions = {
        order: -1,
        canHide: false,
        initiallyCollapsed: false,
        weight: 80,
        disableDraggingToOtherContainers: true
    };


    override async createWidget(): Promise<ViewContainer> {
        const viewContainer = await super.createWidget();
        const targetHardwareWidget = await this.widgetManager.getOrCreateWidget(TARGET_HARDWARE_WIDGET_ID)
        viewContainer.addWidget(targetHardwareWidget, this.targetHardwareWidgetOptions);
        return viewContainer
    }
}

export function createTargethardwareContainer(container: interfaces.Container): interfaces.Container {
    return createTreeContainer(container, { tree: HardwareTree, widget: TargetHardwareWidget, props: { search: true } });
}

@injectable() 
export class HardwareTree extends TreeImpl {

    @inject(OniroServer)
    private oniroServer: OniroServer;

    @postConstruct()
    async init() {
        const vendors = await this.oniroServer.getBoards();
        
        const root = <ExpandableTreeNode>{
            id: 'root',
            parent: undefined,
            expanded: true,
            visible: false
        }

        root.children = vendors.map(platform => {
            const parent = <ExpandableTreeNode>{
                id: platform.name,
                parent: this.root,
                name: platform.name,
                expanded: false
            }
            parent.children = platform.boards.map(board => (
                <SelectableTreeNode>{
                    id: board.name,
                    name: board.name,
                    selected: false,
                    parent
                }
            ));
            return parent;
        });

        this.root = root;
    }

}

@injectable()
export class TargetHardwareWidget extends TreeWidget {
    @postConstruct()
    protected init(): void {
        super.init();
        this.title.label = 'Target Hardware'

        this.node.style.height = '100%'
    }
}