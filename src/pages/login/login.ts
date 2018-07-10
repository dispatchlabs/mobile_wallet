import {Component, OnDestroy, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HomePage} from '../home/home';
import {AppService} from '../../app/app.service';
import {Config} from '../../store/states/config';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../../app/app.state';
import {Store} from '@ngrx/store';
import {KeyHelper} from '../../helpers/key-helper';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage implements OnInit, OnDestroy {

    /**
     * Class level-declarations
     */
    public configState: Observable<Config>;
    public config: Config;
    public configSubscription: any;
    public privateKey: string;
    public keyHelper = KeyHelper;
    public error: string;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {AppService} appService
     * @param {Store<AppState>} store
     */
    constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppService, private store: Store<AppState>) {
        this.configState = this.store.select('config');
        this.configSubscription = this.configState.subscribe((config: Config) => {
            this.config = config;
        });
    }

    /**
     *
     */
    ngOnInit() {
        if (this.config.defaultAccount) {
            this.navCtrl.setRoot(HomePage);
        }
    }

    /**
     *
     */
    ngOnDestroy() {
        this.configSubscription.unsubscribe();
    }

    /**
     *
     * @param {string} privateKey
     */
    public onPrivateKeyChange(value: string): void {
        this.privateKey = value;
        if (this.privateKey.length === 64) {
            if (!/^[0-9a-fA-F]+$/.test(this.privateKey)) {
                this.error = "invalid private key";
                return;
            } else {
                this.appService.newAccountWithPrivateKey(this.privateKey);
                this.navCtrl.setRoot(HomePage);
                return;
            }
        }
        this.error = null;
    }

    /**
     *
     * @param event
     */
    public onPaste(event: any): boolean {
        if (!/^[0-9a-fA-F]+$/.test(event.target.value) || event.target.value.length !== 40) {
            this.error = 'Invalid private key';
        } else {
            this.appService.newAccountWithPrivateKey(event.target.value);
            this.navCtrl.setRoot(HomePage);
        }
        return true;
    }

    /**
     *
     */
    public next(): void {
        this.appService.newAccount();
        this.navCtrl.setRoot(HomePage);
    }
}
