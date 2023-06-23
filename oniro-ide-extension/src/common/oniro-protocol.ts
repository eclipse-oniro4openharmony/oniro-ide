import { JsonRpcServer, URI } from "@theia/core";

export const servicePath = '/services/oniro-ide'

export const OniroClient = Symbol('OniroClient');
export interface OniroClient {

}


export const OniroServer = Symbol('OniroServer');
export interface OniroServer extends JsonRpcServer<OniroClient> {
    getProjectTasks(projectPath: URI): Promise<ProjectTask[]>;

    getBoards(): Promise<Vendor[]>;
}

export interface ProjectTask {
    id: string;
    name: string;
    title: string;
    icon: string;
}

export interface Vendor {
    name: string
    boards: Board[]
}
export interface Board {
    name: string;
    vendor: string;
    supportedOs: ('windows' | 'linux')[]
}