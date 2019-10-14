import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { UserService } from '../../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';

@Component(
{
    selector: 'app-edit-clause-terms',
    templateUrl: './edit-clause-terms.component.html',
    styleUrls: ['./edit-clause-terms.component.scss']
})

export class EditClauseTermsComponent implements OnInit
{
    clauseTermsForm: FormGroup;
    typeData: any;
    loading = false;
    submitted = false;
    parentId: String;
    nos: Number;
    termsName: String;
    returnUrl: String;
    showLoaderImg = false;
    // Private
    submitRes: any;
    clauseTermsId:String;
    clauseTermsListRes:any;
    clauseTermsData:any;
    clauseTerms:String;
    cpId:String;
    /*
    * @param {FuseSidebarService} _fuseSidebarService
    */
    constructor
    (
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _userService: UserService,
        // private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService
    )
    {
        this.showLoaderImg = false;
    }

    ngOnInit()
    {
        this.typeData = JSON.parse(localStorage.getItem('clauseTermsData'));
        this.clauseTermsForm = this._formBuilder.group(
        {
            clauseTermsId: [this.typeData.clauseTermsId, Validators.required],
            parentId: [this.typeData.parentId, Validators.required],
            nos: [this.typeData.nos, Validators.required],
            termsName: [this.typeData.termsName, Validators.required],
        });
        console.log(this.clauseTermsForm);
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/clause-terms-management';
        console.log(this.typeData);
        console.log('Edit Data');
        this.fromList();
    }

    get f() { return this.clauseTermsForm.controls; }

    fromList(): void
    {
        try
        {
            this._userService.getclusesCategoryList()
                .pipe(first())
                .subscribe((res) =>
                {
                    this.clauseTermsListRes = res;
                    console.log(res);
                    if (this.clauseTermsListRes.success === true)
                    {
                        this.clauseTermsData = this.clauseTermsListRes.data;
                        console.log(this.clauseTermsData);
                    }
                },
                err =>
                {
                    this.alertService.error(err, 'Error');
                    console.log(err);
                });
        } catch (err)
        {
            console.log(err);
        }
    }
    
    onSubmit()
    {
        console.log("Here On Submit");
        this.showLoaderImg = true;
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();
        // stop here if form is invalid
        if (this.clauseTermsForm.invalid)
        {
            console.log("VALIDATION ERROR");
            // return false;;
            console.log(this.clauseTermsForm);
            console.log(this.clauseTermsForm.invalid);
        } else {
            console.log("add");
            const reqData =
            {
                id: this.typeData.id,
                parentId: this.f.parentId.value,
                nos: this.f.nos.value,
                termsName: this.f.termsName.value,
                updatedBy: localStorage.getItem('userId'),
                // "clauseTermsId":this.f.clauseTermsId.value
            }
            console.log(reqData);
            this.loading = true;
            this._userService.getclusesupdate(reqData)
                .pipe(first())
                .subscribe(
                data =>
                {
                    console.log(data);
                    this.showLoaderImg = false;
                    this.submitRes = data;
                    if (this.submitRes.success === true)
                    {
                        this.alertService.success(this.submitRes.message, 'Success');
                        this.router.navigate([this.returnUrl]);
                        // this.enableSubmitStatus = false;
                        // this.clicked = false;
                    } else {
                        this.alertService.error(this.submitRes.message, 'Error');
                    }
                    console.log(data);
                },
                error =>
                {
                    console.log(error.message);
                    this.alertService.error(error.message, 'Error');
                    this.loading = false;
                });
        }
    }
    
    selectCpType(event)
    {
        this.clauseTermsId =event.target.value;
    }
}
