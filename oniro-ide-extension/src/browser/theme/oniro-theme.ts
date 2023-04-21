import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { ThemeService } from '@theia/core/lib/browser/theming';
import { Theme } from '@theia/core/lib/common/theme';
import { inject, injectable } from '@theia/core/shared/inversify';
import { MonacoThemeRegistry } from '@theia/monaco/lib/browser/textmate/monaco-theme-registry';

@injectable()
export class OniroThemeContribution implements FrontendApplicationContribution {

    @inject(MonacoThemeRegistry)
    private monacoThemeRegistry: MonacoThemeRegistry;

    @inject(ThemeService)
    private themeService: ThemeService;

    async initialize(): Promise<void> {
        const ONIRO_CSS = require('../../../src/browser/theme/style/oniro.useable.css');
        const ONIRO_JSON = this.monacoThemeRegistry.register(
            require('../../../src/browser/theme/data/oniro.color-theme.json'), {}, 'oniro', 'vs-dark').name!;
    
        const themes: Theme[] = [{
            id: 'oniro-theme',
            label: 'Oniro Theme',
            description: 'Oniro Dark Theme',
            editorTheme: ONIRO_JSON,
            activate() {
                ONIRO_CSS.use();
            },
            deactivate() {
                ONIRO_CSS.unuse();
            },
            type: 'dark'
        }];
    
        this.themeService.register(...themes);
    }
}
