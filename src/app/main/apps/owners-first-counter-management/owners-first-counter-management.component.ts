import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AlertService, AuthenticationService } from '../../../../_services';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { MatInputModule } from '@angular/material/input';

import { UserService } from '../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../_services';

import { getNumberOfCurrencyDigits } from '@angular/common';
// import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import {FormGroupDirective, NgForm,} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import * as moment from 'moment';

export interface PeriodicElement
{
    userName : string;
    termsName: string;
    updatedAt : string;
    updatedDateInfo : string;
    
}

export interface UserData
{
    userName : string;
    updatedAt : string;
    termsName:string;
    updatedDateInfo : string;
}

@Component(
{
    selector: 'app-owners-first-counter-management',
    templateUrl: './owners-first-counter-management.component.html',
    styleUrls: ['./owners-first-counter-management.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})



export class OwnersFirstCounterManagementComponent implements OnInit
{
    isFolded = false;
    
    panelOpenState = false;

    // Review Table Start
    displayedColumns: string[] = ['userName','updatedDateInfo', 'termsName'];

    // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    // dataSource = ELEMENT_DATA;

    dataSource = new MatTableDataSource<PeriodicElement>();

    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    applyFilter(filterValue: string)
    {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    id:String;
    counterId:String;
    companyId:String;
    parentId: string;
    clauseId: string;
    nos: string;
    termsName: string;
    drawCharterId: string;
    status: string;

    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    updatedDateInfo: string;
    isActive: string;
    isDelete: string;

    counterIdInfo:any;

    reviewData = [];

    // Review Table End

    showReviewModal = false;


    cityManagementRes: any;
    cityManagementData= [];

    clauseCategoryResponse : any;
    clauseCategoryData= [];

    clauseCategoryTermsResponse : any;
    clauseCategoryTermsData= [];

    clauseCategoryTermsReviewResponse : any;
    clauseCategoryTermsReviewData= [];

    cpTime:string;
    cityId:string;
    cpDate:string;
    formId:string;

    OwnersFirstCounterForm : FormGroup;

    mainScreen = true;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

     /**
     * Constructor
     *
     *  @param {ContactsService} _contactsService
     *  @param {FuseSidebarService} _fuseSidebarService
     *  @param {MatDialog} _matDialog
     *  @param {FormBuilder} _formBuilder
     */

    constructor
    (
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService,
        private router: Router,

        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        
    )
    {
        this.dataSource = new MatTableDataSource(this.clauseCategoryTermsReviewData);
    }

    ngOnInit()
    {
        // Assign Static CP Form ID For Test
        localStorage.setItem('formId','1');
        localStorage.setItem('companyId','1');
        

        var current_date = moment(new Date()).format("YYYY-MM-DD")
        
        var current_time = moment().format("HH:mm A");

        this.OwnersFirstCounterForm = this._formBuilder.group(
        {
            cpTime: [current_time, Validators.required],
            cityId: ['0', Validators.required],
            cpDate: [current_date, Validators.required],
        });

        this.formId = localStorage.getItem('formId');
        this.companyId = localStorage.getItem('companyId');

        this.cityRecords();
        this.clausesAndTermsRecords();

        this.clauseReviewsRecordsServerSide();
    }

    // Fetch City Records Start
    
        cityRecords(): void
        {
            try
            {
                this._userService.CityRecords()
                    .pipe(first())
                    .subscribe((res) =>
                    {
                        this.cityManagementRes = res;
                        if (this.cityManagementRes.success === true)
                        {
                            this.cityManagementData = this.cityManagementRes.data;
                        }
                    },
                    err =>
                    {
                        this.alertService.error(err, 'Error');
                    });
                } catch (err)
                {
                }
        }

        changeCity(event): void
        {
            this.cityId = event.target.value;
        }

    // Fetch City Records End

    // Fetch Clauses And Its Terms Details Records Start
    toggleOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
      }
        clausesAndTermsRecords(): void
        {
            this.clauseCategoryData = [];
            var filterCondition = {};
            filterCondition["cpFormId"] = localStorage.getItem('formId');
            try
            {
                this._userService.clauseCategoryServerSideRecordsServerSide(filterCondition)
                    .pipe(first())
                    .subscribe((res) =>
                    {
                        this.clauseCategoryResponse = res;
                        
                        if (this.clauseCategoryResponse.success === true)
                        {
                            this.clauseCategoryData = this.clauseCategoryResponse.data;

                            for (let index = 0; index < this.clauseCategoryData.length; index++)
                            {
                                var srNo = index + 1;
                                this.clauseCategoryData[index].srNo = srNo;

                                this.clauseCategoryTermsData = [];
                                var clauseCategoryTermsFilterCondition = {};
                                clauseCategoryTermsFilterCondition["parentId"] = this.clauseCategoryData[index].id;
                                try
                                {
                                    this._userService.clauseTermsDetailsRecordsServerSide(clauseCategoryTermsFilterCondition)
                                        .pipe(first())
                                        .subscribe((res) =>
                                        {
                                            this.clauseCategoryTermsResponse = res;
                                            if (this.clauseCategoryTermsResponse.success === true)
                                            {
                                                this.clauseCategoryTermsData = this.clauseCategoryTermsResponse.data;

                                                for (let index = 0; index < this.clauseCategoryTermsData.length; index++)
                                                {
                                                    var srNoTerms = index + 1;
                                                    this.clauseCategoryTermsData[index].srNoTerms = srNoTerms;
                                                }
                                                
                                                this.clauseCategoryData[index].clauseTermsData = this.clauseCategoryTermsData;
                                            }
                                        },
                                        err =>
                                        {
                                            this.alertService.error(err, 'Error');
                                        });
                                    } catch (err)
                                    {
                                    }
                                
                            }
                        }
                    },
                    err =>
                    {
                        this.alertService.error(err, 'Error');
                    });
                } catch (err)
                {
                }
        }
        
        setClauseID(value): void
        {
            this.clauseId = value;
        }

    // Fetch Clauses And Its Terms Details Records Start

    // Clause Reviews Records Server Side Start
        
    // Fetch Clauses And Its Terms Details Records Start
        
        clauseReviewsRecordsServerSide(): void
        {
            console.log('here');
            
            this.clauseCategoryTermsReviewData = [];
            var filterCondition = {};

            var counterIdInfo = this.counterId;
            
            // if(counterIdInfo > 0)
            // {
            //     filterCondition["ccam.counterId"] = this.counterId;
            // }

            filterCondition["ccam.companyId"] = this.companyId;
            filterCondition["ccam.formId"] = this.formId;
            filterCondition["ccam.parentId"] = this.parentId;
            filterCondition["ccam.clauseId"] = this.clauseId;

            console.log(filterCondition);

            try
            {
                this._userService.clauseTermsReviewsRecordsServerSide(filterCondition)
                    .pipe(first())
                    .subscribe((res) =>
                    {
                        this.clauseCategoryTermsReviewResponse = res;
                        console.log('Clause Termns Review Data');
                        console.log(res);
                        if (this.clauseCategoryTermsReviewResponse.success === true)
                        {
                            this.clauseCategoryTermsReviewData = this.clauseCategoryTermsReviewResponse.data;

                            // for (let index = 0; index < this.clauseCategoryTermsReviewData.length; index++)
                            // {
                            //     this.clauseCategoryTermsReviewData[index].updatedDateInfo = moment(this.clauseCategoryTermsReviewData[index].updatedAt).format("YYYY-MM-DD");
                            // }

                            this.dataSource = new MatTableDataSource(this.clauseCategoryTermsReviewData);
                            // setTimeout(() => this.dataSource.paginator = this.paginator, 15000);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                        }
                        console.log(this.clauseCategoryTermsReviewData);
                    },
                    err =>
                    {
                        this.alertService.error(err, 'Error');
                    });
                } catch (err)
                {
                }
        }

    // Fetch Clauses And Its Terms Details Records Start
    

    reviewModalShow(clausesId,parentId): void
    {
        this.clauseId = clausesId;
        this.parentId = parentId;
        this.clauseReviewsRecordsServerSide();
        this._fuseSidebarService.getSidebar('reviewPanel').toggleOpen();

    }
   
    reviewModalHide(): void
    {
        this.showReviewModal = !this.showReviewModal;
    }

    onSubmit(): void{

    }
}