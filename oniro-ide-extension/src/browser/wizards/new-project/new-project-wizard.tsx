import { nls, URI } from "@theia/core";
import { WizardDialog, WizardPage, WizardDialogProps, WizardPages } from "../wizard-dialog";
import * as React from "react";
import { codicon, createTreeContainer, DialogError, TreeModel, TreeWidget } from "@theia/core/lib/browser";
import { FileDialogService } from "@theia/filesystem/lib/browser/file-dialog"
import { inject, injectable, interfaces } from "@theia/core/shared/inversify";
import { ChipSelectStep, ChipTree, chipTreeWidget, ChipTreeWidget } from "./chipSelect";
import { NewProjectConfig } from "../../services/project-creation-service";

export const NewProjectWizardFactory = Symbol('newProjectWizardFactory')

export function createNewProjectWizardContainer(parent: interfaces.Container): interfaces.Container {
    const child = parent.createChild();

    child.bind(WizardPages).to(LocationChooseStep);

    const treeContainer = createTreeContainer(child, { tree: ChipTree, widget: ChipTreeWidget, props: { search: true } });
    child.bind(chipTreeWidget).toConstantValue(treeContainer.get(TreeWidget) as TreeWidget);
    child.bind(TreeModel).toConstantValue(treeContainer.get(TreeModel));
    child.bind(WizardPages).to(ChipSelectStep);

    child.bind(WizardPages).to(FeatureSelectStep);

    child.bind(WizardDialogProps).toConstantValue({ title: nls.localize('oniro/newProjectWizard/title', 'Create New Project'), configObject: {} });

    child.bind(WizardDialog<NewProjectConfig>).toSelf();

    return child;
}

@injectable()
class LocationChooseStep extends WizardPage<NewProjectConfig> {
    readonly title: string = nls.localize('oniro/newProjectWizard/projectLocation', 'Select Project Location')

    @inject(FileDialogService)
    private fileDialogService: FileDialogService

    render(configObject: NewProjectConfig): React.ReactNode {
        return <div>
            <div className="location-chooser-panel">
                <input className='theia-input project-location-field' type='text' defaultValue={configObject.location?.path.toString().substring(1)} onChange={(e) => configObject.location = URI.fromFilePath(e.target.value)} />
                <button className={codicon('folder-opened') + ' theia-button'} onClick={() => this.openFileDialog(configObject)}></button>
            </div>
        </div>
    }

    isValid(configObject: NewProjectConfig): DialogError {
        return configObject.location ? '' : nls.localize('oniro/newProjectWizard/invalidLocationError', 'Invalid location');
    }

    async openFileDialog(configObject: NewProjectConfig) {
        const uri = await this.fileDialogService.showOpenDialog({
            title: nls.localize('oniro/newProjectWizard/projectLocation', 'Project Location'),
            openLabel: nls.localize('oniro/newProjectWizard/select', 'select'),
            canSelectFiles: false,
            canSelectFolders: true
        });
        configObject.location = uri?.withPath(uri.path.join('new_project'));
        this.requestUpdateEmitter.fire();
    }
}

@injectable()
class FeatureSelectStep extends WizardPage<NewProjectConfig> {
    readonly title: string = nls.localize('oniro/newProjectWizard/featureSelectTitle', 'Manage Runtime Environment')

    render(configObject: NewProjectConfig): React.ReactNode {
        // TODO non static table with actual content
        return <div>
            <table>
                <thead>
                    <tr><th></th><th>Variant</th><th>Version</th><th>Description</th></tr>
                </thead>
                <tbody>
                    <tr><td><input type='checkbox' /></td><td></td><td>3.40.0</td><td>CMSIS-Core</td></tr>
                    <tr><td><input type='checkbox' /></td><td></td><td>1.4.2</td><td>CMSIS-DSP Library</td></tr>
                    <tr><td><input type='checkbox' /></td><td></td><td>1.0</td><td>CMSIS DSP Library</td></tr>
                </tbody>
            </table>
        </div>
    }

    isValid(configObject: NewProjectConfig): DialogError {
        return true;
    }
}
