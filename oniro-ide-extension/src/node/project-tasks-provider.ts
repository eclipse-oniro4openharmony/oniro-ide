import { URI } from "@theia/core";
import { injectable } from "@theia/core/shared/inversify";
import { OniroClient, OniroServer, ProjectTask } from "../common/oniro-protocol";
import { exec } from 'child_process'

@injectable()
export class ProjectTasksProvider implements OniroServer {
    // private client?: OniroClient;

    async getProjectTasks(projectPath: URI): Promise<ProjectTask[]> {
        return new Promise((res, reject) => {
            exec('hos project tasks', {cwd: projectPath.path.toString().substring(1)}, (err, stdout, errout) => {
                if(err) {
                    reject(err);
                }
                const projectTasks = JSON.parse(stdout);
                res(projectTasks[0].items.filter((task: any) => task.name && task.icon));
            });
        });
    }


    setClient(client: OniroClient | undefined): void {
        // this.client = client; 
    }

    dispose(): void {
        
    }
}