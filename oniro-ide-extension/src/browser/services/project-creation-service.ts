import { URI } from "@theia/core";
import { inject, injectable } from "@theia/core/shared/inversify";
import { FileService } from "@theia/filesystem/lib/browser/file-service";

export interface NewProjectConfig {
    location?: URI;
    chip: string;
}

@injectable()
export class ProjectCreationService {
    @inject(FileService)
    private fileService: FileService

    createProject(config: NewProjectConfig) {
        if(config.location) {
            this.fileService.createFolder(config.location);
        }
    }
}