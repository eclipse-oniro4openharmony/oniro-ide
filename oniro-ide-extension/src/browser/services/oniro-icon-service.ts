import { codicon } from "@theia/core/lib/browser";
import { injectable } from "@theia/core/shared/inversify";

@injectable()
export class OniroIconService {

    private readonly iconClassMap = new Map<string, string>([
        ['clean', codicon('trash')],
        ['build', codicon('circle-outline')],
        ['rebuild', 'plugin-icon-7'],
        ['burn', codicon('flame')],
        ['monitor', codicon('plug')],
        ['profiling', codicon('graph')],
        ['stack-analysis', 'plugin-icon-8'],
        ['image-analysis', 'plugin-icon-9'],
    ])


    convertIconToClass(iconName: string): string {
        const iconClass = this.iconClassMap.get(iconName);
        return iconClass ?? codicon(iconName)
    }

}