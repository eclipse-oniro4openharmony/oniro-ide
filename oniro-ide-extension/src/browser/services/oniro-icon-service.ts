import { codicon } from "@theia/core/lib/browser";
import { inject, injectable, postConstruct } from "@theia/core/shared/inversify";
import {HostedPluginSupport} from"@theia/plugin-ext/lib/hosted/browser/hosted-plugin";
@injectable()
export class OniroIconService {

    @inject(HostedPluginSupport)
    private readonly hostedPlugin: HostedPluginSupport;

    private readonly iconClassMap = new Map<string, string>([
        ['clean', codicon('trash')],
        ['build', codicon('circle-outline')],
        ['rebuild', 'rebuild'], // see toolbar/index.css for classes 
        ['burn', codicon('flame')],
        ['monitor', codicon('plug')],
        ['profiling', codicon('graph')],
        ['stack-analysis', 'stack-analysis'],
        ['image-analysis', 'image-analysis'],
    ])

    @postConstruct()
    init() {
        this.hostedPlugin.didStart.then(() => {
            this.createIconCssClasses();
        });
    }


    convertIconToClass(iconName: string): string {
        const iconClass = this.iconClassMap.get(iconName);
        return iconClass ?? codicon(iconName)
    }

    /**
     * Create classes dynamicly after plugins are loaded to allow downloading of the icons
     */
    private createIconCssClasses() {
        const style = document.createElement('style');
        style.innerHTML = `
        /*dynamicly created by oriro-icon-service.ts*/
        .rebuild {
            background: url("/hostedPlugin/Huawei_deveco_device_tool/resources/icons/rebuild-inverse.svg") center center / 16px no-repeat;
          }
          
          .stack-analysis {
            background: url("/hostedPlugin/Huawei_deveco_device_tool/resources/icons/stack-analysis-inverse.svg") center center / 16px no-repeat;
          }
          
          .image-analysis {
            background: url("/hostedPlugin/Huawei_deveco_device_tool/resources/icons/image-analysis-inverse.svg") center center / 16px no-repeat;
          }      
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

}