
import { nls } from '@theia/core'
import { injectable } from '@theia/core/shared/inversify'
import { ReactNode } from '@theia/core/shared/react'
import React = require('@theia/core/shared/react')
import { FileNavigatorWidget } from '@theia/navigator/lib/browser'

import '../../../src/browser/views/styles/project-select-file-navigator.css'

@injectable()
export class ProjectSelectFileNavigatorWidget extends FileNavigatorWidget {

    protected render(): ReactNode {
        return <React.Fragment>
            <div>
                <select className='theia-select file-navigator-select' onSelect={this.projectSelected}>
                    {<option value="" disabled selected hidden>{nls.localize('oniro/projectSelect/activeProject', 'Active Project')}</option>}
                    {this.workspaceService.tryGetRoots().map(fileStat => <option>{fileStat.name}</option>)}
                </select>
                <select className='theia-select file-navigator-select'>
                    <option value="" disabled selected hidden>{nls.localize('oniro/projectSelect/targetHardware', 'Target Hardware')}</option>
                </select>
            </div>
            {super.render()}
        </React.Fragment>
    }

    private projectSelected(e: React.SyntheticEvent<HTMLSelectElement, Event>) {
        console.log(e.currentTarget.selectedOptions.item(0)?.innerHTML)
    }

}