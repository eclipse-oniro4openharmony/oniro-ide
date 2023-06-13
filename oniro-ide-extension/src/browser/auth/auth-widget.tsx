import { ReactWidget } from '@theia/core/lib/browser';
import { injectable, inject } from '@theia/core/shared/inversify';
import { nls } from '@theia/core'
import { ReactNode, Fragment } from 'react';
import React = require('react');
import { AuthService } from './auth-service';



@injectable()
export class AuthWidget extends ReactWidget {

    protected override onAfterAttach(msg: any) {
        super.onAfterAttach(msg);
        this.update();
        this.node.classList.add('oniro-auth-screen')
    }

    private user: string = '';
    private password: string = ''

    @inject(AuthService) private authService: AuthService


    protected render(): ReactNode {
        return <Fragment>
            <h1 className='oniro-login-title'> Welcome to Oniro </h1>
            <div className='oniro-login-panel'>
                <input className='oniro-login-input' onChange={(e) => this.user = e.target.value} placeholder={nls.localize('oniro/auth/username', 'username')}></input>
                <input className='oniro-login-input' type='password' onChange={(e) => this.password = e.target.value} placeholder={nls.localize('oniro/auth/password', 'password')}></input>
                <button className='oniro-login-button' onClick={() => this.authService.loginWithBasicAuth(this.user, this.password)}>{nls.localize('oniro/auth/login', 'Login')}</button>
            </div>
        </Fragment>
    }
    
}