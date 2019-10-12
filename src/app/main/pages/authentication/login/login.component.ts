import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlertService, AuthenticationService } from '../../../../_services';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    showLoaderImg = false;
    Email: string;
    Password: string;
    res: any;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private location: Location) {

        this.showLoaderImg = false;
        // if (this.authenticationService.currentUserValue) {
        //     this.router.navigate(['/apps/dashboards/analytics']);
        // }

        let userToken = localStorage.getItem('userToken')
        if(userToken!=undefined){
            this.location.back();
        }

        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/dashboards/analytics';
    }

    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.showLoaderImg = true;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.authenticationService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                this.showLoaderImg = false;
                this.res = data;
                if (data.success === true) {
                    localStorage.setItem('userToken', this.res.token);
                    localStorage.setItem('userId', this.res.data.id);
                    localStorage.setItem('userData', JSON.stringify(this.res.data));
                    this.router.navigate([this.returnUrl]);
                } else {
               
                    this.alertService.error(data.message, 'Error');
                }
                },
            error => {
               
                this.alertService.error(error.message, 'Error');
                this.loading = false;
            });
        }
    }
