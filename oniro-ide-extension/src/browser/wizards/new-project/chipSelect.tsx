import { nls } from "@theia/core";
import { DialogError, ExpandableTreeNode, Message, SelectableTreeNode, TreeImpl, TreeModel, TreeWidget } from "@theia/core/lib/browser";
import { inject, injectable, postConstruct } from "@theia/core/shared/inversify";
import { Emitter } from "@theia/core/shared/vscode-languageserver-protocol";
import React = require("react");
import { NewProjectConfig } from "../../services/project-creation-service";
import { WizardPage } from "../wizard-dialog";

interface ChipNode extends SelectableTreeNode {
    description: string
}

@injectable()
export class ChipTree extends TreeImpl {
    constructor() {
        super();
    }

    @postConstruct()
    init() {
        // TODO get chips from a service for currently supported ones
        const root = {
            id: 'root',
            parent: undefined,
            name: 'chips',
            children: [],
            expanded: true
        } as ExpandableTreeNode

        const arm = {
            id: 'ARM',
            parent: this._root,
            name: 'ARM',
            children: [],
            expanded: false
        } as ExpandableTreeNode;
        const stm = {
            id: 'STMicroelectronics',
            parent: this._root,
            name: 'STMicroelectronics',
            children: [],
            expanded: false
        } as ExpandableTreeNode;

        this.setChildren(root, [arm, stm])


        this.setChildren(arm, [
            {
                id: 'arm_chip_1',
                name: 'arm_chip_1',
                parent: arm,
                selected: false,
                description: 'some description about arm_chip_1 \n some more info'

            } as ChipNode
        ])

        this.setChildren(stm, [
            {
                id: 'stm_chip_1',
                name: 'stm_chip_1',
                parent: stm,
                selected: false,
                description: 'some text about stm_chip_1'
            } as ChipNode
        ])

        this.root = root;
    }
}

@injectable()
export class ChipTreeWidget extends TreeWidget {
    protected requestUpdateEmitter = new Emitter<void>();
    onRequestUpdate = this.requestUpdateEmitter.event;


    reactRender(): React.ReactNode {
        return this.render();
    }

    protected onUpdateRequest(msg: Message): void {
        super.onUpdateRequest(msg);
        this.requestUpdateEmitter.fire();
    }

    update(): void {
        super.update();
        this.requestUpdateEmitter.fire();
    }
}

export const chipTreeWidget = Symbol('chip-tree-widget');
@injectable()
export class ChipSelectStep extends WizardPage<NewProjectConfig> {
    readonly title: string = nls.localize('oniro/newProjectWizard/chipSelectTitle', 'Select Chip');

    @inject(chipTreeWidget)
    private chipTree: ChipTreeWidget;

    @inject(TreeModel)
    private treeModel: TreeModel;

    private configObject: NewProjectConfig

    @postConstruct()
    init() {
        this.chipTree.onRequestUpdate(() => this.requestUpdateEmitter.fire());
        this.treeModel.onSelectionChanged((nodes) => { this.configObject.chip = this.treeModel.selectedNodes[0].id })
    }

    render(configObject: NewProjectConfig): React.ReactNode {
        this.configObject = configObject;
        return <div style={{ display: 'flex' }}>
            <div className="chip-tree">{this.chipTree.reactRender()}</div>
            <div className="chip-description">{this.treeModel.selectedNodes[0]?.description}</div>
        </div>
    }

    isValid(configObject: NewProjectConfig): DialogError {
        return configObject.chip ? true : nls.localize('oniro/newProjectWizard/noChipSelectedMessage', 'Please select a chip');
    }
}
