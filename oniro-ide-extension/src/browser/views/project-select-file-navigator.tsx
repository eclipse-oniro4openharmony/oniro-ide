
import { CommandRegistry, nls } from '@theia/core'
import { inject, injectable } from '@theia/core/shared/inversify'
import { ReactNode } from '@theia/core/shared/react'
import React = require('@theia/core/shared/react')
import { FileNavigatorWidget } from '@theia/navigator/lib/browser'

import '../../../src/browser/views/styles/project-select-file-navigator.css'
import '../../../src/browser/views/styles/theia-navigator-toolbar.css'
import { ProjectService } from '../services/project-service'

@injectable()
export class ProjectSelectFileNavigatorWidget extends FileNavigatorWidget {

    @inject(ProjectService) projectService: ProjectService;
    @inject(CommandRegistry) commands: CommandRegistry;

    protected render(): ReactNode {
        const projectCommands = this.projectService.getProjectTaskCommands();
        return <React.Fragment>
            <div>
                <select className='theia-select file-navigator-select' onSelect={this.projectSelected}>
                    {<option key="active_project" value="" disabled selected hidden>{nls.localize('oniro/projectSelect/activeProject', 'Active Project')}</option>}
                    {this.workspaceService.tryGetRoots().map(fileStat => <option key={fileStat.resource.toString()}>{fileStat.name}</option>)}
                </select>
            </div>
            {
                projectCommands.length > 0 &&
                <div id='theia-navigator-toolbar-container'>
                    <div id='theia-navigator-toolbar'>{
                        projectCommands.map((item, idx) => {
                            return <>
                                <div
                                    key={'tbi-' + idx}
                                    className={`${item.iconClass ?? ''} toolbar-item`}
                                    onClick={() => this.commands.executeCommand(item.id)}
                                    title={item.label}
                                >
                                </div>
                            </>
                        })
                    }</div>
                </div>
            }
            {super.render()}
        </React.Fragment>
    }

    private projectSelected(e: React.SyntheticEvent<HTMLSelectElement, Event>) {
        // TODO: use correct root of active project
        this.projectService.activeProjectChanged(this.workspaceService.tryGetRoots()[0].resource)
        console.log(e.currentTarget.selectedOptions.item(0)?.innerHTML)
    }
}