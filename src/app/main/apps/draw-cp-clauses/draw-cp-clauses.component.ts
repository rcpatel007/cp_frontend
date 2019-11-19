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

import { FormGroupDirective, NgForm, } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as moment from 'moment';


export interface PeriodicElement {
    userName: string;
    termsName: string;
    updatedAt: string;
    updatedDateInfo: string;

}

export interface UserData {
    userName: string;
    updatedAt: string;
    termsName: string;
    updatedDateInfo: string;
}


@Component(
    {
        selector: 'app-draw-cp-clauses',
        templateUrl: './draw-cp-clauses.component.html',
        styleUrls: ['./draw-cp-clauses.component.scss'],
    })

export class DrawCpClausesComponent implements OnInit {
    isFolded = false;

    panelOpenState = false;

    // Review Table Start
    displayedColumns: string[] = ['userName', 'updatedDateInfo', 'clauseTracker'];
    dataSourcecustom = new MatTableDataSource<PeriodicElement>();
    // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    // dataSource = ELEMENT_DATA;

    dataSource = new MatTableDataSource<PeriodicElement>();

    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    id: String;
    counterId: String;
    companyId: String;
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

    drawResponse : any;
    commonClausesArray = [];

    counterIdInfo: any;

    reviewData = [];

    tradingId:String;
    customClause:String;
    isTrading:String;
    termsUpdateRes:any;

    editclauses=[];
    tempedit:any;
    editid:string;
    editclausetext:String;
    tmpeditclausetext:String;
    submitResponse:any;
    notifiactionres:any;
    viewData =[];
    viewCustomData =[]
        check=[];
    // Review Table End

    showReviewModal = false;


    cityManagementRes: any;
    cityManagementData = [];

    clauseCategoryResponse: any;
    clauseCategoryData = [];

    clauseCategoryTermsResponse: any;
    clauseCategoryTermsData = [];

    clauseCategoryTermsReviewResponse: any;
    clauseCategoryTermsReviewData = [];

