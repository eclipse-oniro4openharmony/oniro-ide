import * as React from 'react';
import { injectable } from 'inversify';
import { GettingStartedWidget } from '@theia/getting-started/lib/browser/getting-started-widget';
import { nls, URI } from "@theia/core";
import { URI as VSCodeURI } from "@theia/core/shared/vscode-uri";
import { codicon } from '@theia/core/lib/browser/widgets/widget'
import { NEW_PROJECT_COMMAND } from '../commands/project-commands'

interface DevEcoProject {
    uri: URI;
    name: string;
    location: string;
    creationDate: Date;
}

@injectable() 
export class OniroGettingStartedWidget extends GettingStartedWidget {

    private projectFilter: string = '';
    
    protected render(): React.ReactNode {
        return <div className="oniro-getting-started">
            { this.renderMainPanel() }
            { this.renderSidePanel() }
        </div>
    }

    private renderMainPanel(): React.ReactNode {
        return <div className="oniro-getting-started-main-panel">
            <h3 className="oniro-getting-started-header">{nls.localize('oniro/getting-started/welome', 'Welcome to DevdEco Device Tool')}</h3>
            { this.renderProjectTaskPanels()}
            { this.renderProjectSelection()}
        </div>
    }

    private renderProjectTaskPanels(): React.ReactNode {
        return <div className="oniro-getting-started-project-tasks">
            <button className="oniro-getting-started-task-button oniro-getting-started-new-project" onClick={() => this.commandRegistry.executeCommand(NEW_PROJECT_COMMAND.id)}>New Project</button>
            <button className="oniro-getting-started-task-button oniro-getting-started-import-project">Import Project</button>
            <button className="oniro-getting-started-task-button">Sample</button>
        </div>
    }

    private renderProjectSelection(): React.ReactNode {
        return <div>
            <h3>{nls.localize('oniro/getting-started/projects', 'Projects')}</h3>
            <div className='oniro-getting-started-project-search'>
                <input className='theia-input' placeholder={nls.localize('oniro/getting-started/project-search', 'Search Project')} onChange={(e) => this.onProjectSearchChanged(e)}/>
                <div className={codicon('search')}/>
            </div>
            <table className='oniro-getting-project-table' cellSpacing='0' cellPadding='0'>
                <thead>
                <tr className='oniro-getting-project-table-header'>
                    <th>{nls.localize('oniro/getting-started/project-name', 'Name')}</th>
                    <th>{nls.localize('oniro/getting-started/project-location', 'Location')}</th>
                    <th>{nls.localize('oniro/getting-started/project-creation', 'Created')}</th>
                </tr>
                </thead>
                <tbody>
                { this.findRecentDevEcoProjects(this.projectFilter).map(project => 
                    <tr className='oniro-getting-project-table-data' key={project.name} onClick={() => this.commandRegistry.executeCommand('vscode.openFolder', VSCodeURI.parse(project.uri.toString()))}>
                        <td>{project.name}</td>
                        <td>{project.location}</td>
                        <td>{project.creationDate.toDateString()}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    }

    private onProjectSearchChanged(e: React.ChangeEvent<HTMLInputElement>) {
        this.projectFilter = e.currentTarget.value
        this.update()
    }

    private findRecentDevEcoProjects(filter: string): DevEcoProject[] {
        return this.recentWorkspaces
            .map(uriString => new URI(uriString))
            .filter(uri => filter ? uri.path.toString().toUpperCase().includes(filter.toUpperCase()) : true)
            .map(uri => ({uri: uri, name: uri.path.name, location: uri.path.dir.fsPath(), creationDate: new Date()}))
    }


    private renderSidePanel(): React.ReactNode {
        return <div className="oniro-getting-started-side-panel">
            <section>
                <h3>User Guide</h3>
                <a>some link</a>
            </section>
            <section>
                <h3>Release Notes</h3>
                <p>some version notes</p>
            </section>
            <section>
                <h3>News</h3>
                <p>some stuff</p>
            </section>
        </div>
    }


}