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
        const ONIRO_DARK_JSON = this.monacoThemeRegistry.register(
            require('../../../src/browser/theme/data/oniro-dark.json'),
            {
                './dark_vs.json': require('@theia/monaco/data/monaco-themes/vscode/dark_vs.json'),
                './dark_plus.json': require('@theia/monaco/data/monaco-themes/vscode/dark_plus.json')
            },
            'oniro-dark',
            'vs-dark'
        ).name;

        const themes: Theme[] = [{
            id: 'oniro-dark',
            label: 'Oniro Dark',
            editorTheme: ONIRO_DARK_JSON,
            type: 'dark'
        }];

        this.themeService.register(...themes);
    }
}