    cpTime: string;
    cityId: string;
    cpDate: string;
    formId: string;
    pageTitle:String;
    OwnersFirstCounterForm: FormGroup;
    drawcluases = [];
    drawManagementRes: any;
    clusesId = [];
    viewtable: false;
    // panelOpenState = false;
    termsReviewRecordsResponse: any;
    termsReviewRecordsData = [];
    chartererId:String;
    clauseCategoryTermsReviewResponseCustom: any;
    clauseCategoryTermsReviewDataCustom = [];
    mainScreen = true;
    drawId:String;
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

    ) {
        this.dataSource = new MatTableDataSource(this.clauseCategoryTermsReviewData);
    }

    ngOnInit() {
        // Assign Static CP Form ID For Test
        localStorage.setItem('formId', '1');
        localStorage.setItem('companyId', '1');


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
        // this.clausesAndTermsRecords();
        // this.clauseReviewsRecordsServerSide();

          if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
            this.pageTitle = 'Draw C/P Clauses';
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
            this.pageTitle = 'Charterer First Counter';
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            this.pageTitle = 'Owner First Counter';
        }
        this.termsReviewRecords();
     

    }

    // Fetch City Records Start

    cityRecords(): void {
        try {
            this._userService.CityRecords()
                .pipe(first())
                .subscribe((res) => {
                    this.cityManagementRes = res;
                    if (this.cityManagementRes.success === true) {
                        this.cityManagementData = this.cityManagementRes.data;
                    }
                },
                    err => {
                        this.alertService.error(err, 'Error');
                    });
        } catch (err) {
        }
    }

    changeCity(event): void {
        this.cityId = event.target.value;
    }

    // Fetch City Records End

    // Fetch Clauses And Its Terms Details Records Start
 
    
    // clausesAndTermsRecords(): void {
    //     this.clauseCategoryData = [];
    //     var filterCondition = {};
    //     filterCondition["cpFormId"] = localStorage.getItem('formId');
    //     try {
    //         this._userService.clauseCategoryServerSideRecordsServerSide(filterCondition)
    //             .pipe(first())
    //             .subscribe((res) => {
    //                 this.clauseCategoryResponse = res;

    //                 if (this.clauseCategoryResponse.success === true) {
    //                     this.clauseCategoryData = this.clauseCategoryResponse.data;

    //                     for (let index = 0; index < this.clauseCategoryData.length; index++) {
    //                         var srNo = index + 1;
    //                         this.clauseCategoryData[index].srNo = srNo;

    //                         this.clauseCategoryTermsData = [];
    //                         var clauseCategoryTermsFilterCondition = {};
    //                         clauseCategoryTermsFilterCondition["parentId"] = this.clauseCategoryData[index].id;
    //                         try {
    //                             this._userService.clauseTermsDetailsRecordsServerSide(clauseCategoryTermsFilterCondition)
    //                                 .pipe(first())
    //                                 .subscribe((res) => {
    //                                     this.clauseCategoryTermsResponse = res;
    //                                     if (this.clauseCategoryTermsResponse.success === true) {
    //                                         this.clauseCategoryTermsData = this.clauseCategoryTermsResponse.data;

    //                                         for (let index = 0; index < this.clauseCategoryTermsData.length; index++) {
    //                                             var srNoTerms = index + 1;
    //                                             this.clauseCategoryTermsData[index].srNoTerms = srNoTerms;
    //                                         }

    //                                         this.clauseCategoryData[index].clauseTermsData = this.clauseCategoryTermsData;
    //                                     }
    //                                 },
    //                                     err => {
    //                                         this.alertService.error(err, 'Error');
    //                                     });
    //                         } catch (err) {
    //                         }

    //                     }
    //                 }
    //             },
    //                 err => {
    //                     this.alertService.error(err, 'Error');
    //                 });
    //     } catch (err) {
    //     }
    // }
    // termsReviewRecords(): void {
    //     var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
    //     console.log(filter);
    //     var drawId = filter.drawId;
    //     var formID = filter.formId;
    //     var chartererId = filter.chartererId;
    //     var companyId = Number(filter.companyId);

    //     localStorage.setItem('drawId',drawId);
    //     localStorage.setItem('cpFormId',formID);

    //     this.drawId = drawId;
    //     this.formId = formID; 
    //     this.chartererId = chartererId; 

    //     this.termsReviewRecordsData = [];

    //     var clauseCategoryFilterCondition = {};
    //     clauseCategoryFilterCondition["cpFormId"] = formID;
    //     clauseCategoryFilterCondition["drawId"] = drawId;
    //     clauseCategoryFilterCondition["companyId"] = companyId;
    //     console.log(clauseCategoryFilterCondition);
        
    //     try {
    //         this._userService.mainClauseScreenDataRecords(clauseCategoryFilterCondition).pipe(first()).subscribe((res) => {
    //             this.termsReviewRecordsResponse = res;
    //             console.log(this.termsReviewRecordsResponse);
                
    //             if (this.termsReviewRecordsResponse.success === true) {

    //                 this.termsReviewRecordsData = this.termsReviewRecordsResponse.data;
    //                 // for (let index = 0; index < this.termsReviewRecordsData.length; index++)
	// 				// 	{
	// 				// 		for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++)
	// 				// 		{
	// 				// 			this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
	// 				// 		}
	// 				// 		for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; sindex++)
	// 				// 		{
	// 				// 			this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindex]['identifier'] = String.fromCharCode(97 + sindex);
	// 				// 		}
	// 				// 	}

    //                 this.mainScreen = true;
    //     console.log('hello',this.termsReviewRecordsData);
               
    //             }
    //         },
    //             err => {
    //                 this.alertService.error(err, 'Error');
    //             });
    //     } catch (err) { }
 
    // }

    termsReviewRecords(): void
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        console.log(filter);
        var drawId = filter.drawId;
        var tradingId = filter.tradingId;
        var formID = filter.formId;
        var chartererId = filter.chartererId;
        var companyId = filter.companyId;
        var isTrading = filter.isTrading;

        var drawCondition = {};

        
        drawCondition["drawId"] = drawId;
        try {
            this._userService.drawRecordsServerSide(drawCondition).pipe(first()).subscribe((res) =>
            {
                this.drawResponse = res;
                console.log(this.drawResponse);
                console.log(this.drawResponse.data);
                console.log(this.drawResponse.data[0]);
                console.log(this.drawResponse.data[0].common_clauses);
                console.log(res[0]);

                var commonClauses = this.drawResponse.data[0].common_clauses;
                console.log(commonClauses);
                
                this.commonClausesArray = commonClauses.split(',');

                localStorage.setItem('commonClausesArray', JSON.stringify(this.commonClausesArray));
            });
        } catch (err) { }

        var commonClausesArray = JSON.parse(localStorage.getItem('commonClausesArray'));
        console.log(commonClausesArray, "Common Clause Value Info");

        localStorage.setItem('tradingId',tradingId);
        localStorage.setItem('drawId',drawId);
        localStorage.setItem('cpFormId',formID);

        this.tradingId = tradingId;
        this.drawId = drawId;
        this.formId = formID; 
        this.chartererId = chartererId; 

        this.termsReviewRecordsData = [];

        if(isTrading == '2')
        {
            var clauseCategoryFilterCondition = {};
            clauseCategoryFilterCondition["cpFormId"] = formID;
            clauseCategoryFilterCondition["drawId"] = drawId;
            clauseCategoryFilterCondition["companyId"] = companyId;
            clauseCategoryFilterCondition["commonClauses"] = commonClausesArray;
            try {
                this._userService.mainClauseScreenDataRecords(clauseCategoryFilterCondition).pipe(first()).subscribe((res) => {
                    this.termsReviewRecordsResponse = res;
                    if (this.termsReviewRecordsResponse.success === true) {
                        this.termsReviewRecordsData = this.termsReviewRecordsResponse.data;
                        console.log(this.termsReviewRecordsData);
                    }
                },
                    err => {
                        this.alertService.error(err, 'Error');
                    });
            } catch (err) { }
        } else {
            var clauseCategoryFilterCondition = {};
            clauseCategoryFilterCondition["cpFormId"] = formID;
            clauseCategoryFilterCondition["tradingId"] = tradingId;
            clauseCategoryFilterCondition["companyId"] = companyId;
            try {
                this._userService.mainClauseScreenDataRecordsTrading(clauseCategoryFilterCondition).pipe(first()).subscribe((res) => {
                    this.termsReviewRecordsResponse = res;
                    if (this.termsReviewRecordsResponse.success === true) {
                        this.termsReviewRecordsData = this.termsReviewRecordsResponse.data;
                    }
                },
                    err => {
                        this.alertService.error(err, 'Error');
                    });
            } catch (err) { }
        }
        
    }



    setClauseID(value): void {
        this.clauseId = value;
    }

    // Fetch Clauses And Its Terms Details Records Start

    // Clause Reviews Records Server Side Start

    // Fetch Clauses And Its Terms Details Records Start

    clauseReviewsRecordsServerSide(): void {
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

        try {
            this._userService.clauseTermsReviewsRecordsServerSide(filterCondition)
                .pipe(first())
                .subscribe((res) => {
                    this.clauseCategoryTermsReviewResponse = res;
                    console.log('Clause Termns Review Data');
                    console.log(res);
                    if (this.clauseCategoryTermsReviewResponse.success === true) {
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
                    err => {
                        this.alertService.error(err, 'Error');
                    });
        } catch (err) {
        }
    }

    // Fetch Clauses And Its Terms Details Records Start


    reviewModalShow(clausesId, parentId): void {
        this.clauseId = clausesId;
        this.parentId = parentId;
        this.clauseReviewsRecordsServerSide();
        this._fuseSidebarService.getSidebar('reviewPanel').toggleOpen();

    }

    reviewModalHide(): void {
        this.showReviewModal = !this.showReviewModal;
    }

    onSubmit(): void {

    }


    
    // custome terms add toggle
    toggleOpen(key, id): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
        this.parentId = id;
    }

    // custom terms add
    addClause() {
        this.termsReviewRecordsData = [];
        var mainUserId = localStorage.getItem('userId');
        // console.log(mainUserId +" Main User ID");

        var companyId = localStorage.getItem('companyId');
        // console.log(companyId + " Company ID");

        var drawId = this.drawId;
        var tradingId = this.tradingId;
        // console.log(drawId + " Draw ID");

        var formId = this.formId;
        // console.log(formId + " CP Form ID");

        var clauseCategoryId = this.parentId;
        // console.log(clauseCategoryId + " Clause Category ID");

        // var clauseTermsId = '1';
        // console.log(clauseTermsId + " Clause Terms ID");

        var nos = '1';
        // console.log(nos + " Nos");

        var termsNameOrginal = this.customClause;
        // console.log(termsNameOrginal + " Terms Orginal Name");

        var termsName = this.customClause;
        // console.log(termsName + " Terms Name");
        const req =
        {
            id: '',
            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
            formId: formId,
            clauseCategoryId: clauseCategoryId,
            nos: nos,
            termsNameOrginal: termsNameOrginal,
            termsName: termsName,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
            isCustom: 'Y'
        };
        if(this.isTrading == '1')
        {
            const req =
            {
                id: '',
                mainUserId: mainUserId,
                companyId: companyId,
                tradingId: tradingId,
                formId: formId,
                clauseCategoryId: clauseCategoryId,
                nos: nos,
                termsNameOrginal: termsNameOrginal,
                termsName: termsName,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                isCustom: 'Y'
            };
        }


        try {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/claueseDetailCustomInsertUpdate`, req, headerOptions).subscribe(
                res => {
                    this.termsUpdateRes = res;
                    console.log("HERE OUT RESPONSE");
                    console.log(this.termsUpdateRes);
                    if (this.termsUpdateRes.success === true) {
                        // console.log("HERE IN RESPONSE");
                        console.log(this.termsUpdateRes);
                        this._fuseSidebarService.getSidebar('addPanel').toggleOpen();
                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) {
        }
    }

    // edit toggle open      
    editToggle(key, id, clauseid): void
    {
        let cid = id;
        this.parentId = clauseid;
        this.editclauses = [];
        this._fuseSidebarService.getSidebar(key).toggleOpen();

        this._userService.getclusesList()
            .subscribe(res => {
                this.tempedit = res;
                for (let index = 0; index < this.tempedit.data.length; index++) {

                    if (this.tempedit.data[index].id == id) {
                        this.editclauses.push(this.tempedit.data[index]);
                        this.editid = this.tempedit.data[index].id;

                        this.editclausetext = this.tempedit.data[index].termsName;
                        this.tmpeditclausetext = this.tempedit.data[index].termsName;
                    }
                }
                console.log(this.editclausetext);
                console.log(this.editclauses);
            });
    }

    // main terms  edit
    editterms(id) {
        console.log(id, 'Edit ID Info');
        // this._fuseSidebarService.getSidebar('editPanel').toggleOpen();

        // let tempupdate = {
        //   id: id,
        //   termsName: "<strike>" + this.tmpeditclausetext + "</strike>" + " " + this.editclausetext

        // }

        // // this._userService.customeClauseuUpdate(tempupdate)
        // //   .subscribe(res => {
        // //     this._fuseSidebarService.getSidebar('editPanel').toggleOpen();

        // //   });
        // for (let index = 0; index < this.clauses.length; index++) {
        //   if (this.clauses[index].id == id) {
        //     this.clauses[index].termsName = "<strike>" + this.tmpeditclausetext + "</strike>" + " " + this.editclausetext;
        //   }
        // }
        var mainUserId = localStorage.getItem('userId');
        // console.log(mainUserId +" Main User ID");

        var companyId = localStorage.getItem('companyId');
        // console.log(companyId + " Company ID");

        var drawId = this.drawId;

        var tradingId = this.tradingId;
        // console.log(drawId + " Draw ID");

        var formId = this.formId;
        // console.log(formId + " CP Form ID");

        var clauseCategoryId = this.parentId;
        // console.log(clauseCategoryId + " Clause Category ID");

        var clauseTermsId = id;
        // console.log(clauseTermsId + " Clause Terms ID");

        var nos = '1';
        // console.log(nos + " Nos");

        var termsNameOrginal = this.tmpeditclausetext;
        // console.log(termsNameOrginal + " Terms Orginal Name");

        var termsName = this.editclausetext;
        // console.log(termsName + " Terms Name");

        const req =
        {

            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
            formId: formId,
            clauseCategoryId: clauseCategoryId,
            clauseTermsId: clauseTermsId,
            nos: nos,
            termsNameOrginal: termsNameOrginal,
            termsName: termsName,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
            isCustom: 'Y'
        };

        if(this.isTrading == '1')
        {
            const req =
            {

                mainUserId: mainUserId,
                companyId: companyId,
                tradingId: tradingId,
                formId: formId,
                clauseCategoryId: clauseCategoryId,
                clauseTermsId: clauseTermsId,
                nos: nos,
                termsNameOrginal: termsNameOrginal,
                termsName: termsName,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                isCustom: 'Y'
            };
        }
        console.log("check request", req);

        try {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(
                res => {
                    this.termsUpdateRes = res;
                    console.log("HERE OUT RESPONSE");
                    console.log(this.termsUpdateRes);
                    if (this.termsUpdateRes.success === true) {
                        // console.log("HERE IN RESPONSE");
                        console.log(this.termsUpdateRes);
                        this._fuseSidebarService.getSidebar('editPanel').toggleOpen();
                        this.editclausetext = '';

                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) {
        }
        // this.clausesDetail();
    }

    // custom terms edit toggle
    customToggle(key, id, clauseid): void {
        // let cid = id;
        // this._fuseSidebarService.getSidebar(key).toggleOpen();
        // for (let index = 0; index < this.newClause.length; index++) {
        //   if (this.newClause[index].id == id) {
        //     //  this.editclauses.push(this.newClause[index]);
        //     this.ceditid = this.newClause[index].id;
        //     this.editclausetext = this.newClause[index].termsName;
        //     this.tmpceditclausetext = this.newClause[index].termsName;
        //   }
        // }
        // console.log(this.editclausetext);
        // console.log(this.ceditid);
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        var drawId = filter.drawId;
        var tradingId = filter.tradingId;
        var formID = filter.formId;
        var companyId = filter.companyId;
        var isTrading = filter.isTrading;

        this.isTrading = filter.isTrading;

        let cid = id;
        this.parentId = clauseid;
        this.editclauses = [];
        this._fuseSidebarService.getSidebar(key).toggleOpen();
        var clauseTermsReviewFilter = {};

        if(isTrading == '2')
        {
            clauseTermsReviewFilter["tu.companyId"] = companyId;
            clauseTermsReviewFilter["tu.drawId"] = drawId;
            clauseTermsReviewFilter["tu.formId"] = formID;
            clauseTermsReviewFilter["tu.clauseCategoryId"] = this.parentId;
            // clauseTermsReviewFilter["tu.clauseTermsId"] = clauseTermsID;

            this._userService.clauseTermsReviewsRecordsServerSideCustom(clauseTermsReviewFilter)
                .subscribe(res => {
                    this.tempedit = res;
                    for (let index = 0; index < this.tempedit.data.length; index++) {

                        if (this.tempedit.data[index].id == id) {
                            this.editclauses.push(this.tempedit.data[index]);
                            this.editid = this.tempedit.data[index].id;
                            console.log(this.editid,'Custom Edit ID Info');
                            this.editclausetext = this.tempedit.data[index].termsName;
                            this.tmpeditclausetext = this.tempedit.data[index].termsName;
                        }
                    }
                    console.log(this.editclausetext);
                    console.log(this.editclauses);
                });    
        } else {
            clauseTermsReviewFilter["tu.companyId"] = companyId;
            clauseTermsReviewFilter["tu.tradingId"] = tradingId;
            clauseTermsReviewFilter["tu.formId"] = formID;
            clauseTermsReviewFilter["tu.clauseCategoryId"] = this.parentId;
            // clauseTermsReviewFilter["tu.clauseTermsId"] = clauseTermsID;

            this._userService.clauseTermsReviewsRecordsServerSideCustom(clauseTermsReviewFilter)
                .subscribe(res => {
                    this.tempedit = res;
                    for (let index = 0; index < this.tempedit.data.length; index++) {

                        if (this.tempedit.data[index].id == id) {
                            this.editclauses.push(this.tempedit.data[index]);
                            this.editid = this.tempedit.data[index].id;
                            console.log(this.editid,'Custom Edit ID Info');
                            this.editclausetext = this.tempedit.data[index].termsName;
                            this.tmpeditclausetext = this.tempedit.data[index].termsName;
                        }
                    }
                    console.log(this.editclausetext);
                    console.log(this.editclauses);
                });    
        }
        
        
    }

    // custome terms edit    
    customEdit(id) {
        console.log(id);
        // let ceid = id;
        // let tempedit = {
        //   id: this.ceditid,
        //   termsName: "<strike>" + this.tmpceditclausetext + "</strike>" + " " + this.editclausetext,
        //   updatedBy: localStorage.getItem('userId')
        // }
        // console.log(tempedit);

        // // this._userService.customeClauseuUpdate(tempedit)
        // //   .subscribe(res => {
        // //     console.log(res);
        // //   });

        // // this.display();
        // for (let index = 0; index < this.newClause.length; index++) {
        //   if (this.newClause[index].id == id) {
        //     this.newClause[index].termsName = "<strike>" + this.tmpceditclausetext + "</strike>" + " " + this.editclausetext;
        //     // this.newClause[index].termsName = this.editclausetext;
        //   }
        // }
        // this._fuseSidebarService.getSidebar('customPanel').toggleOpen();
        // this.editclausetext = '';
        // this.termsReviewRecords();
        // console.log(this.newClause);

        var mainUserId = localStorage.getItem('userId');
        // console.log(mainUserId +" Main User ID");

        var companyId = localStorage.getItem('companyId');
        // console.log(companyId + " Company ID");

        var drawId = this.drawId;

        var tradingId = this.tradingId;
        // console.log(drawId + " Draw ID");

        var formId = this.formId;
        // console.log(formId + " CP Form ID");

        var clauseCategoryId = this.parentId;
        // console.log(clauseCategoryId + " Clause Category ID");

        var clauseTermsId = '';
        // console.log(clauseTermsId + " Clause Terms ID");

        var nos = '1';
        // console.log(nos + " Nos");

        var termsNameOrginal = this.tmpeditclausetext;
        // console.log(termsNameOrginal + " Terms Orginal Name");

        var termsName = this.editclausetext;
        // console.log(termsName + " Terms Name");
        
        const req =
        {
            id: id,
            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
            tradingId: tradingId,
            formId: formId,
            clauseCategoryId: clauseCategoryId,
            clauseTermsId: clauseTermsId,
            nos: nos,
            termsNameOrginal: termsNameOrginal,
            termsName: termsName,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
            isCustom: 'Y'
        };
        console.log("check request", req);

        try {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/claueseDetailCustomInsertUpdate`, req, headerOptions).subscribe(
                res => {
                    this.termsUpdateRes = res;
                    console.log("HERE OUT RESPONSE");
                    console.log(this.termsUpdateRes);
                    if (this.termsUpdateRes.success === true) {
                        // console.log("HERE IN RESPONSE");
                        console.log(this.termsUpdateRes);
                        this._fuseSidebarService.getSidebar('customPanel').toggleOpen();
                        this.editclausetext = '';

                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) {
        }
    }
    //   main terms view

    view(key, id, clauseid) {
        let cid = id;
        this.parentId = clauseid;
        this.editclauses = [];

        console.log(cid , this.parentId, this.editclauses);
        this._fuseSidebarService.getSidebar(key).toggleOpen();
        this.viewData = [];
        for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
            // console.log(this.termsReviewRecordsData,'test');
            if (this.termsReviewRecordsData[index].id == this.parentId) {
                for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++) {
                    if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].id == cid) {
                        if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length != 0) {
                            for (let thirdindex = 0; thirdindex < this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length; thirdindex++) {
                                this.viewData.push(this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate[thirdindex])

                            }
                        }

                    }
                }

            }

        }
        this.dataSource = new MatTableDataSource(this.viewData);
        // setTimeout(() => this.dataSource.paginator = this.paginator, 15000);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.viewData, "view array")
        console.log(this.dataSource, 'viewdata');

    }


    // custome terms view
    viewCustom(key, id, clauseid) {
        let cid = id;
        this.parentId = clauseid;
        this.editclauses = [];
        this._fuseSidebarService.getSidebar(key).toggleOpen();
        this.viewData = [];
        for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
            // console.log(this.termsReviewRecordsData,'test');
            if (this.termsReviewRecordsData[index].id == this.parentId) {
                for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++) {
                    if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].id == cid) {
                        if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length != 0) {
                            for (let thirdindex = 0; thirdindex < this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length; thirdindex++) {
                                this.viewCustomData.push(this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate[thirdindex])

                            }
                        }
                    }
                }
            }
        }

        this.dataSourcecustom = new MatTableDataSource(this.viewCustomData);
        // setTimeout(() => this.dataSource.paginator = this.paginator, 15000);
        this.dataSourcecustom.paginator = this.paginator;
        this.dataSourcecustom.sort = this.sort;
        console.log(this.viewData, "view array")
        console.log(this.dataSourcecustom, 'viewdata');
    }


    submit() {

        var fromUserId = localStorage.getItem('userId');
        // console.log(mainUserId +" Main User ID");
        var notification = 'New Draw C/p Available';
        var toUserId = this.chartererId;

        if(this.isTrading == '2')
        {
            const reqData =
            {
                drawId:this.drawId,
                chartererId: toUserId,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
            }
            console.log(reqData);
            this._userService.DrawRequestToChartererCreate(reqData).pipe(first()).subscribe(
            data =>
            {
                this.submitResponse = data;
                const req =
                {
                    fromUserId: localStorage.getItem('userId'),
                    toUserId: toUserId,
                    notification: 'New Notification',
                    createdBy: localStorage.getItem('userId'),
                    updatedBy: localStorage.getItem('userId')
                };
                try {
                    const header = new HttpHeaders();
                    header.append('Content-Type', 'application/json');
                    const headerOptions =
                    {
                        headers: header
                    }
                    this.http.post(`${config.baseUrl}/notificationCreate`, req, headerOptions).subscribe(
                        res => {
                            this.notifiactionres = res;
                            console.log(this.notifiactionres);
                            if (this.notifiactionres.success === true)
                            {
                                console.log(this.notifiactionres);
                            }
                        }
                    );
                } catch (err) {
                }
                if (this.submitResponse.success === true)
                {
                
                }
            });
        } else {
            const reqData =
            {
                tradingId:this.tradingId,
                chartererId: toUserId,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
            }
            console.log(reqData);
            this._userService.TradingPlatformRequestToChartererCreate(reqData).pipe(first()).subscribe(
            data =>
            {
                this.submitResponse = data;
                const req =
                {
                    fromUserId: localStorage.getItem('userId'),
                    toUserId: toUserId,
                    notification: 'New Notification For Trading Platform',
                    createdBy: localStorage.getItem('userId'),
                    updatedBy: localStorage.getItem('userId')
                };
                try {
                    const header = new HttpHeaders();
                    header.append('Content-Type', 'application/json');
                    const headerOptions =
                    {
                        headers: header
                    }
                    this.http.post(`${config.baseUrl}/notificationCreate`, req, headerOptions).subscribe(
                        res => {
                            this.notifiactionres = res;
                            console.log(this.notifiactionres);
                            if (this.notifiactionres.success === true)
                            {
                                console.log(this.notifiactionres);

                                
                            }
                        }
                    );
                } catch (err) {
                }
                if (this.submitResponse.success === true)
                {
                
                }
            });
        }




        if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
            // this.pageTitle = 'Draw C/P Clauses';
            const req =
            {
                broker_clauses:JSON.stringify(this.check),
                common_clauses:JSON.stringify(this.check),
                updatedBy: localStorage.getItem('userId')
            };
            try {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/drawFormUpdateByBrokerCheck`, req, headerOptions).subscribe(
                    res => {
                        this.notifiactionres = res;
                        console.log(this.notifiactionres);
                        if (this.notifiactionres.success === true)
                        {
                            console.log(this.notifiactionres);

                            
                        }
                    }
                );
            } catch (err) {
            }

        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
            const req =
            {
                charterer_clauses:JSON.stringify(this.check),
                common_clauses:JSON.stringify(this.check),
                updatedBy: localStorage.getItem('userId')
            };
            try {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/drawFormUpdateByCharterCheck`, req, headerOptions).subscribe(
                    res => {
                        this.notifiactionres = res;
                        console.log(this.notifiactionres);
                        if (this.notifiactionres.success === true)
                        {
                            console.log(this.notifiactionres);

                            
                        }
                    }
                );
            } catch (err) {
            }
     // this.pageTitle = 'Charterer First Counter';
       
       
       
       
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            // this.pageTitle = 'Owner First Counter';
            const req =
            {
                owner_clauses:JSON.stringify(this.check),
                common_clauses:JSON.stringify(this.check),
                updatedBy: localStorage.getItem('userId')
            };
            try {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/drawFormUpdateByOwnerCheck`, req, headerOptions).subscribe(
                    res => {
                        this.notifiactionres = res;
                        console.log(this.notifiactionres);
                        if (this.notifiactionres.success === true)
                        {
                            console.log(this.notifiactionres);

                            
                        }
                    }
                );
            } catch (err) {
            }   
   
        }

    }




    // check box    click and add

    checkclick(id){

       let cid = id ;

            this.check.push(cid);
        
        console.log(this.check);
        console.log(JSON.stringify(this.check));
        
    } 
}