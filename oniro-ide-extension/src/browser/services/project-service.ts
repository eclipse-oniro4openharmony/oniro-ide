import { Command, CommandRegistry, URI } from "@theia/core";
import { inject, injectable, postConstruct } from "@theia/core/shared/inversify";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { OniroServer, ProjectTask } from "../../common/oniro-protocol";
import { PROJECT_TASKS_CATEGORY_KEY } from "../commands/project-commands";
import { OniroIconService } from "./oniro-icon-service";

@injectable()
export class ProjectService {

    @inject(OniroServer) oniroServer: OniroServer;
    
    @inject(WorkspaceService) workspaceService: WorkspaceService;

    @inject(CommandRegistry) commandRegistry: CommandRegistry;

    @inject(OniroIconService) oniroIconService: OniroIconService;

    private activeProjectTaskCommands: Command[] = []

    @postConstruct()
    init(): void {
        this.workspaceService.onWorkspaceChanged(roots => {
            // TODO: use correct root of active project
            this.reRegisterProjectTaskCommands(this.workspaceService.tryGetRoots()[0].resource);
        });
    }

    hardwareChanged(hardware: string): void {

    }

    activeProjectChanged(activeProject: URI): void {
        this.reRegisterProjectTaskCommands(activeProject);
    }

    getProjectTaskCommands(): Command[] {
        return this.activeProjectTaskCommands;
    }

    async reRegisterProjectTaskCommands(activeProject: URI) {
        const tasks = await this.oniroServer.getProjectTasks(activeProject)
        this.activeProjectTaskCommands = [];
        tasks.forEach(task => {
            const command = this.projectTaskToCommand(task);
            this.commandRegistry.unregisterCommand(command);
            this.commandRegistry.registerCommand(command, {
                execute: () => this.commandRegistry.executeCommand('DevEco.runTask', {name: task.id, projectPath: this.workspaceService.tryGetRoots()[0].resource.path.toString().substring(1)})
            });
            this.activeProjectTaskCommands.push(command);
        }); 
    }

    private projectTaskToCommand(task: ProjectTask): Command {
        return Command.toLocalizedCommand({
            id: task.id, 
            iconClass: this.oniroIconService.convertIconToClass(task.icon), 
            label: task.title, 
            category: 'Project Tasks'
        }, `oniro/project/${task.name}`, PROJECT_TASKS_CATEGORY_KEY);
    }
}