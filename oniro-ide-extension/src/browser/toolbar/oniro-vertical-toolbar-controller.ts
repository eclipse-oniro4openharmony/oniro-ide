import { injectable } from '@theia/core/shared/inversify';
import { ToolbarTreeSchema } from '@theia/toolbar/lib/browser/toolbar-interfaces';
import { ToolbarController } from '@theia/toolbar/lib/browser/toolbar-controller';

@injectable()
export class OniroVerticalToolbarController extends ToolbarController {    
    protected async resolveToolbarItems(): Promise<ToolbarTreeSchema> {
        return this.inflateItems(this.defaultsFactory());
    }
}
