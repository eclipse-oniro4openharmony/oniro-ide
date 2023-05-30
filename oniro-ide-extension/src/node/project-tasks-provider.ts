import { isWindows, URI } from "@theia/core";
import { injectable } from "@theia/core/shared/inversify";
import { OniroClient, OniroServer, ProjectTask } from "../common/oniro-protocol";
import { execFile } from 'child_process'
import * as path from 'path'

@injectable()
export class ProjectTasksProvider implements OniroServer {

    async getProjectTasks(projectPath: URI): Promise<ProjectTask[]> {
        return new Promise((res, reject) => {
            execFile(this.getHosLocation() ?? 'hos', ['project', 'tasks'], {cwd: projectPath.path.toString().substring(1)}, (err, stdout, errout) => {
                if(err) {
                    reject(err);
                }
                const projectTasks = JSON.parse(stdout);
                res(projectTasks[0].items.filter((task: any) => task.name && task.icon));
            });
        });
    }

    private getHosLocation(): string | undefined {
        if(!process.env.DEVECO_PENV_DIR) {
            return undefined
        }

        const binPath = isWindows ? 'Scripts' : 'bin'; 
        return path.join(process.env.DEVECO_PENV_DIR, binPath, 'hos');
    }


    setClient(client: OniroClient | undefined): void {
        // this.client = client; 
    }

    dispose(): void {
        
    }
}