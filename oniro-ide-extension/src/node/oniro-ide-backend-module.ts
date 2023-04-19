import { ContainerModule } from '@theia/core/shared/inversify';
import { LocalizationContribution } from '@theia/core/lib/node/i18n/localization-contribution';

import { OniroLocalizationContribution } from './i18n/oniro-localization-contribution';

export default new ContainerModule(bind => {
    bind(LocalizationContribution).to(OniroLocalizationContribution).inSingletonScope();
});
