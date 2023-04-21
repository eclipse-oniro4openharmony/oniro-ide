import { SearchInWorkspaceFrontendContribution } from "@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution"
import { DebugFrontendApplicationContribution } from "@theia/debug/lib/browser/debug-frontend-application-contribution"
import { injectable } from "@theia/core/shared/inversify";

@injectable()
export class RightSearchInWorkspaceFrontendContribution extends SearchInWorkspaceFrontendContribution {
    constructor() {
        super();
        this.defaultViewOptions.area = 'right'
    }
}

@injectable()
export class RightDebugFrontendApplicationContribution extends DebugFrontendApplicationContribution {
    constructor() {
        super();
        this.defaultViewOptions.area = 'right'
    }
}