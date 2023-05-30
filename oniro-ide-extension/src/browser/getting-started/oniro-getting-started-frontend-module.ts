import { WidgetFactory } from "@theia/core/lib/browser";
import { interfaces } from "@theia/core/shared/inversify";
import { GettingStartedWidget } from "@theia/getting-started/lib/browser/getting-started-widget";
import { OniroGettingStartedWidget } from "./oniro-getting-started-widget";
import { GettingStartedContribution } from '@theia/getting-started/lib/browser/getting-started-contribution'


import '../../../src/browser/getting-started/style/getting-started.css';

export const bindOniroGettingStartedContribution = (bind: interfaces.Bind, rebind: interfaces.Rebind) => {
    rebind(GettingStartedContribution).toSelf().inRequestScope()

    bind(OniroGettingStartedWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(context => ({
        id: GettingStartedWidget.ID,
        createWidget: () => context.container.get<OniroGettingStartedWidget>(OniroGettingStartedWidget),
    })).inSingletonScope();
}