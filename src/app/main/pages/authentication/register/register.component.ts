import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService } from '../../../../_services';
import { FuseConfigService } from '@fuse/services/config.service';
// import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class RegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    showLoaderImg = false;
    username: string;
    email: string;
    password: string;

    otp: string;
    firstname: string;
    lastname: string;
    mobileno: string;
    term: boolean;
    res: any;
    

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) {
        // Configure the layout
        this.showLoaderImg = false;
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

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.registerForm = this._formBuilder.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
            otp: ['1234'],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            mobileno: ['', Validators.required],
            term: [false, Validators.requiredTrue]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pages/auth/login';
        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    get f() { return this.registerForm.controls; }
    register() { }

    onSubmit() {
        this.showLoaderImg = true;
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();
        console.log(this.registerForm.invalid);
        console.log(this.f.term.value);
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
         else {
            this.loading = true;
            this.authenticationService.register(this.f.username.value, this.f.email.value, this.f.password.value, this.f.otp.value, this.f.firstname.value, this.f.lastname.value, this.f.mobileno.value)
                .pipe(first())
                .subscribe(
                    data => {
                        this.showLoaderImg = false;
                        if (data.success === true) {
                            this.alertService.success(data.message, 'Success');
                            this.router.navigate([this.returnUrl]);
                        } else {
                            this.alertService.error(data.message, 'Error');
                        }

                    },

                    error => {
                        console.log(error.message);
                        this.alertService.error(error.message, 'Error');
                        this.loading = false;
                        this.showLoaderImg = false;
                    });
        }


    }
    
}


/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};
