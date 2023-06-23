import { isWindows, OS, URI } from "@theia/core";
import { injectable } from "@theia/core/shared/inversify";
import { Board, OniroClient, OniroServer, ProjectTask, Vendor } from "../common/oniro-protocol";
import { execFile, ExecFileOptions } from 'child_process'
import * as path from 'path'

@injectable()
export class DeviceToolProvider implements OniroServer {

    async getProjectTasks(projectPath: URI): Promise<ProjectTask[]> {
            const stdout = await this.executeHosTask(['project', 'tasks'], {cwd: projectPath.path.toString().substring(1)})
            const projectTasks = JSON.parse(stdout);
            return projectTasks[0].items.filter((task: any) => task.name && task.icon)
    }

    async getBoards(): Promise<Vendor[]> {
        const stdout = await this.executeHosTask(['boards', '--json-output'])
        const boards: Board[] = JSON.parse(stdout);
        const vendors: Vendor[] = []
        boards.filter(board => board.supportedOs.includes(OS.backend.isWindows ? 'windows' : 'linux')).forEach(board => {
            let vendor = vendors.find(platform => platform.name === board.vendor);
            if(!vendor) {
                vendor = {name: board.vendor, boards: []};
                vendors.push(vendor);
            }
            vendor.boards.push(board);
        });
        return vendors;
    }

    private getHosLocation(): string | undefined {
        if(!process.env.DEVECO_PENV_DIR) {
            return undefined
        }

        const binPath = isWindows ? 'Scripts' : 'bin'; 
        return path.join(process.env.DEVECO_PENV_DIR, binPath, 'hos');
    }

    private async executeHosTask(args: string[], options: ExecFileOptions = {}): Promise<string> {
        return new Promise((res, reject) => {
            execFile(this.getHosLocation() ?? 'hos', args, options, (err, stdout, errout) => {
                if(err) {
                    console.error(err);
                    reject(err);
                }
                res(stdout);
            });
        });
    }


    setClient(client: OniroClient | undefined): void {
        // this.client = client; 
    }

    dispose(): void {
        
    }
}