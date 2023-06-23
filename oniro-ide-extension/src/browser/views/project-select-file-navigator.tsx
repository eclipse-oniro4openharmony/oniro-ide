
import { nls } from '@theia/core'
import { inject, injectable } from '@theia/core/shared/inversify'
import { ReactNode } from '@theia/core/shared/react'
import React = require('@theia/core/shared/react')
import { FileNavigatorWidget } from '@theia/navigator/lib/browser'

import '../../../src/browser/views/styles/project-select-file-navigator.css'
import { ProjectService } from '../services/project-service'

@injectable()
export class ProjectSelectFileNavigatorWidget extends FileNavigatorWidget {

    @inject(ProjectService) projectService: ProjectService;

    protected render(): ReactNode {
        return <React.Fragment>
            <div>
                <select className='theia-select file-navigator-select' onSelect={this.projectSelected}>
                    {<option key="active_project" value="" disabled selected hidden>{nls.localize('oniro/projectSelect/activeProject', 'Active Project')}</option>}
                    {this.workspaceService.tryGetRoots().map(fileStat => <option key={fileStat.resource.toString()}>{fileStat.name}</option>)}
                </select>
            </div>
            {super.render()}
        </React.Fragment>
    }

    private projectSelected(e: React.SyntheticEvent<HTMLSelectElement, Event>) {
        // TODO: use correct root of active project
        this.projectService.activeProjectChanged(this.workspaceService.tryGetRoots()[0].resource)
        console.log(e.currentTarget.selectedOptions.item(0)?.innerHTML)
    }
}