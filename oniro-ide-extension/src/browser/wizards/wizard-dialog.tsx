import { AbstractDialog, DialogError, DialogMode } from "@theia/core/lib/browser";
import React = require("react");
import {createRoot, Root} from 'react-dom/client'
import { Message } from '@theia/core/lib/browser/widgets/widget';
import { Disposable } from "@theia/core/shared/vscode-languageserver-protocol";
import { Emitter, MaybePromise, nls } from "@theia/core";
import { inject, injectable, multiInject } from "@theia/core/shared/inversify";

export const wizardPages = Symbol('wizard-pages');
@injectable()
export abstract class WizardPage<T> {    
    readonly title: string;

    protected requestUpdateEmitter = new Emitter<void>();
    public onRequestUpdate = this.requestUpdateEmitter.event; 

    abstract render(configObject: T): React.ReactNode;
    abstract isValid(configObject: T): MaybePromise<DialogError>;
}

export const wizardDialogProps = Symbol('wizard-dialog-props');
export interface WizardDialogProps<T> {
    configObject: T;
    title: string;
    finishButtonText?: string;
}



@injectable()
export class WizardDialog<T> extends AbstractDialog<T> {
    value: T;

    private currentStep: WizardPage<T>;
    private stepRoot: Root;

    private nextButton: HTMLButtonElement;
    private backButton: HTMLButtonElement;

    private valid: boolean;

    constructor(
        @inject(wizardDialogProps) private wizardProps: WizardDialogProps<T>,
        @multiInject(wizardPages) private steps: WizardPage<T>[]
    ) {
        super({title: wizardProps.title});
        this.value = wizardProps.configObject;
        steps.forEach(step => step.onRequestUpdate(() => this.update()))
        this.init();
        this.contentNode.style.padding = 'var(--theia-ui-padding)'
    }

    init() {
        const stepPanel = document.createElement('div');
        stepPanel.classList.add('wizard-content-panel');
        this.contentNode.appendChild(stepPanel);
        this.stepRoot = createRoot(stepPanel);
        this.toDispose.push(Disposable.create(() => this.stepRoot.unmount()));

        this.currentStep = this.steps[0];
        
        this.backButton = this.createButton(nls.localize('oniro/wizards/back', 'back'));
        this.backButton.onclick = () => this.previousStep();
        this.backButton.disabled = true;
        this.controlPanel.appendChild(this.backButton);
        this.nextButton = this.createButton(nls.localize('oniro/wizards/next', 'next'));
        this.nextButton.onclick = () => this.nextStep();
        this.controlPanel.appendChild(this.nextButton);
    }

    protected override onUpdateRequest(msg: Message): void {
        super.onUpdateRequest(msg);
        this.stepRoot.render(<React.Fragment>
            { this.currentStep.title && <div className="wizard-page-title">{this.currentStep.title}</div>}
            {this.currentStep.render(this.value)}
            </React.Fragment>);
        this.backButton.disabled = this.steps.indexOf(this.currentStep) === 0;
    }

    protected async isValid(value: T, mode: DialogMode): Promise<DialogError> {
        const valid = await this.currentStep.isValid(value);
        switch(typeof valid) {
            case 'string': this.valid = valid ? false : true; break;
            case 'object': this.valid = valid.result; break;
            case 'boolean': this.valid = valid; break;
        }
        this.nextButton.disabled = !this.valid;
        return valid;
    }

    private nextStep() {
        let currentIndex = this.steps.indexOf(this.currentStep);
        if(currentIndex === this.steps.length - 1) {
            this.resolve!(this.value);
            this.close();
        } else {
            this.currentStep = this.steps[++currentIndex]
            this.update();
            if(currentIndex === this.steps.length - 1) {
                this.nextButton.innerText = nls.localize('oniro/wizards/finish', 'finish');
            }
        }
    }

    private previousStep() {
        let currentIndex = this.steps.indexOf(this.currentStep);
        if(currentIndex === this.steps.length - 1) {
            this.nextButton.innerText = this.wizardProps.finishButtonText ?? nls.localize('oniro/wizards/next', 'next');
        }
        if(currentIndex != 0) {
            this.backButton.disabled = false;
            this.currentStep = this.steps[--currentIndex]
            this.update()
        }
    }
}