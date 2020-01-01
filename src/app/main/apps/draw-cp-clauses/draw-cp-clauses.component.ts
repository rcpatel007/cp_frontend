import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, single } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTooltip } from '@angular/material/tooltip';
import { UserService } from '../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';
import { FormGroupDirective, NgForm, } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import * as moment from 'moment';
import { exists } from 'fs';

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
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class DrawCpClausesComponent implements OnInit
{
    isFolded = false;
    panelOpenState = false;

    // Review Table Start
    displayedColumns: string[] = ['userName', 'updatedDateInfo', 'clauseTracker'];
    
    dataSourcecustom = new MatTableDataSource<PeriodicElement>();
    dataSource = new MatTableDataSource<PeriodicElement>();

    dataSourceOfCustomTermsUpodateOfCustomTermsOfCustomClause = new MatTableDataSource<PeriodicElement>();

    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    applyFilter(filterValue: string)
    {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.dataSourceOfCustomTermsUpodateOfCustomTermsOfCustomClause.filter = filterValue.trim().toLowerCase();
    }
    id: String;
    counterId: String;
    
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

    drawResponse: any;

    tradingResponse : any;

    commonClausesArray = [];
    commonClausesCustomArray = [];
    commonClausesCustomClauseTermArray = [];

    counterIdInfo: any;

    reviewData = [];

    customClause: String;
    termsUpdateRes: any;

    editclauses = [];
    tempedit: any;
    editid: string;
    editclausetext: String;
    tmpeditclausetext: String;
    submitResponse: any;
    notifiactionres: any;
    viewData = [];
    viewCustomData = []
    check = [];
    // Review Table End

    showReviewModal = false;


    clauseCategoryResponse: any;
    clauseCategoryData = [];

    clauseCategoryTermsResponse: any;
    clauseCategoryTermsData = [];

    clauseCategoryTermsReviewResponse: any;
    clauseCategoryTermsReviewData = [];

    customClauseDataResponse: any;
    customClauseDataResponseData = [];

    clauseCategoryRecordResponse: any;
    clauseCategoryRecordResponseData = [];

    clauseCategoryRecordResponseDataAllChecked : any;

    totalTermsReviewRecords : any;

    
    cpTimeInfo: string;
    
    
    
    stdBidForm: FormGroup;
    drawcluases = [];
    drawManagementRes: any;
    clusesId = [];
    viewtable: false;

    counterResponse : any;
    convertedWord : any;

    clauseTitle : string;
    clauseTerms : string;
    clauseTermsArray = [];
    htmlToAdd : any;

    drawResponseInformation : any;
    drawResponseInformationData = [];

    

    clauseTermNumber : any;

    customClauseInsertID : any;
    customClauseTermsId : string;
    customClauseTermsResponse : any;
    customClauseTermsResponseData = [];

    customClauseIDInfo : any;
    customTermsOfCustomClause : any;

    addCustomTermsOfCustomClauseResponse : any;
    addCustomTermsOfCustomClauseResponseData = [];

    editCustomTermsOfCustomClauseResponse : any;
    editCustomTermsOfCustomClauseResponseData = [];

    viewCustomTermsOfCustomClauseResponse : any;
    viewCustomTermsOfCustomClauseResponseData = [];

    customTermsOfCustomClauseEdit : any;
    customTermsOfCustomClauseEditID : any;
    customTermsOfCustomClauseEditCustomClauseID : any;
    customTermsOfCustomClauseEditParentID : any;

    checkedClauseCategory = [];
    checkedClauseCategoryRecap = [];

    checkedCheckBoxSecondScreen = [];

    checkedCheckBox = [];
    checkedCheckBoxCustom = [];
    checkedCheckBoxCustomClauseTerms = [];

    editClauseTermOfMainClauseID : any;
    editClauseTermOfMainClauseCategoryID : any;
    editClauseTermOfMainClauseResponse : any;
    editClauseTermOfMainClauseResponseData = [];

    viewClauseTermOfMainClauseResponse : any;
    viewClauseTermOfMainClauseResponseData = [];

    editCustomClauseTermDataInput: String;
    editCustomClauseTermOfMainClauseID : any;
    editCustomClauseTermOfMainClauseCategoryID : any;
    editCustomClauseTermOfMainClauseResponse : any;
    editCustomClauseTermOfMainClauseResponseData = [];

    viewCustomClauseTermOfMainClauseResponse : any;
    viewCustomClauseTermOfMainClauseResponseData = [];
    allchecked:boolean;
    allcheckedCustomClause:boolean;
    allcheckedCustomClauseOfCustomClause:boolean;
    clauseTermsCheckBox : any;
    
    currentSignature1 : any;
    currentSignature2 : any;

    lastAction : any;

    options = [];

    // panelOpenState = false;
    termsReviewRecordsResponse: any;
    termsReviewRecordsData = [];
    chartererId: String;

    termsReviewRecordsResponseRecap: any;
    termsReviewRecordsDataRecap = [];

    clauseCategoryTermsReviewResponseCustom: any;
    clauseCategoryTermsReviewDataCustom = [];
    
    mainScreen = true;

    thirdScreenButton = false;

    

    vesselDataResponse : any;
    vesselDataResponseArray = [];

    chartererDataResponse : any;
    chartererDataResponseArray = [];

   

    dateMonthYearString : string;

    metricTonValue : string;
    customInput1 : string;
    customInput2 : string;
    customInput3 : string;
    customInput4 : string;
    customInput5 : string;

    signature1ImageView = false;
    signature2ImageView = false;
    signature1DemoView = false;
    signature2DemoView = false;

    convrtedString : any;

    dynamicInputForDatePicker : any;

    mainDynamicStringArray = [];

    dynamicStringArray = [];

    dynamicStringUpdateArray = [];

    dynamicInputNumber : any;

    dynamicString : any;

    timePickerValue : any;

    cpTimeStdBid : any;
    cityIdStdBid : any;
    cpDateStdBid : any;
    fixture_subject : any;
    lifted_by : any;
    lifted_time : any;
    lifted_date : any;
    lifted_city : any;
    lifted_charter_party_place : any;
    lifted_charter_fully_style : any;
    lifted_charter_domicile : any;
    lifted_owner_type : any;
    lifted_owner_fully_style : any;
    lifted_owner_domicile : any;

    lifted_vessel_name : any;
    lifted_vessel_imo : any;
    lifted_vessel_flag : any;
    lifted_vessel_year_built : any;

    lifted_vessel_dwat_metric_tons : any;
    lifted_vessel_draft_on_marks : any;
    lifted_vessel_loa : any;
    lifted_vessel_beam : any;
    lifted_vessel_holds : any;
    lifted_vessel_hatches : any;
    lifted_vessel_gear : any;
    lifted_vessel_swl : any;
    
    isStdBid : any;
    
    loading = false;
    submitted = false;

    isDisabled : any;

    isCheckboxDisabled : any;

    isChartererAccepted : any;

    chartererEmailID : any;

    counterNumberInfo : any;

    submitButtonText : any;

    // New Code Start

    // Assign Variables Start
    drawId: String;
    brokerId: String;
    ownerId : string;
    tempChartererId : string;
    tempOwnerId : string;
    tempVesselId : string;
    tradingId: String;
    isTrading: String;
    formId: String;
    companyId: String;
    pageTitle: String;
    cityId: string;
    cpTime: string;
    cpDate: string;
    ownerName : string;
    vesselName : string;
    chartererName : string;
    ownerEmail : string;
    chartererEmail : string;
    brokerName : string;
    cpFormName :  string;
    cityName : string;
    vesselId : string;
    imoNumber : string;
    vesselFlag : string;
    vesselYear : string;
    vesselDescription : string;

    ownerNameNotification : string;
    chartererNameNotification : string;

    message : any;

    ownerCounterNumber : string;
    chartererCounterNumber : string;

    ownerDetailCounterNumber : string;
    chartererDetailCounterNumber : string;

    ownerModal:any;
    chartererModal:any;
    vesselModal:any;

    is_owner_main_term_sign_off : any;
    is_charterer_main_term_sign_off : any;
    is_owner_detail_term_sign_off : any;
    is_charterer_detail_term_sign_off : any;

    ownerMainTermChecked : any;
    chartererMainTermChecked : any;
    ownerDetailTermChecked : any;
    chartererDetailTermChecked : any;

    ownerMainTermDisabled : any;
    chartererMainTermDisabled : any;
    ownerDetailTermDisabled : any;
    chartererDetailTermDisabled : any;
    

    ownerCheckedClauses = [];
    ownerCheckedCustomClauses = [];
    ownerCheckedCustomTermsClauses = [];

    chartererCheckedClauses = [];
    chartererCheckedCustomClauses = [];
    chartererCheckedCustomTermsClauses = [];


    brokerCheckedClauses = [];

    clauseChecked = [];
    clauseCustomChecked = [];
    clauseCustomTermsChecked = [];

    mainTermCheckedClauses = [];
    mainTermCheckedClausesCustom = [];
    mainTermCheckedClausesCustomTerms = [];
    // Assign Values End

    // Set View Variables Start
    firstScreen = true;
    firstScreenStdBid = false;
    firstScreenStdBidBroker = false;
    secondScreen = false;
    thirdScreen = false;

    ownerDropdownView = false;
    ownerNameView = false;

    vesselDropdownView = false;
    vesselNameView = false;

    chartererDropdownView = false;
    chartererNameView = false;
    
    mainTermOwnerSignOffView = false;
    mainTermChartererSignOffView = false;
    
    detailTermOwnerSignOffView = false;
    detailTermChartererSignOffView = false;
    
    // Set View Variables End

    // Assign API Variable Start
    cpFormRecordsServerSideResponse : any;
    cpFormRecordsServerSideResponseData = [];
    cityRecordsServerSideResponse: any;
    cityRecordsServerSideResponseData = [];
    tradingRecordsServerSideResponse : any;
    tradingRecordsServerSideResponseData = [];
    ownerRecordsServerSideResponse : any;
    ownerRecordsServerSideResponseData = [];
    vesselRecordsServerSideResponse : any;
    vesselRecordsServerSideResponseData = [];

    chartererRecordsServerSideResponse : any;
    chartererRecordsServerSideResponseData = [];

    mainTermCheckedClausesCategory = [];
    // Assign API Variable End

    // Form Settings End
    ownerDropDownForm: FormGroup;
    ownerDropDownFormSubmitResponse : any;
    ownerDropDownFormSubmitResponseData = [];
    get ownerDropDownFormValue() { return this.ownerDropDownForm.controls; }

    vesselDropDownForm: FormGroup;
    vesselDropDownFormSubmitResponse : any;
    vesselDropDownFormSubmitResponseData = [];
    get vesselDropDownFormValue() { return this.vesselDropDownForm.controls; }

    chartererDropDownForm: FormGroup;
    chartererDropDownFormSubmitResponse : any;
    chartererDropDownFormSubmitResponseData = [];
    get chartererDropDownFormValue() { return this.chartererDropDownForm.controls; }
    // Form Settings End

    // Assign Form Values Start
    clauseForm: FormGroup;
    get clauseFormValues() { return this.clauseForm.controls; }
    // Assign Form Values End

    

    // New Code End


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
        this.dataSource = new MatTableDataSource(this.viewCustomTermsOfCustomClauseResponseData);
    }

    get fStdBidSubmit() { return this.stdBidForm.controls; }

    htmlStr: string = '<strong>The Tortoise</strong> &amp; the Hare <button></button>';

    ngOnInit()
    {
        // New Code Start
        
        // Assign Values Start

        this.submitButtonText = 'Submit';

        var clauseFilterData = JSON.parse(localStorage.getItem('clauseFilterData'));
        this.drawId = clauseFilterData.drawId;
        this.tradingId = clauseFilterData.tradingId;
        this.isTrading = clauseFilterData.isTrading;
        this.formId = clauseFilterData.formId;
        this.companyId = localStorage.getItem('companyId');
        this.pageTitle = (this.isTrading == '2') ? 'Draw C/P Clauses' : 'Trading Clauses';
        this.message = (this.isTrading == '2') ? 'Draw C/P Clauses' : 'Trading Clauses';

        this.ownerName = '';
        this.chartererName = '';
        this.brokerName = '';
        this.ownerEmail = '';
        this.chartererEmail = '';
        // Assign Values End

        // Set Default Values Start
        this.firstScreen = true;
        this.firstScreenStdBid = false;
        this.firstScreenStdBidBroker = false;
        this.secondScreen = false;
        this.thirdScreen = false;
        this.ownerNameView = false;
        this.ownerDropdownView = false;
        this.chartererDropdownView = false;
        // Set Default Values End

        if(this.formId != '' && this.formId != null && this.formId != undefined)
        {
            // Fetch CP Form Data Start
            this.cpFormRecordsServerSide();
            // Fetch CP Form Data End
        }

        // Fetch City Records Start
        this.cityRecordsServerSide();
        // Fetch City Records End

        // Set Form And Its Validation Start
        this.ownerDropDownForm = this._formBuilder.group(
        {
            ownerId: ['', Validators.required]
        });
        this.vesselDropDownForm = this._formBuilder.group(
        {
            vesselId: ['', Validators.required]
        });
        this.chartererDropDownForm = this._formBuilder.group(
        {
            chartererId: ['', Validators.required]
        });
        // Set Form And Its Validation End

        if(this.isTrading == '2')
        {
            this.fetchDrawDataRecap();
            this.termsReviewRecords();
        } else {
            this.firstScreen = false;
            this.fetchTradingData();
        }

        this.ownerRecordsServerSide();
        this.chartererRecordsServerSide();

        // New Code End
        
        this.isDisabled = 'Y';
        this.clauseTermNumber = 1;
        this.isCheckboxDisabled = 'Y';
        this.mainDynamicStringArray = [];
        this.dynamicInputNumber = 0;
        
        var current_date = moment(new Date()).format("YYYY-MM-DD");
        var current_time = moment().format("HH:mm A");
        this.clauseForm = this._formBuilder.group
        (
            {
                cpTime: [current_time, Validators.required],
                cityId: ['', Validators.required],
                cpDate: [current_date, Validators.required],
            }
        );
        this.stdBidForm = this._formBuilder.group
        (
            {
                cpTimeStdBid: [current_time, Validators.required],
                cityIdStdBid: ['', Validators.required],
                cpDateStdBid: [current_date, Validators.required],
                fixture_subject: ['', ''],
                lifted_by: ['', ''],
                lifted_time: ['', ''],
                lifted_date: ['', ''],
                lifted_city: ['', ''],
                lifted_charter_party_place: ['', ''],
                lifted_charter_fully_style: ['', ''],
                lifted_charter_domicile: ['', ''],
                lifted_owner_fully_style: ['', ''],
                lifted_owner_domicile: ['', ''],
                lifted_owner_type: ['', ''],
                lifted_vessel_name: ['', ''],
                lifted_vessel_imo: ['', ''],
                lifted_vessel_flag: ['', ''],
                lifted_vessel_year_built: ['', ''],
                lifted_vessel_dwat_metric_tons : ['', ''],
                lifted_vessel_draft_on_marks : ['', ''],
                lifted_vessel_loa : ['', ''],
                lifted_vessel_beam : ['', ''],
                lifted_vessel_holds : ['', ''],
                lifted_vessel_hatches : ['', ''],
                lifted_vessel_gear : ['', ''],
                lifted_vessel_swl : ['', ''],
            }
        );
        this.isCheckboxDisabled = 'N';
    }

    // Fetch CP Form Data Records Server Side Start
    cpFormRecordsServerSide()
    {
        var filterCondition = {};
            filterCondition['id'] = this.formId;
        try
        {
            this._userService.cpFormData(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.cpFormRecordsServerSideResponse = res;
                if(this.cpFormRecordsServerSideResponse.success == true)
                {
                    this.cpFormRecordsServerSideResponseData = this.cpFormRecordsServerSideResponse.data;
                    this.cpFormName = this.cpFormRecordsServerSideResponseData[0].cpformName;
                }
            });
        }catch (err){}
    }
    // Fetch CP Form Data Records Server Side End

    // Fetch City Records Start
    cityRecordsServerSide(): void
    {
        try {
            this._userService.CityRecords()
                .pipe(first())
                .subscribe((res) =>
                {
                    this.cityRecordsServerSideResponse = res;
                    if (this.cityRecordsServerSideResponse.success === true)
                    {
                        this.cityRecordsServerSideResponseData = this.cityRecordsServerSideResponse.data;
                    }
                },
                err => {
                    this.alertService.error(err, 'Error');
                });
        } catch (err) {}
    }
    // Fetch City Records End

    // On Change City Start
    changeCity(event): void
    {
        this.cityId = event.target.value;
    }
    // On Change City End

    // Owners Records Server Side Start
    ownerRecordsServerSide()
    {
        var conditionData = {};
            conditionData['companyId'] = this.companyId;
            conditionData['userRoleId'] = '6';
        try
        {
            this._userService.userRecordsServerSide(conditionData).pipe(first()).subscribe((res) =>
            {
                this.ownerRecordsServerSideResponse = res;
                if (this.ownerRecordsServerSideResponse.success === true)
                {
                    this.ownerRecordsServerSideResponseData = this.ownerRecordsServerSideResponse.data;
                    if(this.ownerId != '' && this.ownerId != null && this.ownerId != undefined)
                    {
                        for(let index = 0; index < this.ownerRecordsServerSideResponseData.length; index++)
                        {
                            if(this.ownerId == this.ownerRecordsServerSideResponseData[index].id)
                            {
                                this.ownerName = this.ownerRecordsServerSideResponseData[index].username;
                                this.ownerNameNotification = this.ownerRecordsServerSideResponseData[index].username;

                                // this.pageTitle = this.ownerName+ ' Trading Updates';
                                // this.message = this.ownerName+ ' Trading Updates';
                            }
                        }
                    } else {
                        if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
                        {
                            var userID = JSON.parse(localStorage.getItem('userId'));
                            for(let index = 0; index < this.ownerRecordsServerSideResponseData.length; index++)
                            {
                                if(userID == this.ownerRecordsServerSideResponseData[index].id)
                                {
                                    this.ownerNameNotification = this.ownerRecordsServerSideResponseData[index].username;
                                }
                            }
                        }
                    }
                }
            }, err => {  });
        } catch (err)
        {  }
    }
    // Owners Records Server Side End

    // On Owner Change Start
    onChangeOwner(event)
    {
        this.tempOwnerId =  event.value;
        this.ownerModal = !this.ownerModal;
    }
    // On Owner Change End

    // Charterer Records Server Side Start
    chartererRecordsServerSide()
    {
        var conditionData = {};
            conditionData['companyId'] = this.companyId;
            conditionData['userRoleId'] = '4';
        try
        {
            this._userService.userRecordsServerSide(conditionData).pipe(first()).subscribe((res) =>
            {
                this.chartererRecordsServerSideResponse = res;
                if (this.chartererRecordsServerSideResponse.success === true)
                {
                    this.chartererRecordsServerSideResponseData = this.chartererRecordsServerSideResponse.data;
                    if(this.chartererId != '' && this.chartererId != null && this.chartererId != undefined)
                    {
                        for(let index = 0; index < this.chartererRecordsServerSideResponseData.length; index++)
                        {
                            if(this.chartererId == this.chartererRecordsServerSideResponseData[ index].id)
                            {   
                                this.chartererName = this.chartererRecordsServerSideResponseData[index].username;
                                this.chartererNameNotification = this.chartererRecordsServerSideResponseData[index].username;

                                // this.pageTitle = this.chartererName+ ' Trading Updates';
                                // this.message = this.chartererName+ ' Trading Updates';
                            }
                        }
                    } else {
                        if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
                        {
                            var userID = JSON.parse(localStorage.getItem('userId'));
                            for(let index = 0; index < this.chartererRecordsServerSideResponseData.length; index++)
                            {
                                if(userID == this.chartererRecordsServerSideResponseData[ index].id)
                                {
                                    this.chartererNameNotification = this.chartererRecordsServerSideResponseData[index].username;
                                }
                            }
                        }    
                    }
                }
            }, err => {  });
        } catch (err)
        {  }
    }
    // Charterer Records Server Side End

    // On Charterer Change Start
    onChangeCharterer(event)
    {
        this.tempChartererId =  event.value;
        this.chartererModal = !this.chartererModal;
    }
    // On Charterer Change End

    // Fetch Trading Data Start
    fetchTradingData ()
    {
        var ConditionData = {};
            ConditionData["dcm.id"] = this.tradingId;
        try
        {
            this._userService.fetchTradingData(ConditionData).pipe(first()).subscribe((res) =>
            {
                this.tradingRecordsServerSideResponse = res;
                if(this.tradingRecordsServerSideResponse.success == true)
                {
                    this.tradingRecordsServerSideResponseData = this.tradingRecordsServerSideResponse.data[0];

                    this.is_owner_main_term_sign_off = this.tradingRecordsServerSideResponseData['is_owner_main_term_sign_off'];
                    this.is_charterer_main_term_sign_off = this.tradingRecordsServerSideResponseData['is_charterer_main_term_sign_off'];
                    this.is_owner_detail_term_sign_off = this.tradingRecordsServerSideResponseData['is_owner_detail_term_sign_off'];
                    this.is_charterer_detail_term_sign_off = this.tradingRecordsServerSideResponseData['is_charterer_detail_term_sign_off'];

                    // Assign Values Start
                    this.ownerName = this.tradingRecordsServerSideResponseData['ownerName'];
                    this.chartererName = this.tradingRecordsServerSideResponseData['chartererName'];
                    this.brokerName = this.tradingRecordsServerSideResponseData['brokerName'];
                    this.cityName = this.tradingRecordsServerSideResponseData['cityName'];
                    this.formId = this.tradingRecordsServerSideResponseData['formId'];
                    this.vesselId = this.tradingRecordsServerSideResponseData['vesselId'];
                    this.ownerId = this.tradingRecordsServerSideResponseData['ownerId'];
                    this.chartererId = this.tradingRecordsServerSideResponseData['chartererId'];
                    this.brokerId = this.tradingRecordsServerSideResponseData['brokerId'];
                    this.metricTonValue = this.tradingRecordsServerSideResponseData['metricTonValue'];
                    this.customInput1 = this.tradingRecordsServerSideResponseData['customInput1'];
                    this.customInput2 = this.tradingRecordsServerSideResponseData['customInput2'];
                    this.cpTime = this.tradingRecordsServerSideResponseData['cpTime'];
                    this.cpDate = this.tradingRecordsServerSideResponseData['cpDate'];
                    this.cityId = this.tradingRecordsServerSideResponseData['cpCity'];
                    this.cpTime = (this.cpTime != '' && this.cpTime != null && this.cpTime != undefined) ? this.cpTime : null;
                    this.cpDate = (this.cpDate != '' && this.cpDate != null && this.cpDate != undefined) ? this.cpDate : null;
                    this.cityId = (this.cityId != '' && this.cityId != null && this.cityId != undefined) ? this.cityId : null;
                    this.cpDate = (this.cpDate != null) ? moment(this.cpDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
                    // Assign Values End
                    // Assign Form Values Start
                    this.clauseForm = this._formBuilder.group
                    (
                        {
                            cpTime: [this.cpTime, Validators.required],
                            cityId: [this.cityId, Validators.required],
                            cpDate: [this.cpDate, Validators.required],
                        }
                    );

                    this.lifted_by = this.tradingRecordsServerSideResponseData['lifted_by'];
                    this.lifted_time = this.tradingRecordsServerSideResponseData['lifted_time'];
                    this.lifted_date = this.tradingRecordsServerSideResponseData['lifted_date'];
                    this.lifted_city = this.tradingRecordsServerSideResponseData['lifted_city'];
                    this.lifted_charter_party_place = this.tradingRecordsServerSideResponseData['lifted_charter_party_place'];
                    this.lifted_charter_fully_style = this.tradingRecordsServerSideResponseData['lifted_charter_fully_style'];
                    this.lifted_charter_domicile = this.tradingRecordsServerSideResponseData['lifted_charter_domicile'];
                    this.lifted_owner_fully_style = this.tradingRecordsServerSideResponseData['lifted_owner_fully_style'];
                    this.lifted_owner_domicile = this.tradingRecordsServerSideResponseData['lifted_owner_domicile'];
                    this.lifted_owner_type = this.tradingRecordsServerSideResponseData['lifted_owner_type'];
                    this.lifted_vessel_name = this.tradingRecordsServerSideResponseData['lifted_vessel_name'];
                    this.lifted_vessel_imo = this.tradingRecordsServerSideResponseData['lifted_vessel_imo'];
                    this.lifted_vessel_flag = this.tradingRecordsServerSideResponseData['lifted_vessel_flag'];
                    this.lifted_vessel_year_built = this.tradingRecordsServerSideResponseData['lifted_vessel_year_built'];
                    this.lifted_vessel_dwat_metric_tons = this.tradingRecordsServerSideResponseData['lifted_vessel_dwat_metric_tons'];
                    this.lifted_vessel_draft_on_marks = this.tradingRecordsServerSideResponseData['lifted_vessel_draft_on_marks'];
                    this.lifted_vessel_loa = this.tradingRecordsServerSideResponseData['lifted_vessel_loa'];
                    this.lifted_vessel_beam = this.tradingRecordsServerSideResponseData['lifted_vessel_beam'];
                    this.lifted_vessel_holds = this.tradingRecordsServerSideResponseData['lifted_vessel_holds'];
                    this.lifted_vessel_hatches = this.tradingRecordsServerSideResponseData['lifted_vessel_hatches'];
                    this.lifted_vessel_gear = this.tradingRecordsServerSideResponseData['lifted_vessel_gear'];
                    this.lifted_vessel_swl = this.tradingRecordsServerSideResponseData['lifted_vessel_swl'];
                        
                    this.stdBidForm = this._formBuilder.group
                    (
                        {
                            cpTimeStdBid: [this.cpTime, Validators.required],
                            cityIdStdBid: [this.cityId, Validators.required],
                            cpDateStdBid: [this.cpDate, Validators.required],
                            fixture_subject: [this.fixture_subject, ''],
                            lifted_by: [this.lifted_by, ''],
                            lifted_time: [this.lifted_time, ''],
                            lifted_date: [this.lifted_date, ''],
                            lifted_city: [this.lifted_city, ''],
                            lifted_charter_party_place: [this.lifted_charter_party_place, ''],
                            lifted_charter_fully_style: [this.lifted_charter_fully_style, ''],
                            lifted_charter_domicile: [this.lifted_charter_domicile, ''],
                            lifted_owner_fully_style: [this.lifted_owner_fully_style, ''],
                            lifted_owner_domicile: [this.lifted_owner_domicile, ''],
                            lifted_owner_type: [this.lifted_owner_type, ''],
                            lifted_vessel_name: [this.lifted_vessel_name, ''],
                            lifted_vessel_imo: [this.lifted_vessel_imo, ''],
                            lifted_vessel_flag: [this.lifted_vessel_flag, ''],
                            lifted_vessel_year_built: [this.lifted_vessel_year_built, ''],
                            lifted_vessel_dwat_metric_tons : [this.lifted_vessel_dwat_metric_tons, ''],
                            lifted_vessel_draft_on_marks : [this.lifted_vessel_draft_on_marks, ''],
                            lifted_vessel_loa : [this.lifted_vessel_loa, ''],
                            lifted_vessel_beam : [this.lifted_vessel_beam, ''],
                            lifted_vessel_holds : [this.lifted_vessel_holds, ''],
                            lifted_vessel_hatches : [this.lifted_vessel_hatches, ''],
                            lifted_vessel_gear : [this.lifted_vessel_gear, ''],
                            lifted_vessel_swl : [this.lifted_vessel_swl, ''],
                        }
                    );

                    // Assign Form Values End
                    // Set Array For Checked Clauses Start
                    this.checkedClauseCategory = [];
                    var checkedClausesArray = this.tradingRecordsServerSideResponseData['checked_clauses'];
                    if(checkedClausesArray != '' && checkedClausesArray != null && checkedClausesArray != undefined)
                    {
                       this.checkedClauseCategory = checkedClausesArray.split(',');
                    } else {
                       this.checkedClauseCategory = [];
                    }
                    var checkedCheckBoxArray = this.checkedClauseCategory;
                    this.checkedClauseCategory = [];
                    for (let index = 0; index < checkedCheckBoxArray.length; index++)
                    {
                        this.checkedClauseCategory.push(Number(checkedCheckBoxArray[index]));
                    }
                    localStorage.setItem('checkedClauseCategory', JSON.stringify(this.checkedClauseCategory));
                    // Set Array For Checked Clauses End
                    // Fetch Vessel Data Start
                    if(this.vesselId != '' && this.vesselId != null && this.vesselId != undefined)
                    {
                        this.fetchVesselData();
                        this.vesselNameView = true;
                        this.vesselDropdownView = false;
                    }
                    if(this.vesselId == '' || this.vesselId == null || this.vesselId == undefined)
                    {
                        if(this.ownerId != '' && this.ownerId != null && this.ownerId != undefined)
                        {
                            this.vesselRecordsServerSide();
                            this.vesselDropdownView = true;
                        }
                    }
                    // Fetch Vessel Data End
                    if(this.formId != '' && this.formId != null && this.formId != undefined)
                    {
                        // Fetch CP Form Data Start
                        this.cpFormRecordsServerSide();
                        // Fetch CP Form Data End
                        // Clause Category Records Server Side Start
                        this.clauseCategoryRecordsServerSide();
                        // Clause Category Records Server Side End
                    }
                    if(this.ownerId == '' || this.ownerId == null || this.ownerId == undefined)
                    {
                        // Owner Records Server Side Start
                        this.ownerRecordsServerSide();
                        // Owner Records Server Side End
                        this.ownerDropdownView = true;
                    }

                    if(this.ownerId != '' && this.ownerId != null && this.ownerId != undefined)
                    {
                        this.ownerNameView = true;
                    }

                    if(this.chartererId == '' || this.chartererId == null || this.chartererId == undefined)
                    {
                        // Owner Records Server Side Start
                        this.chartererRecordsServerSide();
                        // Owner Records Server Side End
                        this.chartererDropdownView = true;
                    }

                    if(this.chartererId != '' && this.chartererId != null && this.chartererId != undefined)
                    {
                        this.chartererNameView = true;
                    }

                    if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
                    {
                        this.mainTermOwnerSignOffView = true;
                    }
                    this.mainTermChartererSignOffView = false;
                    
                    this.detailTermOwnerSignOffView = false;
                    this.detailTermChartererSignOffView = false;

                    this.ownerMainTermDisabled = 'Y';
                    this.chartererMainTermDisabled = 'Y';
                    this.ownerDetailTermDisabled = 'Y';
                    this.chartererDetailTermDisabled = 'Y';

                    this.ownerMainTermChecked = 'N';
                    this.chartererMainTermChecked = 'N';
                    this.ownerDetailTermChecked = 'N';
                    this.chartererDetailTermChecked = 'N';

                    this.ownerMainTermChecked = (this.is_owner_main_term_sign_off == '1') ? 'Y' : 'N';
                    this.chartererMainTermChecked = (this.is_charterer_main_term_sign_off == '1') ? 'Y' : 'N';
                    this.ownerDetailTermChecked = (this.is_owner_detail_term_sign_off == '1') ? 'Y' : 'N';
                    this.chartererDetailTermChecked = (this.is_charterer_detail_term_sign_off == '1') ? 'Y' : 'N';

                    if(this.is_owner_main_term_sign_off == '1')
                    {
                        this.mainTermChartererSignOffView = true;
                    }

                    if(this.is_owner_main_term_sign_off == '1' && this.is_charterer_main_term_sign_off == '1')
                    {
                        this.mainTermOwnerSignOffView = false;
                        this.mainTermChartererSignOffView = false;
                        this.detailTermOwnerSignOffView = true;
                    }

                    if(this.is_owner_detail_term_sign_off == '1')
                    {
                        this.detailTermChartererSignOffView = true;
                    }

                    if(this.is_owner_detail_term_sign_off == '1')
                    {
                        this.detailTermChartererSignOffView = true;
                        this.firstScreenStdBidBroker = true;
                        this.firstScreen = false;
                        this.submitButtonText = 'Raise A Request';
                    } else {
                        this.firstScreen = true;
                    }

                    this.ownerMainTermDisabled = (JSON.parse(localStorage.getItem('userRoleId')) == '6' && this.ownerMainTermChecked == 'N') ? 'N' : 'Y';
                    this.ownerDetailTermDisabled = (JSON.parse(localStorage.getItem('userRoleId')) == '6' && this.ownerDetailTermChecked == 'N') ? 'N' : 'Y';

                    this.chartererMainTermDisabled = (JSON.parse(localStorage.getItem('userRoleId')) == '4' && this.chartererMainTermChecked == 'N') ? 'N' : 'Y';
                    this.chartererDetailTermDisabled = (JSON.parse(localStorage.getItem('userRoleId')) == '4' && this.chartererDetailTermChecked == 'N') ? 'N' : 'Y';

                     // Set Page Title Start
                     var ownerCounter = this.tradingRecordsServerSideResponseData['owner_counter'];
                     var chartererCounter = this.tradingRecordsServerSideResponseData['charterer_counter'];
 
                     var ownerDetailCounter = this.tradingRecordsServerSideResponseData['owner_detail_counter'];
                     var chartererDetailCounter = this.tradingRecordsServerSideResponseData['charterer_detail_counter'];
 
                     if(this.is_owner_main_term_sign_off != '1' && this.is_charterer_main_term_sign_off != '1')
                     {
                        this.ownerCounterNumber = ownerCounter;
                        this.chartererCounterNumber = chartererCounter;
 
                        if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
                        {
                            if (ownerCounter > 1)
                            {
                                this.chartererCounterNumber = chartererCounter + 1;
                                this.pageTitle = this.chartererNameNotification+' '+this.NumInWords(chartererCounter)+' Counter';
                                if(this.is_owner_main_term_sign_off == '1')
                                {
                                    this.pageTitle = this.chartererNameNotification+' Final Counter ';
                                }
                                this.message = this.pageTitle;
                            }
                        }
                         if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
                         {
                             this.ownerCounterNumber = ownerCounter + 1;
                             this.pageTitle = this.ownerNameNotification+' '+this.NumInWords(ownerCounter)+' Counter';
                             this.message = this.pageTitle;
                         }

                         console.log(this.message);

                     } else {
                         this.ownerDetailCounterNumber = ownerDetailCounter;
                         this.chartererDetailCounterNumber = chartererDetailCounter;
 
                         if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
                         {
                             if (ownerDetailCounter > 1)
                             {
                                 this.chartererDetailCounterNumber = chartererDetailCounter + 1;
                                 this.pageTitle = this.chartererNameNotification+' Detail '+this.NumInWords(chartererDetailCounter)+' Counter';
                                 if(this.is_owner_detail_term_sign_off == '1')
                                 {
                                     this.pageTitle = this.chartererNameNotification+' Detail Final Counter ';
                                 }
                                 this.message = this.pageTitle;
                             }
                         }
                         if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
                         {
                             this.ownerDetailCounterNumber = ownerDetailCounter + 1;
                             this.pageTitle = this.ownerNameNotification+' Detail '+this.NumInWords(ownerDetailCounter)+' Counter';
                             this.message = this.pageTitle;
                         }
                     }

                     console.log(this.message);
                     
                     // Set Page Title End
                    
                }
            });
        }catch (err){}
    }
    // Fetch Trading Data End

    // Owner Charterer Checkgbxo Changed

    ownerMainTermCheckBoxChange(event)
    {
        this.is_owner_main_term_sign_off =  (event.checked == true) ? '1' : '0';
    }

    chartererMainTermCheckBoxChange(event)
    {
        this.is_charterer_main_term_sign_off =  (event.checked == true) ? '1' : '0';
        console.log(this.is_charterer_main_term_sign_off,"Charterer Signed OFF");
    }

    ownerDetailTermCheckBoxChange(event)
    {
        this.is_owner_detail_term_sign_off =  (event.checked == true) ? '1' : '0';
    }

    chartererDetailTermCheckBoxChange(event)
    {
        this.is_charterer_detail_term_sign_off =  (event.checked == true) ? '1' : '0';
    }

    // Vessel Records Sever Side Start
    vesselRecordsServerSide()
    {
        var conditionData = {};
            conditionData["vm.id_owner"] = this.ownerId;
        try
        {
            this._userService.vesselRecordsServerSide(conditionData).pipe(first()).subscribe((res) =>
            {
                this.vesselRecordsServerSideResponse = res;
                if(this.vesselRecordsServerSideResponse.success == true)
                {
                    this.vesselRecordsServerSideResponseData = this.vesselRecordsServerSideResponse.data;
                }
            });
        }catch (err){}
    }
    // Vessel Records Sever Side End

    // On Vessel Change Start
    onChangeVessel(event)
    {
        this.tempVesselId =  event.value;
        this.vesselModal = !this.vesselModal;
    }
    // On Vessel Change End

    // Fetch Vessel Data Start
    fetchVesselData()
    {
        var filterCondition = {};
            filterCondition["id"] = this.vesselId;
        try
        {
            this._userService.fetchVesselData(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.vesselDataResponse = res;
                if(this.vesselDataResponse.success == true)
                {
                    this.vesselName = '';
                    this.imoNumber = '';
                    this.vesselFlag = '';
                    this.vesselYear = '';
                    this.vesselDescription = '';
                    this.vesselDataResponseArray = this.vesselDataResponse.data[0];
                    if(this.vesselDataResponse.data[0] != '' && this.vesselDataResponse.data[0] != null && this.vesselDataResponse.data[0] != undefined)
                    {
                        this.vesselName = this.vesselDataResponse.data[0].vessel_name;
                        this.imoNumber = this.vesselDataResponse.data[0].imo;
                        this.vesselFlag = this.vesselDataResponse.data[0].flageName;
                        this.vesselYear = this.vesselDataResponse.data[0].built_year;
                        this.vesselDescription = this.vesselDataResponse.data[0].vessel_info;
                    }
                }
            });
        }catch (err){}
    }
    // Fetch Vessel Data End

    // Clause Category Records Server Side Start
    clauseCategoryRecordsServerSide()
    {
        var ConditionData = {};
            ConditionData['cpFormId'] = this.formId;
            ConditionData['checkedClauseCategory'] = this.checkedClauseCategory;
        try
        {
            this._userService.clauseCategoryRecordsServerSide(ConditionData).pipe(first()).subscribe((res) =>
            {
                this.clauseCategoryRecordResponse = res;
                if(this.clauseCategoryRecordResponse.success == true)
                {
                    this.clauseCategoryRecordResponseData = this.clauseCategoryRecordResponse.data;
                    this.termsReviewRecords();
                }
            });
        }catch (err){}
    }
    // Clause Category Records Server Side End
    
    // Show Owner Change Modal Start
    showOwnerChangeModal(): void
    {
        this.ownerModal = !this.ownerModal;
    }
    // Show Owner Change Modal End
 
    // Hide Owner Change Modal Start
    hideOwnerChangeModal(): void
    {
        this.ownerModal = !this.ownerModal;
        this.ownerDropDownForm = this._formBuilder.group(
        {
            ownerId: ['', Validators.required]
        });
    }
    // Hide Owner Change Modal End

    // Change Owner Start
    changeOwner()
    {
        this.ownerModal = !this.ownerModal;
        this.ownerId = this.tempOwnerId;
        for(let index = 0; index < this.ownerRecordsServerSideResponseData.length; index++)
        {
            if(this.ownerId == this.ownerRecordsServerSideResponseData[index].id)
            {
                this.ownerName = this.ownerRecordsServerSideResponseData[index].username;
                this.ownerEmail = this.ownerRecordsServerSideResponseData[index].email;
            }
        }
        var updateData = {};
            updateData['chartererId'] = JSON.parse(localStorage.getItem('userId'));
            updateData['ownerId'] = this.ownerId;
            updateData['brokerId'] = this.brokerId;
            updateData['tradingId'] = this.tradingId;
            updateData['ownerEmail'] = this.ownerEmail;
            updateData['ownerName'] = this.ownerName;
            updateData['notification'] = 'You are invited for trade';
            updateData['createdBy'] = JSON.parse(localStorage.getItem('userId'));
            updateData['updatedBy'] = JSON.parse(localStorage.getItem('userId'));
        try
        {
            this._userService.chartererInviteOwnerForTrade(updateData).pipe(first()).subscribe((res) =>
            {
                this.ownerDropdownView = false;
                this.ownerNameView = true;
                this.vesselRecordsServerSide();
                this.vesselDropdownView = true;
                this.alertService.success('Owner Updated Successfully', 'Success');
            }, err => {  });
        } catch (err)
        {  }

        var updateData = {};
            updateData['ownerId'] = this.ownerId;  
            updateData['id'] = this.tradingId;
            updateData['updatedBy'] = JSON.parse(localStorage.getItem('userId'));
        try
        {
            this._userService.tradingDataUpdateCommon(updateData).pipe(first()).subscribe((res) =>
            {
            }, err => {  });
        } catch (err)
        {  }
    }
    // Change Owner End
    

    // Show Vessel Change Modal Start
    showVesselChangeModal(): void
    {
        this.vesselModal = !this.vesselModal;
    }
    // Show Vessel Change Modal End
 
    // Hide Vessel Change Modal Start
    hideVesselChangeModal(): void
    {
        this.vesselModal = !this.vesselModal;
        this.vesselDropDownForm = this._formBuilder.group(
        {
            vesselId: ['', Validators.required]
        });
    }
    // Hide Vessel Change Modal End

    // Change Vessel Start
    changeVessel()
    {
        this.vesselModal = !this.vesselModal;
        this.vesselId = this.tempVesselId;
        for(let index = 0; index < this.vesselRecordsServerSideResponseData.length; index++)
        {
            if(this.vesselId == this.vesselRecordsServerSideResponseData[index].id)
            {
                this.vesselName = this.vesselRecordsServerSideResponseData[index].username;
            }
        }
        var updateData = {};
            updateData['ownerId'] = this.ownerId;    
            updateData['vesselId'] = this.vesselId;
            updateData['id'] = this.tradingId;
            updateData['updatedBy'] = JSON.parse(localStorage.getItem('userId'));
        try
        {
            this._userService.tradingDataUpdateCommon(updateData).pipe(first()).subscribe((res) =>
            {
                this.vesselDropdownView = false;
                this.vesselNameView = true;
                this.fetchVesselData();
                this.alertService.success('Vessel Updated Successfully', 'Success');
            }, err => {  });
        } catch (err)
        {  }
    }
    // Change Vessel End


    // Show Charterer Change Modal Start
    showChartererChangeModal(): void
    {
        this.chartererModal = !this.chartererModal;
    }
    // Show Charterer Change Modal End

    // Hide Charterer Change Modal Start
    hideChartererChangeModal(): void
    {
        this.chartererModal = !this.chartererModal;
        this.chartererDropDownForm = this._formBuilder.group(
        {
            chartererId: ['', Validators.required]
        });
    }
    // Hide Charterer Change Modal End

    // Change Charterer Start
    changeCharterer()
    {
        this.chartererModal = !this.chartererModal;
        this.chartererId = this.tempChartererId;
        for(let index = 0; index < this.chartererRecordsServerSideResponseData.length; index++)
        {
            if(this.chartererId == this.chartererRecordsServerSideResponseData[index].id)
            {
                this.chartererName = this.chartererRecordsServerSideResponseData[index].username;
                this.chartererEmail = this.chartererRecordsServerSideResponseData[index].email;
            }
        }
        var updateData = {};
            updateData['ownerId'] = JSON.parse(localStorage.getItem('userId'));
            updateData['chartererId'] = this.chartererId;
            updateData['brokerId'] = this.brokerId;
            updateData['tradingId'] = this.tradingId;
            updateData['chartererEmail'] = this.chartererEmail;
            updateData['chartererName'] = this.chartererName;
            updateData['notification'] = 'You are invited for trade';
            updateData['createdBy'] = JSON.parse(localStorage.getItem('userId'));
            updateData['updatedBy'] = JSON.parse(localStorage.getItem('userId'));
        try
        {
            this._userService.chartererInviteOwnerForTrade(updateData).pipe(first()).subscribe((res) =>
            {
                this.chartererDropdownView = false;
                this.chartererNameView = true;
                this.alertService.success('Charterer Updated Successfully', 'Success');
            }, err => {  });
        } catch (err)
        {  }
    }
    // Change Charterer End

    // OLD CODES START

    ChartereRecords(): void
    {
        var filter = {};
            filter['companyId'] = JSON.parse(localStorage.getItem('companyId'));
            filter['userRoleId'] = '4';
        try
        {
            this._userService.userRecordsServerSide(filter).pipe(first()).subscribe((res) =>
            {
                this.chartererDataResponse = res;
                if (this.chartererDataResponse.success === true)
                {
                    this.chartererDataResponseArray = this.chartererDataResponse.data;

                    var checkedCheckBoxArray = this.chartererDataResponseArray;
                    this.chartererDataResponseArray = [];
                    for (let index = 0; index < checkedCheckBoxArray.length; index++)
                    {
                        if(this.chartererId != checkedCheckBoxArray[index].id)
                        {
                            this.chartererDataResponseArray.push(checkedCheckBoxArray[index]);
                        }
                    }

                }
            }, err => {  });
        } catch (err)
        {  }
    }

    updateCharterer(event)
    {
        this.chartererId = event.target.value;

        for (let index = 0; index < this.chartererDataResponseArray.length; index++)
        {
            if(this.chartererId == this.chartererDataResponseArray[index].id)
            {
                this.chartererEmailID = this.chartererDataResponseArray[index].email;
            }
        }

        if(this.isTrading == '2')
        {
            
            var updateData = {};
                updateData['drawId'] = this.drawId;
                updateData['chartererId'] = this.chartererId;
            try
            {
                this._userService.drawDataUpdateCommon(updateData).pipe(first()).subscribe((res) =>
                {

                }, err => {  });
            } catch (err)
            { }

            var updateData = {};
                updateData['fromUserId'] = localStorage.getItem('userId');
                updateData['toUserId'] = this.chartererId;
                updateData['emailID'] = this.chartererEmailID;
                updateData['notification'] = 'Yout are invited for draw cp';
                updateData['createdBy'] = localStorage.getItem('userId');
                updateData['updatedBy'] = localStorage.getItem('userId');
            try
            {
                this._userService.sendNotificationToCharterer(updateData).pipe(first()).subscribe((res) =>
                {
                    this.alertService.success('Invitation Has Been Sent To Charterer', 'Success');
                    this.ChartereRecords();
                    this.isChartererAccepted = 'P';

                }, err => {  });
            } catch (err)
            {  }
            
        } else {

            var updateData = {};
                updateData['tradingId'] = this.tradingId;
                updateData['chartererId'] = this.chartererId;
            try
            {
                this._userService.drawDataUpdateCommon(updateData).pipe(first()).subscribe((res) =>
                {

                }, err => {  });
            } catch (err)
            {  }

            var updateData = {};
                updateData['fromUserId'] = localStorage.getItem('userId');
                updateData['toUserId'] = this.chartererId;
                updateData['emailID'] = this.chartererEmailID;
                updateData['notification'] = 'Yout are invited for draw cp';
                updateData['createdBy'] = localStorage.getItem('userId');
                updateData['updatedBy'] = localStorage.getItem('userId');
            try
            {
                this._userService.sendNotificationToCharterer(updateData).pipe(first()).subscribe((res) =>
                {
                    this.alertService.success('Invitation Has Been Sent To Charterer', 'Success');
                    this.ChartereRecords();
                    this.isChartererAccepted = 'P';

                }, err => {  });
            } catch (err)
            {  }

        }
    }
    

    timePickerTimeTest(event)
    {
        
        
        var slides = document.getElementsByClassName('testimepicker');
        
        var updatedStringValuesArray = [];
        if(slides.length > 0)
        {
            for(var i = 0; i < slides.length; i++)
            {  
                var valueOfUpdatedSting = slides[i];
                
                
                updatedStringValuesArray.push(valueOfUpdatedSting['value']);
            }
        }
        
    }
  
    // Preamble Screen Data
    fetchDrawDataRecap()
    {
        var filterCondition = {};
            filterCondition["dcm.id"] = this.drawId;
        try
        {
            this._userService.fetchDrawData(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.drawResponseInformation = res;
                if(this.drawResponseInformation.success == true)
                {
                    this.drawResponseInformationData = this.drawResponseInformation.data[0];

                    this.isChartererAccepted = this.drawResponseInformation.data[0].isChartererAccepted;

                    this.chartererId = this.drawResponseInformation.data[0].chartererId;

                    if(this.isChartererAccepted == 'N')
                    {
                        this.ChartereRecords();
                    }

                    this.ownerDropdownView = false;
                    this.ownerNameView = true;

                    this.vesselDropdownView = false;
                    this.vesselNameView = true;

                    this.ownerName = this.drawResponseInformation.data[0].ownerName;
                    // this.vesselName = this.drawResponseInformation.data[0].vesselName;

                    this.drawResponseInformationData['cpCity'] = (this.drawResponseInformationData['cpCity'] == null && this.drawResponseInformationData['cpCity'] == '') ? '' : this.drawResponseInformationData['cpCity'];

                    var cpTime = this.drawResponseInformationData['cpTime'];
                    var cpDate = this.drawResponseInformationData['cpDate'];
                    var cpCity = this.drawResponseInformationData['cpCity'];
                    var cityName = this.drawResponseInformationData['cityName'];

                    var current_date = (cpDate != '') ? cpDate : moment(new Date()).format("YYYY-MM-DD");
                    var current_time = (cpTime != '') ? cpTime : moment().format("HH:mm A");
                    var cityID = (cpCity != '') ? cpCity : '0';

                    

                    this.clauseForm = this._formBuilder.group
                    (
                        {
                            cpTime: [current_time, Validators.required],
                            cityId: [cityID, Validators.required],
                            cpDate: [current_date, Validators.required],
                        }
                    );

                    this.cpDate = current_date;

                    this.checkedClauseCategoryRecap = [];

                    var checked_clauses = this.drawResponseInformation.data[0].checked_clauses;
                    if(checked_clauses != '' && checked_clauses != null)
                    {
                        this.checkedClauseCategoryRecap = checked_clauses.split(',');
                    } else {
                        this.checkedClauseCategoryRecap = [];
                    }

                    var checkedCheckBoxArray = this.checkedClauseCategoryRecap;
                    this.checkedClauseCategoryRecap = [];
                    for (let index = 0; index < checkedCheckBoxArray.length; index++)
                    {
                        this.checkedClauseCategoryRecap.push(Number(checkedCheckBoxArray[index]));
                    }

                    var checkedCheckBoxArray = this.checkedClauseCategoryRecap;
                    this.checkedClauseCategoryRecap = [];
                    for (let index = 0; index < checkedCheckBoxArray.length; index++)
                    {
                        if(this.checkedClauseCategoryRecap.indexOf(checkedCheckBoxArray[index]) < 0)
                        {
                            this.checkedClauseCategoryRecap.push(Number(checkedCheckBoxArray[index]));
                        }
                    }

                    var checkedCheckBoxArray = this.checkedClauseCategoryRecap;
                    this.checkedClauseCategoryRecap = [];
                    for (let index = 0; index < checkedCheckBoxArray.length; index++)
                    {
                        if(this.checkedClauseCategoryRecap.indexOf(checkedCheckBoxArray[index]) < 0)
                        {
                            this.checkedClauseCategoryRecap.push(Number(checkedCheckBoxArray[index]));
                        }
                    }

                    localStorage.setItem('checkedClauseCategoryRecap', JSON.stringify(this.checkedClauseCategoryRecap));

                    this.ownerName = this.drawResponseInformation.data[0].ownerName;
                    this.chartererName = this.drawResponseInformation.data[0].chartererName;
                    this.brokerName = this.drawResponseInformation.data[0].brokerName;

                    var cpTime = this.drawResponseInformationData['cpTime'];
                    var cpDate = this.drawResponseInformationData['cpDate'];
                    var cityName = this.drawResponseInformationData['cityName'];

                    current_date = (cpDate != '') ? moment(cpDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
                    var current_time = (cpTime != '') ? cpTime : moment().format("HH:mm A");
                    var cityID = (cityName != '') ? cityName : '0';

                    this.cpDate = current_date;

                    this.cityName = cityName;
                    this.cpDate = current_date;
                    this.cpTime = cpTime;

                    this.ownerName = this.drawResponseInformation.data[0].ownerName;
                    this.chartererName = this.drawResponseInformation.data[0].chartererName;
                    this.brokerName = this.drawResponseInformation.data[0].brokerName;

                    this.vesselId = this.drawResponseInformation.data[0].vesselId;

                    this.dateMonthYearString = this.dateMonthYearFormatFunction(this.cpDate);

                    this.metricTonValue = this.drawResponseInformation.data[0].metricTonValue;
                    this.customInput1 = this.drawResponseInformation.data[0].customInput1;
                    this.customInput2 = this.drawResponseInformation.data[0].customInput2;

                    this.currentSignature1 = this.drawResponseInformation.data[0].signature1;
                    this.currentSignature2 = this.drawResponseInformation.data[0].signature2;

                    var signature1 = this.currentSignature1;
                    if(signature1 != '' && signature1 != null)
                    {
                        this.signature1ImageView = true;
                    } else {
                        this.signature1DemoView = true;
                    }

                    var signature2 = this.currentSignature2;
                    if(signature2 != '' && signature2 != null)
                    {
                        this.signature2ImageView = true;
                    } else {
                        this.signature2DemoView = true;
                    }

                    this.fetchVesselData();

                    // this.clauseCategoryRecordsServerSide();
                    // this.clauseCategoryRecordsServerSideRecap();
                }
            });
        }catch (err){}
    }

    

    clickMeFunction()
    {
        
    }

    dateMonthYearFormatFunction(date)
    {
        var dateInfo = moment(date).format("Do");
        

        var monthInfo = moment(date).format("MMM");
        

        var yearInfo = moment(date).format("YYYY");
        

        var string = 'this '+dateInfo+' of '+ monthInfo+','+yearInfo;
        

        return string;
    }

    // Custom Input Draw Data Update
    customInputDrawDataUpdate()
    {
        const req =
        {
            drawId : this.drawId,
            metricTonValue: this.metricTonValue,
            customInput1: this.customInput1,
            customInput2: this.customInput2
        };
        
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/customInputDrawDataUpdate`, req, headerOptions).subscribe( res =>
        {
            
        });
    }

    // Custom Input Trading Data Update
    customInputTradingDataUpdate()
    {
        const req =
        {
            tradingId : this.tradingId,
            metricTonValue: this.metricTonValue,
            customInput1: this.customInput1,
            customInput2: this.customInput2
        };
        
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/customInputTradingDataUpdate`, req, headerOptions).subscribe( res =>
        {
            
        });
    }

     

    // Fetch Draw Data
    fetchDrawData()
    {
        var filterCondition = {};
            filterCondition["dcm.id"] = this.drawId;
        try
        {
            this._userService.fetchDrawData(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.drawResponseInformation = res;
                if(this.drawResponseInformation.success == true)
                {
                    this.drawResponseInformationData = this.drawResponseInformation.data[0];

                    this.drawResponseInformationData['cpCity'] = (this.drawResponseInformationData['cpCity'] == null && this.drawResponseInformationData['cpCity'] == '') ? '' : this.drawResponseInformationData['cpCity'];

                    var cpTime = this.drawResponseInformationData['cpTime'];
                    var cpDate = this.drawResponseInformationData['cpDate'];
                    var cpCity = this.drawResponseInformationData['cpCity'];
                    var cityName = this.drawResponseInformationData['cityName'];

                    var current_date = (cpDate != '') ? cpDate : moment(new Date()).format("YYYY-MM-DD")
                    var current_time = (cpTime != '') ? cpTime : moment().format("HH:mm A");
                    var cityID = (cpCity != '') ? cpCity : '0';

                    

                    this.clauseForm = this._formBuilder.group
                    (
                        {
                            cpTime: [current_time, Validators.required],
                            cityId: [cityID, Validators.required],
                            cpDate: [current_date, Validators.required],
                        }
                    );

                    this.cpDate = current_date;

                    this.checkedClauseCategory = [];

                    var checked_clauses = this.drawResponseInformation.data[0].checked_clauses;

                    

                    if(checked_clauses != '' && checked_clauses != null)
                    {
                        this.checkedClauseCategory = checked_clauses.split(',');
                    } else {
                        this.checkedClauseCategory = [];
                    }

                    var checkedCheckBoxArray = this.checkedClauseCategory;
                    this.checkedClauseCategory = [];
                    for (let index = 0; index < checkedCheckBoxArray.length; index++)
                    {
                        this.checkedClauseCategory.push(Number(checkedCheckBoxArray[index]));
                    }

                    

                    localStorage.setItem('checkedClauseCategory', JSON.stringify(this.checkedClauseCategory));

                    this.ownerName = this.drawResponseInformation.data[0].ownerName;
                    this.chartererName = this.drawResponseInformation.data[0].chartererName;
                    this.brokerName = this.drawResponseInformation.data[0].brokerName;

                    this.clauseCategoryRecordsServerSide();

                    var cpTime = this.drawResponseInformationData['cpTime'];
                    var cpDate = this.drawResponseInformationData['cpDate'];
                    var cityName = this.drawResponseInformationData['cityName'];

                    current_date = (cpDate != '') ? moment(cpDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
                    var current_time = (cpTime != '') ? cpTime : moment().format("HH:mm A");
                    var cityID = (cityName != '') ? cityName : '0';

                    this.cpDate = current_date;

                    this.cityName = cityName;
                    this.cpDate = current_date;
                    this.cpTime = cpTime;

                    this.ownerName = this.drawResponseInformation.data[0].ownerName;
                    this.chartererName = this.drawResponseInformation.data[0].chartererName;
                    this.brokerName = this.drawResponseInformation.data[0].brokerName;

                    this.vesselId = this.drawResponseInformation.data[0].vesselId;

                    this.fetchVesselData();
                    
                }
            });
        }catch (err){}
    }

    // Fetch Trading Data
    fetchTradingDataRecap()
    {
        var filterCondition = {};
            filterCondition["dcm.id"] = this.tradingId;
        try
        {
            this._userService.fetchTradingData(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.tradingRecordsServerSideResponse = res;
                if(this.tradingRecordsServerSideResponse.success == true)
                {
                    this.tradingRecordsServerSideResponseData = this.tradingRecordsServerSideResponse.data[0];

                    this.tradingRecordsServerSideResponseData['cpCity'] = (this.tradingRecordsServerSideResponseData['cpCity'] == null && this.tradingRecordsServerSideResponseData['cpCity'] == '') ? '' : this.tradingRecordsServerSideResponseData['cpCity'];

                    var cpTime = this.tradingRecordsServerSideResponseData['cpTime'];
                    var cpDate = this.tradingRecordsServerSideResponseData['cpDate'];
                    var cpCity = this.tradingRecordsServerSideResponseData['cpCity'];
                    var cityName = this.tradingRecordsServerSideResponseData['cityName'];

                    var current_date = (cpDate != '') ? cpDate : moment(new Date()).format("YYYY-MM-DD")
                    var current_time = (cpTime != '') ? cpTime : moment().format("HH:mm A");
                    var cityID = (cpCity != '') ? cpCity : '0';

                    

                    this.clauseForm = this._formBuilder.group
                    (
                        {
                            cpTime: [current_time, Validators.required],
                            cityId: [cityID, Validators.required],
                            cpDate: [current_date, Validators.required],
                        }
                    );

                    this.cpDate = current_date;

                    this.checkedClauseCategoryRecap = [];

                    var checked_clauses = this.tradingRecordsServerSideResponse.data[0].checked_clauses;
                    if(checked_clauses != '' && checked_clauses != null)
                    {
                        this.checkedClauseCategoryRecap = checked_clauses.split(',');
                    } else {
                        this.checkedClauseCategoryRecap = [];
                    }

                    var checkedCheckBoxArray = this.checkedClauseCategoryRecap;
                    this.checkedClauseCategoryRecap = [];
                    for (let index = 0; index < checkedCheckBoxArray.length; index++)
                    {
                        this.checkedClauseCategoryRecap.push(Number(checkedCheckBoxArray[index]));
                    }

                    var checkedCheckBoxArray = this.checkedClauseCategoryRecap;
                    this.checkedClauseCategoryRecap = [];
                    for (let index = 0; index < checkedCheckBoxArray.length; index++)
                    {
                        if(this.checkedClauseCategoryRecap.indexOf(checkedCheckBoxArray[index]) < 0)
                        {
                            this.checkedClauseCategoryRecap.push(Number(checkedCheckBoxArray[index]));
                        }
                    }

                    var checkedCheckBoxArray = this.checkedClauseCategoryRecap;
                    this.checkedClauseCategoryRecap = [];
                    for (let index = 0; index < checkedCheckBoxArray.length; index++)
                    {
                        if(this.checkedClauseCategoryRecap.indexOf(checkedCheckBoxArray[index]) < 0)
                        {
                            this.checkedClauseCategoryRecap.push(Number(checkedCheckBoxArray[index]));
                        }
                    }

                    localStorage.setItem('checkedClauseCategoryRecap', JSON.stringify(this.checkedClauseCategoryRecap));

                    this.ownerName = this.tradingRecordsServerSideResponse.data[0].ownerName;
                    this.chartererName = this.tradingRecordsServerSideResponse.data[0].chartererName;
                    this.brokerName = this.tradingRecordsServerSideResponse.data[0].brokerName;

                    var cpTime = this.tradingRecordsServerSideResponseData['cpTime'];
                    var cpDate = this.tradingRecordsServerSideResponseData['cpDate'];
                    var cityName = this.tradingRecordsServerSideResponseData['cityName'];

                    current_date = (cpDate != '') ? moment(cpDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
                    var current_time = (cpTime != '') ? cpTime : moment().format("HH:mm A");
                    var cityID = (cityName != '') ? cityName : '0';

                    this.cpDate = current_date;

                    this.cityName = cityName;
                    this.cpDate = current_date;
                    this.cpTime = cpTime;

                    this.ownerName = this.tradingRecordsServerSideResponse.data[0].ownerName;
                    this.chartererName = this.tradingRecordsServerSideResponse.data[0].chartererName;
                    this.brokerName = this.tradingRecordsServerSideResponse.data[0].brokerName;

                    this.vesselId = this.tradingRecordsServerSideResponse.data[0].vesselId;

                    this.dateMonthYearString = this.dateMonthYearFormatFunction(this.cpDate);

                    this.metricTonValue = this.tradingRecordsServerSideResponse.data[0].metricTonValue;
                    this.customInput1 = this.tradingRecordsServerSideResponse.data[0].customInput1;
                    this.customInput2 = this.tradingRecordsServerSideResponse.data[0].customInput2;

                    this.currentSignature1 = this.tradingRecordsServerSideResponse.data[0].signature1;
                    this.currentSignature2 = this.tradingRecordsServerSideResponse.data[0].signature2;

                    var signature1 = this.currentSignature1;
                    if(signature1 != '' && signature1 != null)
                    {
                        this.signature1ImageView = true;
                    } else {
                        this.signature1DemoView = true;
                    }

                    var signature2 = this.currentSignature2;
                    if(signature2 != '' && signature2 != null)
                    {
                        this.signature2ImageView = true;
                    } else {
                        this.signature2DemoView = true;
                    }

                    
                    
                    

                    this.stdBidForm = this._formBuilder.group
                    (
                        {
                            cpTimeStdBid: [this.cpTime, Validators.required],
                            cityIdStdBid: [this.tradingRecordsServerSideResponse.data[0].cpCity, Validators.required],
                            cpDateStdBid: [this.cpDate, Validators.required],
                            fixture_subject: [this.tradingRecordsServerSideResponse.data[0].fixture_subject, ''],
                            lifted_by: [this.tradingRecordsServerSideResponse.data[0].lifted_by, ''],
                            lifted_time: [this.tradingRecordsServerSideResponse.data[0].lifted_time, ''],
                            lifted_date: [this.tradingRecordsServerSideResponse.data[0].lifted_date, ''],
                            lifted_city: [this.tradingRecordsServerSideResponse.data[0].lifted_city, ''],
                            lifted_charter_party_place: [this.tradingRecordsServerSideResponse.data[0].lifted_charter_party_place, ''],
                            lifted_charter_fully_style: [this.tradingRecordsServerSideResponse.data[0].lifted_charter_fully_style, ''],
                            lifted_charter_domicile: [this.tradingRecordsServerSideResponse.data[0].lifted_charter_domicile, ''],
                            lifted_owner_fully_style: [this.tradingRecordsServerSideResponse.data[0].lifted_owner_fully_style, ''],
                            lifted_owner_domicile: [this.tradingRecordsServerSideResponse.data[0].lifted_owner_domicile, ''],
                            lifted_owner_type: [this.tradingRecordsServerSideResponse.data[0].lifted_owner_type, ''],
                            lifted_vessel_name: [this.tradingRecordsServerSideResponse.data[0].lifted_vessel_name, ''],
                            lifted_vessel_imo: [this.tradingRecordsServerSideResponse.data[0].lifted_vessel_imo, ''],
                            lifted_vessel_flag: [this.tradingRecordsServerSideResponse.data[0].lifted_vessel_flag, ''],
                            lifted_vessel_year_built: [this.tradingRecordsServerSideResponse.data[0].lifted_vessel_year_built, ''],
                            lifted_vessel_dwat_metric_tons : [this.tradingRecordsServerSideResponse.data[0].lifted_vessel_dwat_metric_tons, ''],
                            lifted_vessel_draft_on_marks : [this.tradingRecordsServerSideResponse.data[0].lifted_vessel_draft_on_marks, ''],
                            lifted_vessel_loa : [this.tradingRecordsServerSideResponse.data[0].lifted_vessel_loa, ''],
                            lifted_vessel_beam : [this.tradingRecordsServerSideResponse.data[0].lifted_vessel_beam, ''],
                            lifted_vessel_holds : [this.tradingRecordsServerSideResponse.data[0].lifted_vessel_holds, ''],
                            lifted_vessel_hatches : [this.tradingRecordsServerSideResponse.data[0].lifted_vessel_hatches, ''],
                            lifted_vessel_gear : [this.tradingRecordsServerSideResponse.data[0].lifted_vessel_gear, ''],
                            lifted_vessel_swl : [this.tradingRecordsServerSideResponse.data[0].lifted_vessel_swl, ''],
                        }
                    );

                    this.fixture_subject= this.tradingRecordsServerSideResponse.data[0].fixture_subject;
                    this.lifted_by= this.tradingRecordsServerSideResponse.data[0].lifted_by;
                    this.lifted_time= this.tradingRecordsServerSideResponse.data[0].lifted_time;
                    this.lifted_date= this.tradingRecordsServerSideResponse.data[0].lifted_date;
                    this.lifted_city= this.tradingRecordsServerSideResponse.data[0].lifted_city;
                    this.lifted_charter_party_place= this.tradingRecordsServerSideResponse.data[0].lifted_charter_party_place;
                    this.lifted_charter_fully_style= this.tradingRecordsServerSideResponse.data[0].lifted_charter_fully_style;
                    this.lifted_charter_domicile= this.tradingRecordsServerSideResponse.data[0].lifted_charter_domicile;
                    this.lifted_owner_fully_style= this.tradingRecordsServerSideResponse.data[0].lifted_owner_fully_style;
                    this.lifted_owner_domicile= this.tradingRecordsServerSideResponse.data[0].lifted_owner_domicile;
                    this.lifted_owner_type= this.tradingRecordsServerSideResponse.data[0].lifted_owner_type;
                    this.lifted_vessel_name= this.tradingRecordsServerSideResponse.data[0].lifted_vessel_name;
                    this.lifted_vessel_imo= this.tradingRecordsServerSideResponse.data[0].lifted_vessel_imo;
                    this.lifted_vessel_flag= this.tradingRecordsServerSideResponse.data[0].lifted_vessel_flag;
                    this.lifted_vessel_year_built= this.tradingRecordsServerSideResponse.data[0].lifted_vessel_year_built;
                    this.lifted_vessel_dwat_metric_tons = this.tradingRecordsServerSideResponse.data[0].lifted_vessel_dwat_metric_tons;
                    this.lifted_vessel_draft_on_marks = this.tradingRecordsServerSideResponse.data[0].lifted_vessel_draft_on_marks;
                    this.lifted_vessel_loa = this.tradingRecordsServerSideResponse.data[0].lifted_vessel_loa;
                    this.lifted_vessel_beam = this.tradingRecordsServerSideResponse.data[0].lifted_vessel_beam;
                    this.lifted_vessel_holds = this.tradingRecordsServerSideResponse.data[0].lifted_vessel_holds;
                    this.lifted_vessel_hatches = this.tradingRecordsServerSideResponse.data[0].lifted_vessel_hatches;
                    this.lifted_vessel_gear = this.tradingRecordsServerSideResponse.data[0].lifted_vessel_gear;
                    this.lifted_vessel_swl = this.tradingRecordsServerSideResponse.data[0].lifted_vessel_swl;

                    this.lifted_date = moment(this.lifted_date).format("YYYY-MM-DD");

                    this.fetchVesselData();

                    this.clauseCategoryRecordsServerSideRecap();
                }
            });
        }catch (err){}
    }
    
    // Clause Category Records Server Side
    clauseCategoryRecordsServerSideRecap()
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));

        var filterCondition = {};
            filterCondition['cpFormId'] = filter.formId;
            filterCondition['checkedClauseCategory'] = this.checkedClauseCategoryRecap;
        
            
        try
        {
            this._userService.clauseCategoryRecordsServerSide(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.clauseCategoryRecordResponse = res;
                if(this.clauseCategoryRecordResponse.success == true)
                {
                    this.clauseCategoryRecordResponseData = this.clauseCategoryRecordResponse.data;
                    this.checkedClauseCategoryRecap = [];
                    for (let index = 0; index < this.clauseCategoryRecordResponseData.length; index++)
                    {
                        this.checkedClauseCategoryRecap.push(Number(this.clauseCategoryRecordResponseData[index].id));
                    }
                    
                    this.termsReviewRecordsRecap();
                }
            });
        }catch (err){}
    }

   

    // First Screen View
    firstScreenView()
    {
        if(this.isTrading == '1')
        {
            this.stdBidForm = this._formBuilder.group
            (
                {
                    cpTimeStdBid: [this.cpTime, Validators.required],
                    cityIdStdBid: [this.cityId, Validators.required],
                    cpDateStdBid: [this.cpDate, Validators.required],
                    fixture_subject: [this.fixture_subject, ''],
                    lifted_by: [this.lifted_by, ''],
                    lifted_time: [this.lifted_time, ''],
                    lifted_date: [this.lifted_date, ''],
                    lifted_city: [this.lifted_city, ''],
                    lifted_charter_party_place: [this.lifted_charter_party_place, ''],
                    lifted_charter_fully_style: [this.lifted_charter_fully_style, ''],
                    lifted_charter_domicile: [this.lifted_charter_domicile, ''],
                    lifted_owner_fully_style: [this.lifted_owner_fully_style, ''],
                    lifted_owner_domicile: [this.lifted_owner_domicile, ''],
                    lifted_owner_type: [this.lifted_owner_type, ''],
                    lifted_vessel_name: [this.lifted_vessel_name, ''],
                    lifted_vessel_imo: [this.lifted_vessel_imo, ''],
                    lifted_vessel_flag: [this.lifted_vessel_flag, ''],
                    lifted_vessel_year_built: [this.lifted_vessel_year_built, ''],
                    lifted_vessel_dwat_metric_tons : [this.lifted_vessel_dwat_metric_tons, ''],
                    lifted_vessel_draft_on_marks : [this.lifted_vessel_draft_on_marks, ''],
                    lifted_vessel_loa : [this.lifted_vessel_loa, ''],
                    lifted_vessel_beam : [this.lifted_vessel_beam, ''],
                    lifted_vessel_holds : [this.lifted_vessel_holds, ''],
                    lifted_vessel_hatches : [this.lifted_vessel_hatches, ''],
                    lifted_vessel_gear : [this.lifted_vessel_gear, ''],
                    lifted_vessel_swl : [this.lifted_vessel_swl, ''],
                }
            );

            if(this.is_owner_detail_term_sign_off == '1' && this.is_charterer_detail_term_sign_off == '1')
            {
                this.firstScreenStdBidBroker = true;
            } else {
                this.firstScreen = true;    
            }
            
        } else {
            this.firstScreen = true;
        }
        this.secondScreen = false;
        this.thirdScreen = false;
    }

    // Second Screen View
    secondScreenView()
    {
        this.firstScreen = false;
        this.firstScreenStdBid = false;
        this.firstScreenStdBidBroker = false;
        this.secondScreen = true;
        this.thirdScreen = false;
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        this.isTrading = filter.isTrading;

        if(filter.isTrading == '2')
        {
            this.customInputDrawDataUpdate();
            this.fetchDrawData();    
        } else {
            // this.customInputTradingDataUpdate();
            // this.fetchTradingData();
            this.stdBidSubmit();
        }
    }

    stdBidSubmit()
    {
        this.submitted = true;
        this.alertService.clear();
        if (this.stdBidForm.invalid)
        { 
            return;
        } else {

            var convertedDate = moment(this.fStdBidSubmit.cpDateStdBid.value).format("YYYY-MM-DD");

            this.cpTime = this.fStdBidSubmit.cpTimeStdBid.value;
            this.cpDate = convertedDate;
            this.cityId = this.fStdBidSubmit.cityIdStdBid.value;
            
            this.fixture_subject = this.fStdBidSubmit.fixture_subject.value;
            this.lifted_by = this.fStdBidSubmit.lifted_by.value;


            this.lifted_time = this.fStdBidSubmit.lifted_time.value;
            this.lifted_date = this.fStdBidSubmit.lifted_date.value;
            this.lifted_city = this.fStdBidSubmit.lifted_city.value;
            this.lifted_charter_party_place = this.fStdBidSubmit.lifted_charter_party_place.value;
            this.lifted_charter_fully_style = this.fStdBidSubmit.lifted_charter_fully_style.value;
            this.lifted_charter_domicile = this.fStdBidSubmit.lifted_charter_domicile.value;
            this.lifted_owner_fully_style = this.fStdBidSubmit.lifted_owner_fully_style.value;
            this.lifted_owner_domicile = this.fStdBidSubmit.lifted_owner_domicile.value;
            this.lifted_owner_type = this.fStdBidSubmit.lifted_owner_type.value;
            this.lifted_vessel_name = this.fStdBidSubmit.lifted_vessel_name.value;
            this.lifted_vessel_imo = this.fStdBidSubmit.lifted_vessel_imo.value;
            this.lifted_vessel_flag = this.fStdBidSubmit.lifted_vessel_flag.value;
            this.lifted_vessel_year_built = this.fStdBidSubmit.lifted_vessel_year_built.value;
            this.lifted_vessel_dwat_metric_tons = this.fStdBidSubmit.lifted_vessel_dwat_metric_tons.value;
            this.lifted_vessel_draft_on_marks = this.fStdBidSubmit.lifted_vessel_draft_on_marks.value;
            this.lifted_vessel_loa = this.fStdBidSubmit.lifted_vessel_loa.value;
            this.lifted_vessel_beam = this.fStdBidSubmit.lifted_vessel_beam.value;
            this.lifted_vessel_holds = this.fStdBidSubmit.lifted_vessel_holds.value;
            this.lifted_vessel_hatches = this.fStdBidSubmit.lifted_vessel_hatches.value;
            this.lifted_vessel_gear = this.fStdBidSubmit.lifted_vessel_gear.value;
            this.lifted_vessel_swl = this.fStdBidSubmit.lifted_vessel_swl.value;
            
            const req =
            {
                tradingId : this.tradingId,
                
                cpTime:this.cpTime,
                cpDate:this.cpDate,
                cpCity:this.cityId,

                metricTonValue:this.metricTonValue,
                customInput1:this.customInput1,
                customInput2:this.customInput2,

                fixture_subject:this.fixture_subject,
                lifted_by:this.lifted_by,
                lifted_time:this.lifted_time,
                lifted_date:this.lifted_date,
                lifted_city:this.lifted_city,
                lifted_charter_party_place:this.lifted_charter_party_place,
                lifted_charter_fully_style:this.lifted_charter_fully_style,
                lifted_charter_domicile:this.lifted_charter_domicile,
                lifted_owner_fully_style:this.lifted_owner_fully_style,
                lifted_owner_domicile:this.lifted_owner_domicile,
                lifted_owner_type:this.lifted_owner_type,
                lifted_vessel_name:this.lifted_vessel_name,
                lifted_vessel_imo:this.lifted_vessel_imo,
                lifted_vessel_flag:this.lifted_vessel_flag,
                lifted_vessel_year_built:this.lifted_vessel_year_built,
                lifted_vessel_dwat_metric_tons:this.lifted_vessel_dwat_metric_tons,
                lifted_vessel_draft_on_marks:this.lifted_vessel_draft_on_marks,
                lifted_vessel_loa:this.lifted_vessel_loa,
                lifted_vessel_beam:this.lifted_vessel_beam,
                lifted_vessel_holds:this.lifted_vessel_holds,
                lifted_vessel_hatches:this.lifted_vessel_hatches,
                lifted_vessel_gear:this.lifted_vessel_gear,
                lifted_vessel_swl:this.lifted_vessel_swl,

                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                
                companyId: localStorage.getItem('companyId'),

            };
            
            this.loading = true;
            try
            {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/StandardBidFormDataUpdate`, req, headerOptions).subscribe(res =>{},err =>{this.alertService.error(err, 'Error');});
            } catch (err){} 
        }
    }

    // Third Screen View
    thirdScreenView()
    {
        if(this.isTrading == '2')
        {
            var checkedClauseCategory = this.checkedClauseCategory.join();
            const req =
            {
                drawId: this.drawId,
                checked_clauses: checkedClauseCategory,
                updatedBy: localStorage.getItem('userId')
            };
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/updateCheckedClauses`, req, headerOptions).subscribe( res =>
            {
                this.firstScreen = false;
                this.firstScreenStdBid = false;
                this.firstScreenStdBidBroker = false;
                this.secondScreen = false;
                this.thirdScreen = true;
                this.termsReviewRecords();
            });
        } else {
            this.firstScreen = false;
            this.firstScreenStdBid = false;
            this.firstScreenStdBidBroker = false;
            this.secondScreen = false;
            this.thirdScreen = true;
            // 
            // this.thirdScreenView();
            // this.fetchDrawData();
            // this.fetchTradingData();

            var checkedClauseCategory = this.checkedClauseCategory.join();
            const req =
            {
                tradingId: this.tradingId,
                checked_clauses: checkedClauseCategory,
                updatedBy: localStorage.getItem('userId')
            };
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/updateCheckedClausesTrading`, req, headerOptions).subscribe( res =>
            {
                this.firstScreen = false;
                this.firstScreenStdBid = false;
                this.firstScreenStdBidBroker = false;
                this.secondScreen = false;
                this.thirdScreen = true;
                this.termsReviewRecords();
            });

        }
        
    }

    checkAllFunctionChecked()
    {
        var checkedCheckBoxArray = this.checkedCheckBox;
        for (let index = 0; index < this.termsReviewRecordsData.length; index++)
        {
            var startLength = 0;
            var endLength = 0;
            for (let subIndex = 0; subIndex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; subIndex++)
            {
                startLength = startLength + 1;
                if(checkedCheckBoxArray.indexOf(this.termsReviewRecordsData[index].clauseCategoryTerms[subIndex].id) >= 0)
                {
                    endLength = endLength + 1;
                }
            }
            this.termsReviewRecordsData[index].isallChecked =  'N';
            if (startLength == endLength )
            {
                this.termsReviewRecordsData[index].isallChecked =  'Y';
            }
        }

        var checkedCheckBoxArray = this.checkedCheckBoxCustom;
        for (let index = 0; index < this.termsReviewRecordsData.length; index++)
        {
            var startLength = 0;
            var endLength = 0;
            for (let subIndex = 0; subIndex < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; subIndex++)
            {
                startLength = startLength + 1;
                if(checkedCheckBoxArray.indexOf(this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[subIndex].id) >= 0)
                {
                    endLength = endLength + 1;
                }
            }
            this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.isAllCustomTermsChecked =  'N';
            if (startLength == endLength )
            {
                this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.isAllCustomTermsChecked =  'Y';
            }
        }

        var checkedCheckBoxArray = this.checkedCheckBoxCustomClauseTerms;
        for (let index = 0; index < this.customClauseDataResponseData.length; index++)
        {
            var startLength = 0;
            var endLength = 0;
            for (let subIndex = 0; subIndex < this.customClauseDataResponseData[index].clauseCategoryTerms.length; subIndex++)
            {
                startLength = startLength + 1;
                if(checkedCheckBoxArray.indexOf(this.customClauseDataResponseData[index].clauseCategoryTerms[subIndex].id) >= 0)
                {
                    endLength = endLength + 1;
                }
            }
            this.customClauseDataResponseData[index].isAllCustomTermsOfCustomClauseChecked =  'N';
            if (startLength == endLength )
            {
                this.customClauseDataResponseData[index].isAllCustomTermsOfCustomClauseChecked =  'Y';
            }
        }
    }

    

    // Check / Uncheck All Of Clause Terms Of Clause Category
    checkUncheckAllForClauseTerms(ev,clauseCategoryID)
    {
        var checkedCheckBoxArray = this.checkedCheckBox;
        ev.checked = (ev.checked == true) ? 'Y' : 'N';
        this.clauseTermsCheckBox = ev.checked;
        this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTerms.forEach(item => item.isChecked = ev.checked);
        for (let index = 0; index < this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTerms.length; index++)
        {
            if (ev.checked == 'Y')
            {
                if(checkedCheckBoxArray.indexOf(this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTerms[index].id) < 0)
                {
                    this.checkedCheckBox.push(Number(this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTerms[index].id));
                }
            } else {
                var checkedCheckBoxArray = this.checkedCheckBox;
                this.checkedCheckBox = [];
                for (let subIndex = 0; subIndex < checkedCheckBoxArray.length; subIndex++)
                {
                    if(checkedCheckBoxArray[subIndex] != this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTerms[index].id)
                    {
                        this.checkedCheckBox.push(Number(checkedCheckBoxArray[subIndex]));
                    }
                }
            }
        }
    }

    // Check / Uncheck All Of Clause Terms Of Clause Category Second Screen
    checkUncheckAllForClauseTermsSecondScreen(ev)
    {
        var checkedCheckBoxArray = this.checkedClauseCategory;
        ev.checked = (ev.checked == true) ? 'Y' : 'N';
        this.clauseCategoryRecordResponseData.forEach(item => item.isChecked = ev.checked);
        for (let index = 0; index < this.clauseCategoryRecordResponseData.length; index++)
        {
            if (ev.checked == 'Y')
            {
                if(checkedCheckBoxArray.indexOf(this.clauseCategoryRecordResponseData[index].id) < 0)
                {
                    this.checkedClauseCategory.push(Number(this.clauseCategoryRecordResponseData[index].id));
                }
            }
        }
        if(ev.checked == 'N')
        {
            var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
            var isTrading = filter.isTrading;
            if(isTrading == '2')
            {
                this.fetchDrawData();
            } else {
                this.fetchTradingData();
            }
            
        }
    }

    // Check / Uncheck Clause Category
    checkUncheckClauseCategory(ev,clauseCategoryID)
    {
        var checkedCheckBoxArray = this.checkedClauseCategory;
        this.checkedClauseCategory = [];
        for (let index = 0; index < checkedCheckBoxArray.length; index++)
        {
            if(this.checkedClauseCategory.indexOf(checkedCheckBoxArray[index]) < 0)
            {
                this.checkedClauseCategory.push(Number(checkedCheckBoxArray[index]));
            }
        }

        

        if(ev.checked == true)
        {
            this.checkedClauseCategory.push(Number(clauseCategoryID));
        } else {
            var checkedCheckBoxArray = this.checkedClauseCategory;
            this.checkedClauseCategory = [];
            for (let index = 0; index < checkedCheckBoxArray.length; index++)
            {
                if(checkedCheckBoxArray[index] != clauseCategoryID)
                {
                    this.checkedClauseCategory.push(Number(checkedCheckBoxArray[index]));
                }
            }
        }

        this.thirdScreenButton = false;
        if(this.checkedClauseCategory.length > 0)
        {
            this.thirdScreenButton = true;
        }

        

        var checkedCheckBoxArray = this.checkedClauseCategory;
        var startLength = 0;
        var endLength = 0;
        for (let index = 0; index < this.clauseCategoryRecordResponseData.length; index++)
        {
            startLength = startLength + 1;
            if(checkedCheckBoxArray.indexOf(this.clauseCategoryRecordResponseData[index].id) >= 0)
            {
                endLength = endLength + 1;
            }
        }
        this.clauseCategoryRecordResponseDataAllChecked =  'N';
        if (startLength == endLength )
        {
            this.clauseCategoryRecordResponseDataAllChecked =  'Y';
        }
    }

    // Check / Uncheck Single Of Clause Terms Of Clause Category
    onChange(event,clauseTermsID)
    {
        if(event.checked == true)
        {
            this.checkedCheckBox.push(clauseTermsID);
        } else {
            var checkedCheckBoxArray = this.checkedCheckBox;
            this.checkedCheckBox = [];
            for (let index = 0; index < checkedCheckBoxArray.length; index++)
            {
                if(checkedCheckBoxArray[index] != clauseTermsID)
                {
                    this.checkedCheckBox.push(Number(checkedCheckBoxArray[index]));
                }
            }
        }
        var checkedCheckBoxArray = this.checkedCheckBox;
        for (let index = 0; index < this.termsReviewRecordsData.length; index++)
        {
            var startLength = 0;
            var endLength = 0;
            for (let subIndex = 0; subIndex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; subIndex++)
            {
                startLength = startLength + 1;
                if(checkedCheckBoxArray.indexOf(this.termsReviewRecordsData[index].clauseCategoryTerms[subIndex].id) >= 0)
                {
                    endLength = endLength + 1;
                }
            }
            this.termsReviewRecordsData[index].isallChecked =  'N';
            if (startLength == endLength )
            {
                this.termsReviewRecordsData[index].isallChecked =  'Y';
            }
        }
    }

    // Check / Uncheck All Of Custom Clause Terms Of Clause Category
    checkUncheckAllForCustomClauseTermsOfClauseCategory(ev,clauseCategoryID)
    {
        var checkedCheckBoxArray = this.checkedCheckBoxCustom;
            ev.checked = (ev.checked == true) ? 'Y' : 'N';
        this.clauseTermsCheckBox = ev.checked;
        this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTermsUpdateCustom.forEach(item => item.isChecked = ev.checked);
        for (let index = 0; index < this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTermsUpdateCustom.length; index++)
        {
            if (ev.checked == 'Y')
            {
                if(checkedCheckBoxArray.indexOf(this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTermsUpdateCustom[index].id) < 0)
                {
                    this.checkedCheckBoxCustom.push(Number(this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTermsUpdateCustom[index].id));
                }
            } else {
                var checkedCheckBoxArray = this.checkedCheckBoxCustom;
                this.checkedCheckBoxCustom = [];
                for (let subIndex = 0; subIndex < checkedCheckBoxArray.length; subIndex++)
                {
                    if(checkedCheckBoxArray[subIndex] != this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTermsUpdateCustom[index].id)
                    {
                        this.checkedCheckBoxCustom.push(Number(checkedCheckBoxArray[subIndex]));
                    }
                }
            }
        }
    }

    // Check / Uncheck Single Of Custom Clause Terms Of Clause Category
    onChangeCustom(event,clauseTermsID)
    {
        var checkedCheckBoxArray = this.checkedCheckBoxCustom;
        if(event.checked == true)
        {
            this.checkedCheckBoxCustom.push(clauseTermsID);
        } else {
            this.checkedCheckBoxCustom = [];
            for (let index = 0; index < checkedCheckBoxArray.length; index++)
            {
                if(checkedCheckBoxArray[index] != clauseTermsID)
                {
                    this.checkedCheckBoxCustom.push(Number(checkedCheckBoxArray[index]));
                }
            }
        }

        var checkedCheckBoxArray = this.checkedCheckBoxCustom;
        for (let index = 0; index < this.termsReviewRecordsData.length; index++)
        {
            var startLength = 0;
            var endLength = 0;
            for (let subIndex = 0; subIndex < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; subIndex++)
            {
                startLength = startLength + 1;
                if(checkedCheckBoxArray.indexOf(this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[subIndex].id) >= 0)
                {
                    endLength = endLength + 1;
                }
            }
            this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.isAllCustomTermsChecked =  'N';
            if (startLength == endLength )
            {
                this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.isAllCustomTermsChecked =  'Y';
            }
        }
    }

    // Check / Uncheck All Of Custom Clause Terms Of Custom Clause Category
    checkUncheckAllForCustomClauseTermsOfCustomClause(ev,clauseCategoryID)
    {
        var checkedCheckBoxArray = this.checkedCheckBoxCustomClauseTerms;
        ev.checked = (ev.checked == true) ? 'Y' : 'N';
        this.customClauseDataResponseData[clauseCategoryID].clauseCategoryTerms.forEach(item => item.isChecked = ev.checked);
        for (let index = 0; index < this.customClauseDataResponseData[clauseCategoryID].clauseCategoryTerms.length; index++)
        {
            if (ev.checked == 'Y')
            {
                if(checkedCheckBoxArray.indexOf(this.customClauseDataResponseData[clauseCategoryID].clauseCategoryTerms[index].id) < 0)
                {
                    this.checkedCheckBoxCustomClauseTerms.push(Number(this.customClauseDataResponseData[clauseCategoryID].clauseCategoryTerms[index].id));
                }
            } else {
                var checkedCheckBoxArray = this.checkedCheckBoxCustomClauseTerms;
                this.checkedCheckBoxCustomClauseTerms = [];
                for (let subIndex = 0; subIndex < checkedCheckBoxArray.length; subIndex++)
                {
                    if(checkedCheckBoxArray[subIndex] != this.customClauseDataResponseData[clauseCategoryID].clauseCategoryTerms[index].id)
                    {
                        this.checkedCheckBoxCustomClauseTerms.push(Number(checkedCheckBoxArray[subIndex]));
                    }
                }
            }
        }
    }

    // Check / Uncheck Single Of Custom Clause Terms Of Custom Clause Category
    onChangeCustomClauseTerms(event,clauseTermsID,clauseCategoryID)
    {
        var checkedCheckBoxArray = this.checkedCheckBoxCustomClauseTerms;
        if(event.checked == true)
        {
            this.checkedCheckBoxCustomClauseTerms.push(clauseTermsID);
        } else {
            this.checkedCheckBoxCustomClauseTerms = [];
            for (let index = 0; index < checkedCheckBoxArray.length; index++)
            {
                if(checkedCheckBoxArray[index] != clauseTermsID)
                {
                    this.checkedCheckBoxCustomClauseTerms.push(Number(checkedCheckBoxArray[index]));
                }
            }
        }
     
        var checkedCheckBoxArray = this.checkedCheckBoxCustomClauseTerms;
        for (let index = 0; index < this.customClauseDataResponseData.length; index++)
        {
            var startLength = 0;
            var endLength = 0;
            for (let subIndex = 0; subIndex < this.customClauseDataResponseData[index].clauseCategoryTerms.length; subIndex++)
            {
                startLength = startLength + 1;
                if(checkedCheckBoxArray.indexOf(this.customClauseDataResponseData[index].clauseCategoryTerms[subIndex].id) >= 0)
                {
                    endLength = endLength + 1;
                }
            }
            this.customClauseDataResponseData[index].isAllCustomTermsOfCustomClauseChecked =  'N';
            if (startLength == endLength )
            {
                this.customClauseDataResponseData[index].isAllCustomTermsOfCustomClauseChecked =  'Y';
            }
        }
    }

    
    convertNumber(num)
    {
        var s = num+"";
        while (s.length < 6) s = "0" + s;
        return s;
    }
    
    // Set Page Title With Counter Number
    getCounterNumber() : void
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        var tradingId = filter.tradingId;
        var counterCondition = {};
        counterCondition["tradingId"] = tradingId;
        counterCondition["userId"] = JSON.parse(localStorage.getItem('userId'));
        try
        {
            this._userService.getCounterNumber(counterCondition).pipe(first()).subscribe((res) =>
            {
                this.counterResponse = res;
                
                this.pageTitle = 'Charterer '+this.NumInWords(this.counterResponse.data.counterNumber)+' Counter';

                if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
                {
                    this.counterNumberInfo = this.NumInWords(this.counterResponse.data.counterNumber);

                    if( this.counterNumberInfo == 'First' )
                    {
                        this.pageTitle = 'Charterer Bid';
                    } else {
                        this.pageTitle = 'Charterer '+this.NumInWords(this.counterResponse.data.counterNumber)+' Counter';
                    }    
                    
                }
        
                if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
                {
                    this.counterNumberInfo = this.NumInWords(this.counterResponse.data.counterNumber);

                    if( this.counterNumberInfo == 'First' )
                    {
                        this.pageTitle = 'Owner Offer';
                    } else {
                        this.pageTitle = 'Owner '+this.NumInWords(this.counterResponse.data.counterNumber)+' Counter';
                    }
                    
                    // this.pageTitle = 'Owner '+this.NumInWords(this.counterResponse.data.counterNumber)+' Counter';
                }
            });
        } catch (err) { }
    }

    // Convert Number To Word
    NumInWords (number) : void
    {
        const first = ['','First ','Second ','Third ','Fourth ', 'Fifth ','Sixth ','Seventh ','Eight ','Nineth ','Tenth ','Eleventh ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
        const tens = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
        const mad = ['', 'thousand', 'million', 'billion', 'trillion'];
        let word = '';
      
        for (let i = 0; i < mad.length; i++) {
          let tempNumber = number%(100*Math.pow(1000,i));
          if (Math.floor(tempNumber/Math.pow(1000,i)) !== 0) {
            if (Math.floor(tempNumber/Math.pow(1000,i)) < 20) {
              word = first[Math.floor(tempNumber/Math.pow(1000,i))] + mad[i] + ' ' + word;
            } else {
              word = tens[Math.floor(tempNumber/(10*Math.pow(1000,i)))] + '-' + first[Math.floor(tempNumber/Math.pow(1000,i))%10] + mad[i] + ' ' + word;
            }
          }
      
          tempNumber = number%(Math.pow(1000,i+1));
          if (Math.floor(tempNumber/(100*Math.pow(1000,i))) !== 0) word = first[Math.floor(tempNumber/(100*Math.pow(1000,i)))] + 'hunderd ' + word;
        
          this.convertedWord = word;
        }
        return this.convertedWord;
    }

    

    // Main Array
    termsReviewRecordsRecap(): void
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        
        var drawId = filter.drawId;
        var tradingId = filter.tradingId;
        var formID = filter.formId;
        var chartererId = filter.chartererId;
        var companyId = filter.companyId;
        var isTrading = filter.isTrading;

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
            clauseCategoryFilterCondition["commonClauses"] = [];
            clauseCategoryFilterCondition["commonClausesCustomArray"] = [];
            clauseCategoryFilterCondition["checked_clauses"] = this.checkedClauseCategoryRecap;
            
            try {
                this._userService.mainClauseScreenDataRecords(clauseCategoryFilterCondition).pipe(first()).subscribe((res) => {
                    this.termsReviewRecordsResponseRecap = res;
                    if (this.termsReviewRecordsResponseRecap.success === true) {
						this.termsReviewRecordsDataRecap = this.termsReviewRecordsResponseRecap.data;
						
						for (let index = 0; index < this.termsReviewRecordsDataRecap.length; index++)
						{
							for (let sindex = 0; sindex < this.termsReviewRecordsDataRecap[index].clauseCategoryTerms.length; sindex++)
							{
								this.termsReviewRecordsDataRecap[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
							}
							for (let sindex = 0; sindex < this.termsReviewRecordsDataRecap[index].clauseCategoryTermsUpdateCustom.length; sindex++)
							{
								this.termsReviewRecordsDataRecap[index].clauseCategoryTermsUpdateCustom[sindex]['identifier'] = String.fromCharCode(97 + sindex);
							}
                        }
                        
                        this.customClauseDataRecords();

						
                    }
                },
                    err => {
                        this.alertService.error(err, 'Error');
                    });
            } catch (err) { }
            this.drawProgressUpadte();
        } else {
            var clauseCategoryFilterCondition = {};
            clauseCategoryFilterCondition["cpFormId"] = this.formId;
            clauseCategoryFilterCondition["tradingId"] = this.tradingId;
            clauseCategoryFilterCondition["companyId"] = this.companyId;
            clauseCategoryFilterCondition["commonClauses"] = [];
            clauseCategoryFilterCondition["commonClausesCustomArray"] = [];
            clauseCategoryFilterCondition["checked_clauses"] = this.checkedClauseCategoryRecap;
            try {
                this._userService.mainClauseScreenDataRecordsTrading(clauseCategoryFilterCondition).pipe(first()).subscribe((res) => {
                    this.termsReviewRecordsResponseRecap = res;
                    if (this.termsReviewRecordsResponseRecap.success === true) {
                        this.termsReviewRecordsDataRecap = this.termsReviewRecordsResponseRecap.data;
                        
                        for (let index = 0; index < this.termsReviewRecordsDataRecap.length; index++)
						{
							for (let sindex = 0; sindex < this.termsReviewRecordsDataRecap[index].clauseCategoryTerms.length; sindex++)
							{
								this.termsReviewRecordsDataRecap[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
							}
							for (let sindex = 0; sindex < this.termsReviewRecordsDataRecap[index].clauseCategoryTermsUpdateCustom.length; sindex++)
							{
								this.termsReviewRecordsDataRecap[index].clauseCategoryTermsUpdateCustom[sindex]['identifier'] = String.fromCharCode(97 + sindex);
							}
						}
                        this.customClauseDataRecords();
                    }
                },
                    err => {
                        this.alertService.error(err, 'Error');
                    });
            } catch (err) { }
        }
    }

    dynamicDatePickerChange()
    {
        this.dynamicStringUpdateArray = [];
        var slides = document.getElementsByClassName("dynamicInputValueForAll");
        for(var i = 0; i < slides.length; i++)
        {  
            var valueInfo = slides[i];
            this.dynamicStringUpdateArray.push(valueInfo['value']);
        }
        
    }

      // Main Data Record Fetch Start
      termsReviewRecords(): void
      {
          this.commonClausesArray = [];
          localStorage.setItem('commonClausesArray', JSON.stringify(this.commonClausesArray));
  
          this.commonClausesCustomArray = [];
          localStorage.setItem('commonClausesCustomArray', JSON.stringify(this.commonClausesCustomArray));
  
          this.commonClausesCustomClauseTermArray = [];
          localStorage.setItem('commonClausesCustomClauseTermArray', JSON.stringify(this.commonClausesCustomClauseTermArray));
  
          if (this.isTrading == '2')
          {
              var drawCondition = {};
                  drawCondition["dcm.id"] = this.drawId;
  
              try
              {
                  this._userService.drawRecordsServerSide(drawCondition).pipe(first()).subscribe((res) =>
                  {
                      this.drawResponse = res;
                      if (this.drawResponse.success === true)
                      {
  
                          var cpDate = this.drawResponse.data[0].cpDate;
                          var cpTime = this.drawResponse.data[0].cpTime;
                          var cpCity = this.drawResponse.data[0].cpCity;
  
                          var current_date = (cpDate != '' && cpDate != null) ? cpDate : moment(new Date()).format("YYYY-MM-DD")
                          var current_time = (cpTime != '' && cpTime != null) ? cpTime : moment(new Date()).format("HH:mm A");
                          var cityID = (cpCity != '' && cpCity != null) ? cpCity : '0';
  
                          this.clauseForm = this._formBuilder.group
                          (
                              {
                                  cpTime: [current_time, Validators.required],
                                  cityId: [cityID, Validators.required],
                                  cpDate: [current_date, Validators.required],
                              }
                          );
  
  
                          var commonClauses = this.drawResponse.data[0].common_clauses;
                          
                          if(commonClauses != '' && commonClauses != null)
                          {
                              this.commonClausesArray = commonClauses.split(',');
                          } else {
                              this.commonClausesArray = [];
                          }
  
                          localStorage.setItem('commonClausesArray', JSON.stringify(this.commonClausesArray));
                          var commonClausesArray = JSON.parse(localStorage.getItem('commonClausesArray'));
  
                          var custom_term_clause = this.drawResponse.data[0].custom_term_clause;
                          
                          if(custom_term_clause != '' && custom_term_clause != null)
                          {
                              this.commonClausesCustomArray = custom_term_clause.split(',');
                          } else {
                              this.commonClausesCustomArray = [];
                          }
                          
                          localStorage.setItem('commonClausesCustomArray', JSON.stringify(this.commonClausesCustomArray));
                          var commonClausesCustomArray = JSON.parse(localStorage.getItem('commonClausesCustomArray'));
  
                          var custom_common_clause = this.drawResponse.data[0].custom_common_clause;
                          
                          if(custom_common_clause != '' && custom_common_clause != null)
                          {
                              this.commonClausesCustomClauseTermArray = custom_common_clause.split(',');
                          } else {
                              this.commonClausesCustomClauseTermArray = [];
                          }
                          
                          localStorage.setItem('commonClausesCustomClauseTermArray', JSON.stringify(this.commonClausesCustomClauseTermArray));
                          var commonClausesCustomClauseTermArray = JSON.parse(localStorage.getItem('commonClausesCustomClauseTermArray'));
  
                          this.checkedClauseCategory = [];
  
                          var checked_clauses = this.drawResponse.data[0].checked_clauses;
                          
                          if(checked_clauses != '' && checked_clauses != null)
                          {
                              this.checkedClauseCategory = checked_clauses.split(',');
                          } else {
                              this.checkedClauseCategory = [];
                          }
  
                          localStorage.setItem('checkedClauseCategory', JSON.stringify(this.checkedClauseCategory));
  
                          var checkedCheckBoxArray = this.commonClausesArray;
                          this.checkedCheckBox = [];
                          for (let subIndex = 0; subIndex < checkedCheckBoxArray.length; subIndex++)
                          {
                              this.checkedCheckBox.push(Number(checkedCheckBoxArray[subIndex]));
                          }
  
                          var customArray1 = this.commonClausesCustomArray;
                          this.checkedCheckBoxCustom = [];
                          for (let subIndex = 0; subIndex < customArray1.length; subIndex++)
                          {
                              this.checkedCheckBoxCustom.push(Number(customArray1[subIndex]));
                          }
  
                          var customArray2 = this.commonClausesCustomClauseTermArray;
                          this.checkedCheckBoxCustomClauseTerms = [];
                          for (let subIndex = 0; subIndex < customArray2.length; subIndex++)
                          {
                              this.checkedCheckBoxCustomClauseTerms.push(Number(customArray2[subIndex]));
                          }
  
                          var customArray3 = this.checkedClauseCategory;
                          this.checkedClauseCategory = [];
                          for (let subIndex = 0; subIndex < customArray3.length; subIndex++)
                          {
                              this.checkedClauseCategory.push(Number(customArray3[subIndex]));
                          }
  
                          
                          
                          var customArray4 = this.checkedClauseCategory;
                          var startLength = 0;
                          var endLength = 0;
                          for (let index = 0; index < this.clauseCategoryRecordResponseData.length; index++)
                          {
                              startLength = startLength + 1;
                              if(customArray4.indexOf(this.clauseCategoryRecordResponseData[index].id) >= 0)
                              {
                                  endLength = endLength + 1;
                              }
                          }
  
                          this.clauseCategoryRecordResponseDataAllChecked =  'N';
                          if (startLength == endLength )
                          {
                              this.clauseCategoryRecordResponseDataAllChecked =  'Y';
                          }
  
                          this.termsReviewRecordsData = [];
  
                          var clauseCategoryFilterCondition = {};
                              clauseCategoryFilterCondition["cpFormId"] = this.formId;
                              clauseCategoryFilterCondition["drawId"] = this.drawId;
                              clauseCategoryFilterCondition["companyId"] = this.companyId;
                              clauseCategoryFilterCondition["commonClauses"] = commonClausesArray;
                              clauseCategoryFilterCondition["commonClausesCustomArray"] = commonClausesCustomArray;
                              clauseCategoryFilterCondition["checked_clauses"] = this.checkedClauseCategory;
  
                              this.termsReviewRecordsData = [];
                          try
                          {
                              this._userService.mainClauseScreenDataRecords(clauseCategoryFilterCondition).pipe(first()).subscribe((res) =>
                              {
                                  this.termsReviewRecordsResponse = res;
                                  if (this.termsReviewRecordsResponse.success === true)
                                  {
                                      this.mainDynamicStringArray = [];
  
                                      this.termsReviewRecordsData = this.termsReviewRecordsResponse.data;
  
                                      var totalCount = 0;

                                      
                                      for (let index = 0; index < this.termsReviewRecordsData.length; index++)
                                      {
                                        
                                          totalCount = totalCount + 1;
                                          for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++)
                                          {
                                            var number =   sindex + 1;
                                            var timeStamp = 'dynamicInputValueForAll'+Date.now()+number;
  
                                              var mainString = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainTermRecord'];
  
                                              if(mainString != '' && mainString != null && mainString != undefined)
                                              {
                                                  mainString = mainString.replace(/<[^>]*>/g, '');
                                                  
                                                  this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainTermRecordArray'] = 
                                                  this.createStringWithDynamicDateTimeNumberPicker(mainString,timeStamp);
                                              } else {
                                                  this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainTermRecordArray'] = '';
                                              }
  
                                              this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainString'] = mainString;
                                              this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['timeStamp'] = timeStamp;
                                              
                                              this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                                          }
                                          
                                          for (let sindexCustom = 0; sindexCustom < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; sindexCustom++)
                                          {
                                            var number =   sindexCustom + 1;
                                            var timeStamp = 'dynamicInputValueForAll'+Date.now()+number;
  
                                              var mainString = this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainTermRecordCustom'];
  
                                              if(mainString != '' && mainString != null && mainString != undefined)
                                              {
                                                  mainString = mainString.replace(/<[^>]*>/g, '');
                                                  this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainTermRecordCustomArray'] = 
                                                  this.createStringWithDynamicDateTimeNumberPicker(mainString,timeStamp);
                                              } else {
                                                  this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainTermRecordCustomArray'] = '';
                                              }
  
                                              this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainString'] = mainString;
                                              this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['timeStamp'] = timeStamp;
  
                                              this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['identifier'] = String.fromCharCode(97 + sindexCustom);
                                          }
                                      }
  
                                      
  
                                      this.totalTermsReviewRecords = totalCount;
                                      this.customClauseDataRecords();
                                  }
                              },
                              err =>
                              {
                                  this.alertService.error(err, 'Error');
                              });
                          } catch (err) {}
                      }
                  });
              } catch (err) { }
  
          } else {
              
              var drawCondition = {};    
                  drawCondition["id"] = this.tradingId;
              try
              {
                  this._userService.TradingData(drawCondition).pipe(first()).subscribe((res) =>
                  {
                      this.tradingResponse = res;
                      if (this.tradingResponse.success === true)
                      {
                          var cpDate = this.tradingResponse.data[0].cpDate;
                          var cpTime = this.tradingResponse.data[0].cpTime;
                          var cpCity = this.tradingResponse.data[0].cpCity;
  
                          var current_date = (cpDate != '' && cpDate != null) ? cpDate : moment(new Date()).format("YYYY-MM-DD")
                          var current_time = (cpTime != '' && cpTime != null) ? cpTime : moment(new Date()).format("HH:mm A");
                          var cityID = (cpCity != '' && cpCity != null) ? cpCity : '0';
                          
                          this.clauseForm = this._formBuilder.group
                          (
                              {
                                  cpTime: [current_time, Validators.required],
                                  cityId: [cityID, Validators.required],
                                  cpDate: [current_date, Validators.required],
                              }
                          );
  
                          
                          var commonClauses = this.tradingResponse.data[0].common_clauses;
                      
                          if(commonClauses != '' && commonClauses != null)
                          {
                              this.commonClausesArray = commonClauses.split(',');
                          } else {
                              this.commonClausesArray = [];
                          }
  
                          localStorage.setItem('commonClausesArray', JSON.stringify(this.commonClausesArray));
                          var commonClausesArray = JSON.parse(localStorage.getItem('commonClausesArray'));
  
                          var custom_term_clause = this.tradingResponse.data[0].custom_term_clause;
                          
                          if(custom_term_clause != '' && custom_term_clause != null)
                          {
                              this.commonClausesCustomArray = custom_term_clause.split(',');
                          } else {
                              this.commonClausesCustomArray = [];
                          }
                          
                          localStorage.setItem('commonClausesCustomArray', JSON.stringify(this.commonClausesCustomArray));
                          var commonClausesCustomArray = JSON.parse(localStorage.getItem('commonClausesCustomArray'));
  
                          var custom_common_clause = this.tradingResponse.data[0].custom_common_clause;
                          
                          if(custom_common_clause != '' && custom_common_clause != null)
                          {
                              this.commonClausesCustomClauseTermArray = custom_common_clause.split(',');
                          } else {
                              this.commonClausesCustomClauseTermArray = [];
                          }
                          
                          localStorage.setItem('commonClausesCustomClauseTermArray', JSON.stringify(this.commonClausesCustomClauseTermArray));
                          var commonClausesCustomClauseTermArray = JSON.parse(localStorage.getItem('commonClausesCustomClauseTermArray'));
  
                          var checkedCheckBoxArray = this.commonClausesArray;
                          this.checkedCheckBox = [];
                          for (let subIndex = 0; subIndex < checkedCheckBoxArray.length; subIndex++)
                          {
                              this.checkedCheckBox.push(Number(checkedCheckBoxArray[subIndex]));
                          }
  
                          var commonClauseCustomArray = this.commonClausesCustomArray;
                          this.checkedCheckBoxCustom = [];
                          for (let subIndex = 0; subIndex < commonClauseCustomArray.length; subIndex++)
                          {
                              this.checkedCheckBoxCustom.push(Number(commonClauseCustomArray[subIndex]));
                          }
  
                          var checkboxCustomArrayTerm = this.commonClausesCustomClauseTermArray;
                          this.checkedCheckBoxCustomClauseTerms = [];
                          for (let subIndex = 0; subIndex < checkboxCustomArrayTerm.length; subIndex++)
                          {
                              this.checkedCheckBoxCustomClauseTerms.push(Number(checkboxCustomArrayTerm[subIndex]));
                          }
  
                            clauseCustomChecked = [];
                            clauseCustomTermsChecked = [];

                            var clauseChecked = this.tradingResponse.data[0].common_clauses;
                            if(clauseChecked != '' && clauseChecked != null)
                            {
                                this.clauseChecked = clauseChecked.split(',');
                            } else {
                                this.clauseChecked = [];
                            }

                            var clauseCustomChecked = this.tradingResponse.data[0].custom_term_clause;
                            if(clauseCustomChecked != '' && clauseCustomChecked != null)
                            {
                                this.clauseCustomChecked = clauseCustomChecked.split(',');
                            } else {
                                this.clauseCustomChecked = [];
                            }
                            
                            var clauseCustomTermsChecked = this.tradingResponse.data[0].custom_common_clause;
                            if(clauseCustomTermsChecked != '' && clauseCustomTermsChecked != null)
                            {
                                this.clauseCustomTermsChecked = clauseCustomTermsChecked.split(',');
                            } else {
                                this.clauseCustomTermsChecked = [];
                            }

                            // Assing Charterer Checked Clauses Start

                            var chartererCheckedClauses = this.tradingResponse.data[0].charterer_clauses;
                            if(chartererCheckedClauses != '' && chartererCheckedClauses != null)
                            {
                                this.chartererCheckedClauses = chartererCheckedClauses.split(',');
                            } else {
                                this.chartererCheckedClauses = [];
                            }

                            var chartererCheckedCustomClauses = this.tradingResponse.data[0].charterer_custom_clauses;
                            if(chartererCheckedCustomClauses != '' && chartererCheckedCustomClauses != null)
                            {
                                this.chartererCheckedCustomClauses = chartererCheckedCustomClauses.split(',');
                            } else {
                                this.chartererCheckedCustomClauses = [];
                            }

                            var chartererCheckedCustomTermsClauses = this.tradingResponse.data[0].charterer_custom_terms_clauses;
                            if(chartererCheckedCustomTermsClauses != '' && chartererCheckedCustomTermsClauses != null)
                            {
                                this.chartererCheckedCustomTermsClauses = chartererCheckedCustomTermsClauses.split(',');
                            } else {
                                this.chartererCheckedCustomTermsClauses = [];
                            }

                            // Assing Charterer Checked Clauses End

                            // Assing Owner Checked Clauses Start

                            var ownerCheckedClauses = this.tradingResponse.data[0].owner_clauses;
                            if(ownerCheckedClauses != '' && ownerCheckedClauses != null)
                            {
                                this.ownerCheckedClauses = ownerCheckedClauses.split(',');
                            } else {
                                this.ownerCheckedClauses = [];
                            }

                            var ownerCheckedCustomClauses = this.tradingResponse.data[0].owner_custom_clauses;
                            if(ownerCheckedCustomClauses != '' && ownerCheckedCustomClauses != null)
                            {
                                this.ownerCheckedCustomClauses = ownerCheckedCustomClauses.split(',');
                            } else {
                                this.ownerCheckedCustomClauses = [];
                            }

                            var ownerCheckedCustomTermsClauses = this.tradingResponse.data[0].owner_custom_terms_clauses;
                            if(ownerCheckedCustomTermsClauses != '' && ownerCheckedCustomTermsClauses != null)
                            {
                                this.ownerCheckedCustomTermsClauses = ownerCheckedCustomTermsClauses.split(',');
                            } else {
                                this.ownerCheckedCustomTermsClauses = [];
                            }

                            // Assing Owner Checked Clauses End

                            var mainTermCheckedClauses = this.tradingResponse.data[0].main_term_clauses;
                            if(mainTermCheckedClauses != '' && mainTermCheckedClauses != null)
                            {
                                this.mainTermCheckedClauses = mainTermCheckedClauses.split(',');
                            } else {
                                this.mainTermCheckedClauses = [];
                            }

                            var mainTermCheckedClausesCustom = this.tradingResponse.data[0].main_term_checked_clauses_custom;
                            if(mainTermCheckedClausesCustom != '' && mainTermCheckedClausesCustom != null)
                            {
                                this.mainTermCheckedClausesCustom = mainTermCheckedClausesCustom.split(',');
                            } else {
                                this.mainTermCheckedClausesCustom = [];
                            }

                            var mainTermCheckedClausesCustomTerms = this.tradingResponse.data[0].main_term_checked_clauses_custom_term;
                            if(mainTermCheckedClausesCustomTerms != '' && mainTermCheckedClausesCustomTerms != null)
                            {
                                this.mainTermCheckedClausesCustomTerms = mainTermCheckedClausesCustomTerms.split(',');
                            } else {
                                this.mainTermCheckedClausesCustomTerms = [];
                            }
  
                          this.termsReviewRecordsData = [];
              
                          var clauseCategoryFilterCondition = {};
                              clauseCategoryFilterCondition["cpFormId"] = this.formId;
                              clauseCategoryFilterCondition["tradingId"] = this.tradingId;
                              clauseCategoryFilterCondition["companyId"] = this.companyId;
                              clauseCategoryFilterCondition["commonClauses"] = commonClausesArray;
                              clauseCategoryFilterCondition["commonClausesCustomArray"] = commonClausesCustomArray;
                              clauseCategoryFilterCondition["checked_clauses"] = this.checkedClauseCategory;
                              clauseCategoryFilterCondition["mainTermCheckedClauses"] = this.mainTermCheckedClauses;
                              clauseCategoryFilterCondition["mainTermCheckedClausesCustom"] = this.mainTermCheckedClausesCustom;
                              clauseCategoryFilterCondition["mainTermCheckedClausesCustomTerms"] = this.mainTermCheckedClausesCustomTerms;
  
                          try
                          {
                              this._userService.mainClauseScreenDataRecordsTrading(clauseCategoryFilterCondition).pipe(first()).subscribe((res) =>
                              {
                                  this.termsReviewRecordsResponse = res;
                                  if (this.termsReviewRecordsResponse.success === true)
                                  {
                                      this.termsReviewRecordsData = this.termsReviewRecordsResponse.data;
                                      var totalCount = 0;
                                      for (let index = 0; index < this.termsReviewRecordsData.length; index++)
                                      {
                                          totalCount = totalCount + 1;
                                          for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++)
                                          {
                                                var number =   sindex + 1;
                                                var timeStamp = 'dynamicInputValueForAll'+Date.now()+number;
    
                                                var mainString = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainTermRecord'];
    
                                                if(mainString != '' && mainString != null && mainString != undefined)
                                                {
                                                    mainString = mainString.replace(/<[^>]*>/g, '');
                                                    
                                                    this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainTermRecordArray'] = 
                                                    this.createStringWithDynamicDateTimeNumberPicker(mainString,timeStamp);
                                                } else {
                                                    this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainTermRecordArray'] = '';
                                                }
    
                                                this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainString'] = mainString;
                                                this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['timeStamp'] = timeStamp;
                                              this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                                          }
                                          for (let sindexCustom = 0; sindexCustom < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; sindexCustom++)
                                          {
                                            var number =   sindexCustom + 1;
                                            var timeStamp = 'dynamicInputValueForAll'+Date.now()+number;
  
                                              var mainString = this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainTermRecordCustom'];
  
                                              if(mainString != '' && mainString != null && mainString != undefined)
                                              {
                                                  mainString = mainString.replace(/<[^>]*>/g, '');
                                                  this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainTermRecordCustomArray'] = 
                                                  this.createStringWithDynamicDateTimeNumberPicker(mainString,timeStamp);
                                              } else {
                                                  this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainTermRecordCustomArray'] = '';
                                              }
  
                                              this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainString'] = mainString;
                                              this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['timeStamp'] = timeStamp;
  
                                              this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['identifier'] = String.fromCharCode(97 + sindexCustom);
                                          }
                                      }
                                      this.totalTermsReviewRecords = totalCount;
                                      this.customClauseDataRecords();
                                  }
                              },
                              err =>
                              {
                                  this.alertService.error(err, 'Error');
                              });
                          } catch (err) {}
                      }
                  });
              } catch (err) {}
          }
      }

      customClauseDataRecords() : void
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        var drawId = filter.drawId;
        var tradingId = filter.tradingId;

        var commonClausesCustomClauseTermArray = localStorage.getItem('commonClausesCustomClauseTermArray');
        
        var drawCondition = {};
            drawCondition["drawId"] = drawId;
            drawCondition["tradingId"] = tradingId;
            drawCondition["commonClauses"] = commonClausesCustomClauseTermArray;
        
        try
        {
            this._userService.customClauseRecords(drawCondition).pipe(first()).subscribe((res) =>
            {
                this.customClauseDataResponse = res;
                if (this.customClauseDataResponse.success === true)
                {       
                    this.customClauseDataResponseData = this.customClauseDataResponse.data;
                    var newCount = this.termsReviewRecordsData.length;
                        newCount = newCount + 1;
                    for (let index = 0; index < this.customClauseDataResponseData.length; index++)
                    {
                        this.customClauseDataResponseData[index]['numberInfo'] = newCount;
                        newCount = newCount + 1;
                        for (let sindex = 0; sindex < this.customClauseDataResponseData[index].clauseCategoryTerms.length; sindex++)
                        {
                            var number =   sindex + 1;
                            var timeStamp = 'dynamicInputValueForAll'+Date.now()+number;

                            var mainString = this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['mainTermRecord'];

                            if(mainString != '' && mainString != null && mainString != undefined)
                            {
                                mainString = mainString.replace(/<[^>]*>/g, '');
                                this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['mainTermRecordCustomArray'] = 
                                this.createStringWithDynamicDateTimeNumberPicker(mainString,timeStamp);
                            } else {
                                this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['mainTermRecordCustomArray'] = '';
                            }

                            this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['mainString'] = mainString;
                            this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['timeStamp'] = timeStamp;

                            this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                        }
                        for (let sindex = 0; sindex < this.customClauseDataResponseData[index].clauseCategoryTermsUpdateCustom.length; sindex++)
                        {
                            this.customClauseDataResponseData[index].clauseCategoryTermsUpdateCustom[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                        }
                    }
                    
                    

                    this.checkAllFunctionChecked();

                }
            })
        } catch (err) { }
    }

  

    updateDynamicString(className,type)
    {
       
        
        
        

        var mainDataArrayOfString = this.mainDynamicStringArray;

        var valueInfo = '';
        var timeStampInfo = '';
        var mainString = '';

        for(var i = 0; i < mainDataArrayOfString.length; i++)
        {
            valueInfo = mainDataArrayOfString[i];
            timeStampInfo = valueInfo['timeStamp'];
            if(timeStampInfo == className)
            {
                mainString = valueInfo['mainString'];
                // return false;
            }
        }

        var updatedStringValuesArray = [];

        var slides = document.getElementsByClassName(className);
        
        var finalString = mainString

        if(slides.length > 0)
        {
            var mainString = finalString;
            finalString = '';
            
            for(var i = 0; i < slides.length; i++)
            {  
                var valueOfUpdatedSting = slides[i];
                updatedStringValuesArray.push(valueOfUpdatedSting['value']);
            }

            var dynamicStringArray = mainString.split(' ');
            var stringNumber = 0;
            for (let index = 0; index < dynamicStringArray.length; index++)
            {
                var stringToAttach = dynamicStringArray[index];

                var currentData = dynamicStringArray[index];
                var currentDataInfo = currentData.split('@');

                var currentTimer = dynamicStringArray[index];
                var currentTimerInfo = currentTimer.split('||');

                var currentNumber = dynamicStringArray[index];
                var currentNumberInfo = currentNumber.split('$');

                if(currentDataInfo[1] != '' && currentDataInfo[1] != null && currentDataInfo[1] != undefined)
                {   
                    var date = moment(updatedStringValuesArray[stringNumber]).format("YYYY-MM-DD");
                    stringToAttach = '#date@'+date;
                    stringNumber = stringNumber + 1;
                }

                if(currentTimerInfo[1] != '' && currentTimerInfo[1] != null && currentTimerInfo[1] != undefined)
                {
                    var time = updatedStringValuesArray[stringNumber];
                    stringToAttach = '#time||'+time;
                    stringNumber = stringNumber + 1;
                }

                if(currentNumberInfo[1] != '' && currentNumberInfo[1] != null && currentNumberInfo[1] != undefined)
                {
                    var number = updatedStringValuesArray[stringNumber];
                    stringToAttach = '#number$'+number;
                    stringNumber = stringNumber + 1;
                }
                finalString += ' '+stringToAttach;
            }
        }
        
        
        if(type == 'CustomClauseTerms')
        {
            for (let index = 0; index < this.customClauseDataResponseData.length; index++)
            {
                for (let sindex = 0; sindex < this.customClauseDataResponseData[index].clauseCategoryTerms.length; sindex++)
                {
                    var mainTimeStamp = this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['timeStamp'];
                    var mainTermString = this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['mainString'];

                    if(mainTimeStamp == className)
                    {
                        this.customTermsOfCustomClauseEditCustomClauseID = this.customClauseDataResponseData[index].id;
                        this.customTermsOfCustomClauseEditParentID = this.customClauseDataResponseData[index].clauseCategoryTerms[sindex].id;
                        this.tmpeditclausetext = this.customClauseDataResponseData[index].clauseCategoryTerms[sindex].termsName;
                        this.termsName = finalString;

                        const req =
                        {   
                            mainUserId: localStorage.getItem('userId'),
                            companyId: localStorage.getItem('companyId'),
                            drawId: this.drawId,
                            tradingId: this.tradingId,
                            formId: this.formId,
                            customCluaseCategoryId: this.customTermsOfCustomClauseEditCustomClauseID,
                            customClauseTermsId: this.customTermsOfCustomClauseEditParentID,
                            nos: '1',
                            termsNameOrginal: '',
                            termsName: finalString,
                            createdBy: localStorage.getItem('userId'),
                            updatedBy: localStorage.getItem('userId'),
                            isCustom: 'Y'
                        };

                        try
                        {
                            const header = new HttpHeaders(); header.append('Content-Type', 'application/json');
                            const headerOptions = { headers: header }
                            this.http.post(`${config.baseUrl}/CustomClauseTermsInsert`, req, headerOptions).subscribe(res =>
                            {   this.termsUpdateRes = res; this.editclausetext = '';    });
                        } catch (err) {}
                    }
                }
            }
        } else {
            for (let index = 0; index < this.termsReviewRecordsData.length; index++)
            {
                if(type == 'Main')
                {
                    for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++)
                    {
                        var mainTimeStamp = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['timeStamp'];
                        var mainTermString = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainString'];

                        if(mainTimeStamp == className)
                        {
                            this.editClauseTermOfMainClauseCategoryID = this.termsReviewRecordsData[index].id;
                            this.editClauseTermOfMainClauseID = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].id;
                            this.tmpeditclausetext = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].termsName;
                            this.termsName = finalString;

                            const req =
                            {   
                                mainUserId: localStorage.getItem('userId'),
                                companyId: localStorage.getItem('companyId'),
                                drawId: this.drawId,
                                tradingId: this.tradingId,
                                formId: this.formId,
                                clauseCategoryId: this.editClauseTermOfMainClauseCategoryID,
                                clauseTermsId: this.editClauseTermOfMainClauseID,
                                
                                nos: '1',
                                termsNameOrginal: this.tmpeditclausetext,
                                termsName: finalString,
                                createdBy: localStorage.getItem('userId'),
                                updatedBy: localStorage.getItem('userId'),
                                // isCustom: 'Y'
                            };

                            try
                            {
                                const header = new HttpHeaders(); header.append('Content-Type', 'application/json');
                                const headerOptions = { headers: header }
                                this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(res =>
                                {   this.termsUpdateRes = res; this.editclausetext = '';    });
                            } catch (err) {}
                        }
                    
                    }
                }

                if(type == 'Custom')
                {
                    for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; sindex++)
                    {
                        var mainTimeStamp = this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindex]['timeStamp'];
                        
                        if(mainTimeStamp == className)
                        {
                        
                            this.editClauseTermOfMainClauseCategoryID = this.termsReviewRecordsData[index].id;
                            this.editClauseTermOfMainClauseID = this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindex].id;
                            this.tmpeditclausetext = this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindex].termsName;
                            this.termsName = finalString;

                            const req =
                            {   
                                mainUserId: localStorage.getItem('userId'),
                                companyId: localStorage.getItem('companyId'),
                                drawId: this.drawId,
                                tradingId: this.tradingId,
                                formId: this.formId,
                                clauseCategoryId: this.editClauseTermOfMainClauseCategoryID,
                                clauseTermsId: this.editClauseTermOfMainClauseID,
                                parentId: this.editClauseTermOfMainClauseID,
                                nos: '1',
                                termsNameOrginal: this.tmpeditclausetext,
                                termsName: finalString,
                                createdBy: localStorage.getItem('userId'),
                                updatedBy: localStorage.getItem('userId'),
                                isCustom: 'Y'
                            };

                            try
                            {
                                const header = new HttpHeaders(); header.append('Content-Type', 'application/json');
                                const headerOptions = { headers: header }
                                this.http.post(`${config.baseUrl}/customClauseDetailsInsert`, req, headerOptions).subscribe(res =>
                                {   this.termsUpdateRes = res; this.editclausetext = ''; this.editCustomClauseTermDataInput = '';    });
                            } catch (err) {}
                        }
                    }
                }
            }
        }
    }

    updateDynamicTerms()
    {
        var mainUserId = localStorage.getItem('userId');
        var companyId = localStorage.getItem('companyId');
        var drawId = this.drawId;
        var tradingId = this.tradingId;
        var formId = this.formId;
        var clauseCategoryId = this.editClauseTermOfMainClauseCategoryID;
        var clauseTermsId = this.editClauseTermOfMainClauseID;
        var nos = '1';
        var termsNameOrginal = this.tmpeditclausetext;
        var termsName = this.editclausetext;

        const req =
        {

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

        
        try
        {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(
                res => {
                    this.termsUpdateRes = res;
                    if (this.termsUpdateRes.success === true)
                    {
                        this.editclausetext = '';
                    }
                }
            );
        } catch (err) {}
    }
    
    createStringWithDynamicDateTimeNumberPicker(mainString,timeStamp)
    {
        this.dynamicStringArray = mainString.split(' ');

        for (let index = 0; index < this.dynamicStringArray.length; index++)
        {
            var newNumber = this.dynamicInputNumber + 1;
            
            this.dynamicInputNumber = newNumber;

            var currentData = this.dynamicStringArray[index];
                currentData = currentData.split('@');

            var currentTimer = this.dynamicStringArray[index];
                currentTimer = currentTimer.split('||');

            var currentNumber = this.dynamicStringArray[index];
                currentNumber = currentNumber.split('$');

            var stringInfo = this.dynamicStringArray[index];

            if(currentData[1] != '' && currentData[1] != null && currentData[1] != undefined)
            {
                stringInfo = '#date';
            }

            if(currentTimer[1] != '' && currentTimer[1] != null && currentTimer[1] != undefined)
            {
                stringInfo = '#time';
            }

            if(currentNumber[1] != '' && currentNumber[1] != null && currentNumber[1] != undefined)
            {
                stringInfo = '#number';
            }

            var number = index + 1;
            
            var mainData = {};
                
                mainData['string'] = stringInfo;

                mainData['timeStamp'] = timeStamp;

                mainData['dynamicInputNumber'] = this.dynamicInputNumber;

                mainData['hasValue'] = '';
                mainData['inputIdentifier'] = '';

                mainData['hasTimeValue'] = moment().format("HH:mm A");
                mainData['inputTimeIdentifier'] = '';

                mainData['hasNumberValue'] = '';
                mainData['inputNumberIdentifier'] = '';

                mainData['hasNumberPicker'] = '';

            if(currentData[1] != '' && currentData[1] != null && currentData[1] != undefined)
            {
                var dateInfo  = moment(currentData[1]).format("YYYY-MM-DD");
                mainData['hasValue'] = dateInfo;
                mainData['inputIdentifier'] = 'dynamicDatePicker'+number;
            }

            if(currentTimer[1] != '' && currentTimer[1] != null && currentTimer[1] != undefined)
            {   
                var time = currentTimer[1];
                    time = time.replace('&#160;','');
                
                
                
                
                mainData['hasTimeValue'] = time;
                mainData['inputTimeIdentifier'] = 'dynamicTimePicker'+number;
            }

            if(currentNumber[1] != '' && currentNumber[1] != null && currentNumber[1] != undefined)
            {
                mainData['hasNumberValue'] = currentNumber[1];
                mainData['inputNumberIdentifier'] = 'numberPicker'+number;

                var finalNumberPicker = [];

                for (let index = 0; index < 100; index++)
                {
                    var number = index + 1;
                    var mainNumberData = {};
                        mainNumberData['number'] = number;
                        mainNumberData['selected'] = (number == currentNumber[1]) ? 'selected' : '';

                    finalNumberPicker[index] = mainNumberData;
                }

                mainData['hasNumberPicker'] = finalNumberPicker;
            }

            this.dynamicStringArray[index] = mainData;
        }

        var arrayData = {};
        arrayData['timeStamp'] = timeStamp;
        arrayData['dataArray'] = this.dynamicStringArray;
        arrayData['mainString'] = mainString;

        this.mainDynamicStringArray.push(arrayData);
        

        return this.dynamicStringArray;
    }

    setTime()
    {
        
    }
    

    
    
    customClauseDataRecordsRecap() : void
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        var drawId = filter.drawId;
        var tradingId = filter.tradingId;

        var commonClausesCustomClauseTermArray = localStorage.getItem('commonClausesCustomClauseTermArray');
        
        var drawCondition = {};
            drawCondition["drawId"] = drawId;
            drawCondition["tradingId"] = tradingId;
            drawCondition["commonClauses"] = commonClausesCustomClauseTermArray;
        
        try
        {
            this._userService.customClauseRecords(drawCondition).pipe(first()).subscribe((res) =>
            {
                this.customClauseDataResponse = res;
                if (this.customClauseDataResponse.success === true)
                {
                    this.customClauseDataResponseData = this.customClauseDataResponse.data;
                    var newCount = this.termsReviewRecordsData.length;
                        newCount = newCount + 1;
                    for (let index = 0; index < this.customClauseDataResponseData.length; index++)
                    {
                        this.customClauseDataResponseData[index]['numberInfo'] = newCount;
                        newCount = newCount + 1;
                        for (let sindex = 0; sindex < this.customClauseDataResponseData[index].clauseCategoryTerms.length; sindex++)
                        {
                            this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                        }
                        for (let sindex = 0; sindex < this.customClauseDataResponseData[index].clauseCategoryTermsUpdateCustom.length; sindex++)
                        {
                            this.customClauseDataResponseData[index].clauseCategoryTermsUpdateCustom[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                        }
                    }
                    
                    

                    this.checkAllFunctionChecked();

                }
            })
        } catch (err) { }
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
        this.clauseCategoryTermsReviewData = [];
        var filterCondition = {};
        filterCondition["ccam.companyId"] = this.companyId;
        filterCondition["ccam.formId"] = this.formId;
        filterCondition["ccam.parentId"] = this.parentId;
        filterCondition["ccam.clauseId"] = this.clauseId;
        try
        {
            this._userService.clauseTermsReviewsRecordsServerSide(filterCondition)
            .pipe(first())
            .subscribe((res) =>
            {
                this.clauseCategoryTermsReviewResponse = res;
                if (this.clauseCategoryTermsReviewResponse.success === true)
                {
                    this.clauseCategoryTermsReviewData = this.clauseCategoryTermsReviewResponse.data;
                    this.dataSource = new MatTableDataSource(this.clauseCategoryTermsReviewData);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }
            },
            err =>
            {
                this.alertService.error(err, 'Error');
            });
        } catch (err) {}
    }

    // Fetch Clauses And Its Terms Details Records Start
    reviewModalShow(clausesId, parentId): void
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

    // Custom Clause
    customClauseToggleOpen(key): void
    {
        this.clauseTitle = '';
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    // custome terms add toggle
    toggleOpen(key, id): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
        this.parentId = id;
    }

    addCustomClauseTerms() : void
    {
        if(this.clauseTerms != '' && this.clauseTerms != null )
        {
            var clauseTermsArray = this.clauseTermsArray;

            var isMatched = 1;

            for (let index = 0; index < clauseTermsArray.length; index++)
            {
                if(clauseTermsArray[index]['clauseTermsName'] == this.clauseTerms)
                {
                   isMatched = 2;
                }
            }

            if(isMatched == 1)
            {
                var number = this.clauseTermNumber;
                number = number + 1;

                this.clauseTermNumber = number;

                var filterCondition = {};
                    filterCondition['clauseTermCustomID'] = 'clauseTermCustomID'+number;
                    filterCondition['clauseTermCustomIDButton'] = 'clauseTermCustomIDButton'+number;
                    filterCondition['clauseTermsName'] = this.clauseTerms;

                this.clauseTermsArray.push(filterCondition);

                this.clauseTerms = '';
            } else {
                this.alertService.error('Term Already Exist', 'Error');
            }
        } else {
            this.alertService.error('Please Enter Custom Clause Term', 'Error');
        }
    }

    removeCustomClauseTerms(clauseTermCustomID,clauseTermCustomIDButton) : void
    {
        var clauseTermsArray = this.clauseTermsArray;
        this.clauseTermsArray = [];
        for (let index = 0; index < clauseTermsArray.length; index++)
        {
            if(clauseTermsArray[index]['clauseTermCustomID'] != clauseTermCustomID)
            {
                this.clauseTermsArray.push(clauseTermsArray[index]);
            }
        }
    }

    // Custom Clause
    addCustomClause()
    {
        var customClauseInsertID = '';
        var mainUserId = localStorage.getItem('userId');
        var companyId = localStorage.getItem('companyId');
        var drawId = this.drawId;
        var tradingId = this.tradingId;
        const req =
        {
            clauseTitle: this.clauseTitle,
            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
            tradingId: tradingId,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };
        try
        {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/CustomClauseInsert`, req, headerOptions).subscribe( res =>
            {
                this.customClauseTermsResponse = res;
                if (this.customClauseTermsResponse.success === true)
                {
                    this._fuseSidebarService.getSidebar('addCustomClausePanel').toggleOpen();
                    this.alertService.success('Custom Claused Created Successfully', 'Success');
                    this.customClauseInsertID = this.customClauseTermsResponse.data[0];
                    var clauseTermsArray = this.clauseTermsArray;
                    for (let index = 0; index < clauseTermsArray.length; index++)
                    {
                        const req =
                        {
                            customCluaseCategoryId: this.customClauseInsertID,
                            customClauseTermsId: null,
                            mainUserId: mainUserId,
                            companyId: companyId,
                            drawId: drawId,
                            formId: this.formId,
                            tradingId: tradingId,
                            termsName : clauseTermsArray[index]['clauseTermsName'],
                            createdBy: localStorage.getItem('userId'),
                            updatedBy: localStorage.getItem('userId')
                        };
                        const header = new HttpHeaders();
                        header.append('Content-Type', 'application/json');
                        const headerOptions = { headers: header }
                        this.http.post(`${config.baseUrl}/CustomClauseTermsInsert`, req, headerOptions).subscribe( res =>
                        {

                        });
                    }
                    this.termsReviewRecords();
                } else {
                    this.alertService.error('Name Already Exist', 'Error');
                }
            });
        } catch (err) {
        }
    }

    // custom terms add
    addClause() {
        this.termsReviewRecordsData = [];
        var mainUserId = localStorage.getItem('userId');
        // 

        var companyId = localStorage.getItem('companyId');
        // 

        var drawId = this.drawId;
        var tradingId = this.tradingId;
        // 

        var formId = this.formId;
        // 

        var clauseCategoryId = this.parentId;
        // 

        // var clauseTermsId = '1';
        // 

        var nos = '1';
        // 

        var termsNameOrginal = this.customClause;
        // 

        var termsName = this.customClause;
        // 
        const req =
        {
            id: '',
            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
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
                    
                    
                    if (this.termsUpdateRes.success === true) {
                        // 
                        
                        this._fuseSidebarService.getSidebar('addPanel').toggleOpen();
                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) {
        }
    }

    // edit toggle open      
    editToggle(key, id, clauseid): void {
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
                
                
            });
    }

    // main terms  edit
    editterms(id)
    {
        var mainUserId = localStorage.getItem('userId');
        var companyId = localStorage.getItem('companyId');
        var drawId = this.drawId;
        var tradingId = this.tradingId;
        var formId = this.formId;
        var clauseCategoryId = this.parentId;
        var clauseTermsId = id;
        var nos = '1';
        var termsNameOrginal = this.tmpeditclausetext;
        var termsName = this.editclausetext;
        const req =
        {

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
        try
        {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(
                res =>
                {
                    this.termsUpdateRes = res;
                    if (this.termsUpdateRes.success === true)
                    {
                        this._fuseSidebarService.getSidebar('editPanel').toggleOpen();
                        this.editclausetext = '';
                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) {
        }
    }

    // custom terms edit toggle
    customToggle(key, id, clauseid): void
    {
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
        if (isTrading == '2')
        {
            clauseTermsReviewFilter["tu.companyId"] = companyId;
            clauseTermsReviewFilter["tu.drawId"] = drawId;
            clauseTermsReviewFilter["tu.formId"] = formID;
            clauseTermsReviewFilter["tu.clauseCategoryId"] = this.parentId;
            this._userService.clauseTermsReviewsRecordsServerSideCustom(clauseTermsReviewFilter)
                .subscribe(res =>
                {
                    this.tempedit = res;
                    for (let index = 0; index < this.tempedit.data.length; index++)
                    {
                        if (this.tempedit.data[index].id == id)
                        {
                            this.editclauses.push(this.tempedit.data[index]);
                            this.editid = this.tempedit.data[index].id;
                            this.editclausetext = this.tempedit.data[index].termsName;
                            this.tmpeditclausetext = this.tempedit.data[index].termsName;
                        }
                    }
                });
        } else {
            clauseTermsReviewFilter["tu.companyId"] = companyId;
            clauseTermsReviewFilter["tu.tradingId"] = tradingId;
            clauseTermsReviewFilter["tu.formId"] = formID;
            clauseTermsReviewFilter["tu.clauseCategoryId"] = this.parentId;
            this._userService.clauseTermsReviewsRecordsServerSideCustom(clauseTermsReviewFilter)
                .subscribe(res =>
                {
                    this.tempedit = res;
                    for (let index = 0; index < this.tempedit.data.length; index++)
                    {

                        if (this.tempedit.data[index].id == id)
                        {
                            this.editclauses.push(this.tempedit.data[index]);
                            this.editid = this.tempedit.data[index].id;
                            this.editclausetext = this.tempedit.data[index].termsName;
                            this.tmpeditclausetext = this.tempedit.data[index].termsName;
                        }
                    }
                });
        }
    }

    // custome terms edit    
    customEdit(id)
    {
        var mainUserId = localStorage.getItem('userId');
        var companyId = localStorage.getItem('companyId');
        var drawId = this.drawId;
        var tradingId = this.tradingId;
        var formId = this.formId;
        var clauseCategoryId = this.parentId;
        var clauseTermsId = '';
        var nos = '1';
        var termsNameOrginal = this.tmpeditclausetext;
        var termsName = this.editclausetext;
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
        try
        {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/claueseDetailCustomInsertUpdate`, req, headerOptions).subscribe(
                res =>
                {
                    this.termsUpdateRes = res;
                    
                    
                    if (this.termsUpdateRes.success === true) {
                        // 
                        
                        this._fuseSidebarService.getSidebar('customPanel').toggleOpen();
                        this.editclausetext = '';

                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) {
        }
    }
    // main terms view

    view(key, id, clauseid)
    {
        let cid = id;
        this.parentId = clauseid;
        this.editclauses = [];
        this._fuseSidebarService.getSidebar(key).toggleOpen();
        this.viewData = [];
        for (let index = 0; index < this.termsReviewRecordsData.length; index++)
        {
            if (this.termsReviewRecordsData[index].id == this.parentId)
            {
                for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++)
                {
                    if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].id == cid)
                    {
                        if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length != 0)
                        {
                            for (let thirdindex = 0; thirdindex < this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length; thirdindex++)
                            {
                                this.viewData.push(this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate[thirdindex]);
                            }
                        }
                    }
                }
            }
        }
        this.dataSource = new MatTableDataSource(this.viewData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    // custome terms view
    viewCustom(key, id, clauseid)
    {
        let cid = id;
        this.parentId = clauseid;
        this.editclauses = [];
        this._fuseSidebarService.getSidebar(key).toggleOpen();
        this.viewData = [];
        for (let index = 0; index < this.termsReviewRecordsData.length; index++)
        {
            if (this.termsReviewRecordsData[index].id == this.parentId)
            {
                for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++)
                {
                    if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].id == cid)
                    {
                        if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length != 0)
                        {
                            for (let thirdindex = 0; thirdindex < this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length; thirdindex++)
                            {
                                this.viewCustomData.push(this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate[thirdindex]);
                            }
                        }
                    }
                }
            }
        }

        this.dataSourcecustom = new MatTableDataSource(this.viewCustomData);
        this.dataSourcecustom.paginator = this.paginator;
        this.dataSourcecustom.sort = this.sort;
    }

    // Clause Submit
    submit()
    {
        // Convert All Array Values To Number Format Start
        var convertToNumberArray = this.ownerCheckedClauses;
        this.ownerCheckedClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++)
        {
            this.ownerCheckedClauses.push(Number(convertToNumberArray[index]));
        }
        
        var convertToNumberArray = this.ownerCheckedCustomClauses;
        this.ownerCheckedCustomClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++)
        {
            this.ownerCheckedCustomClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.ownerCheckedCustomTermsClauses;
        this.ownerCheckedCustomTermsClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++)
        {
            this.ownerCheckedCustomTermsClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.chartererCheckedClauses;
        this.chartererCheckedClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++)
        {
            this.chartererCheckedClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.chartererCheckedCustomClauses;
        this.chartererCheckedCustomClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++)
        {
            this.chartererCheckedCustomClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.chartererCheckedCustomTermsClauses;
        this.chartererCheckedCustomTermsClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++)
        {
            this.chartererCheckedCustomTermsClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.checkedCheckBox;
        this.checkedCheckBox = [];
        for (let index = 0; index < convertToNumberArray.length; index++)
        {
            this.checkedCheckBox.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.checkedCheckBoxCustom;
        this.checkedCheckBoxCustom = [];
        for (let index = 0; index < convertToNumberArray.length; index++)
        {
            this.checkedCheckBoxCustom.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.checkedCheckBoxCustomClauseTerms;
        this.checkedCheckBoxCustomClauseTerms = [];
        for (let index = 0; index < convertToNumberArray.length; index++)
        {
            this.checkedCheckBoxCustomClauseTerms.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.mainTermCheckedClauses;
        this.mainTermCheckedClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++)
        {
            this.mainTermCheckedClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.mainTermCheckedClausesCustom;
        this.mainTermCheckedClausesCustom = [];
        for (let index = 0; index < convertToNumberArray.length; index++)
        {
            this.mainTermCheckedClausesCustom.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.mainTermCheckedClausesCustomTerms;
        this.mainTermCheckedClausesCustomTerms = [];
        for (let index = 0; index < convertToNumberArray.length; index++)
        {
            this.mainTermCheckedClausesCustomTerms.push(Number(convertToNumberArray[index]));
        }

        // Convert All Array Values To Number Format End

        if(this.tradingId != '' && this.tradingId != null && this.tradingId != undefined)
        {
            var mainClausesChecked = [];
            var mainClausesCustomChecked = [];
            var mainClausesCustomTermsChecked = [];

            if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
            {
                var mainClausesChecked = this.ownerCheckedClauses;
                var mainClausesCustomChecked = this.ownerCheckedCustomClauses;
                var mainClausesCustomTermsChecked = this.ownerCheckedCustomTermsClauses;
                console.log(mainClausesChecked,'Owner Currently Selected Clauases');
            }

            if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
            {
                var mainClausesChecked = this.chartererCheckedClauses;
                var mainClausesCustomChecked = this.chartererCheckedCustomClauses;
                var mainClausesCustomTermsChecked = this.chartererCheckedCustomTermsClauses;
                console.log(mainClausesChecked,'Charterer Currently Selected Clauases');
            }
            

            console.log(mainClausesChecked,'Compare Clauases');
            // Main Term Clause Checked Start
            var agreedTermsArray = [];
            for (let index = 0; index < mainClausesChecked.length; index++)
            {
                if(this.checkedCheckBox.indexOf(mainClausesChecked[index]) >= 0)
                {
                    agreedTermsArray.push(Number(mainClausesChecked[index]));
                }
            }
            console.log(agreedTermsArray,'Both Agreed Clauses');
            var finalAgreementArray = [];
            
            for (let index = 0; index < agreedTermsArray.length; index++)
            {
                if(this.mainTermCheckedClauses.indexOf(agreedTermsArray[index]) < 0)
                {
                    finalAgreementArray.push(Number(agreedTermsArray[index]));
                }
            }

            for (let index = 0; index < finalAgreementArray.length; index++)
            {
                this.mainTermCheckedClauses.push(Number(finalAgreementArray[index]));
            }

            console.log(this.mainTermCheckedClauses,'Both Agreed Clauses');

            var finalChartererClauseArray = this.checkedCheckBox;
            this.checkedCheckBox = [];
            for (let index = 0; index < finalChartererClauseArray.length; index++)
            {
                if(finalAgreementArray.indexOf(finalChartererClauseArray[index]) < 0)
                {
                    this.checkedCheckBox.push(Number(finalChartererClauseArray[index]));
                }
            }

            this.chartererCheckedClauses = [];
            this.ownerCheckedClauses = [];

            // Main Term Clause Checked End

            // Main Term Clause Custom Checked Start
            var agreedTermsArray = [];
            for (let index = 0; index < mainClausesCustomChecked.length; index++)
            {
                if(this.checkedCheckBoxCustom.indexOf(mainClausesCustomChecked[index]) >= 0)
                {
                    agreedTermsArray.push(Number(mainClausesCustomChecked[index]));
                }
            }
            var finalAgreementArray = [];
            for (let index = 0; index < agreedTermsArray.length; index++)
            {
                if(this.mainTermCheckedClausesCustom.indexOf(agreedTermsArray[index]) < 0)
                {
                    finalAgreementArray.push(Number(agreedTermsArray[index]));
                }
            }
            
            for (let index = 0; index < finalAgreementArray.length; index++)
            {
                this.mainTermCheckedClausesCustom.push(Number(finalAgreementArray[index]));
            }

            var finalChartererClauseArray = this.checkedCheckBoxCustom;
            this.checkedCheckBoxCustom = [];
            for (let index = 0; index < finalChartererClauseArray.length; index++)
            {
                if(finalAgreementArray.indexOf(finalChartererClauseArray[index]) < 0)
                {
                    this.checkedCheckBoxCustom.push(Number(finalChartererClauseArray[index]));
                }
            }

            this.chartererCheckedCustomClauses = [];
            this.ownerCheckedCustomClauses = [];
            // Main Term Clause Custom Checked End

            // Main Term Clause Custom Terms Checked Start
            var agreedTermsArray = [];
            for (let index = 0; index < mainClausesCustomTermsChecked.length; index++)
            {
                if(this.checkedCheckBoxCustomClauseTerms.indexOf(mainClausesCustomTermsChecked[index]) >= 0)
                {
                    agreedTermsArray.push(Number(mainClausesCustomTermsChecked[index]));
                }
            }
            var finalAgreementArray = [];
            for (let index = 0; index < agreedTermsArray.length; index++)
            {
                if(this.mainTermCheckedClausesCustomTerms.indexOf(agreedTermsArray[index]) < 0)
                {
                    finalAgreementArray.push(Number(agreedTermsArray[index]));
                }
            }
            for (let index = 0; index < finalAgreementArray.length; index++)
            {
                this.mainTermCheckedClausesCustomTerms.push(Number(finalAgreementArray[index]));
            }

            var finalChartererClauseArray = this.checkedCheckBoxCustomClauseTerms;
            this.checkedCheckBoxCustomClauseTerms = [];
            for (let index = 0; index < finalChartererClauseArray.length; index++)
            {
                if(finalAgreementArray.indexOf(finalChartererClauseArray[index]) < 0)
                {
                    this.checkedCheckBoxCustomClauseTerms.push(Number(finalChartererClauseArray[index]));
                }
            }
            this.chartererCheckedCustomTermsClauses = [];
            this.ownerCheckedCustomTermsClauses = [];
            // Main Term Clause Custom Terms Checked End

        }
        var fromUserId = localStorage.getItem('userId');
        var notification = 'New Draw C/p Available';
        var toUserId = this.chartererId;
        var checkedCheckBox = this.checkedCheckBox.join();
        var checkedCheckBoxCustom = this.checkedCheckBoxCustom.join();
        var checkedCheckBoxCustomClauseTerms = this.checkedCheckBoxCustomClauseTerms.join();

        var mainTermCheckedClauses = this.mainTermCheckedClauses.join();
        var mainTermCheckedClausesCustom = this.mainTermCheckedClausesCustom.join();
        var mainTermCheckedClausesCustomTerms = this.mainTermCheckedClausesCustomTerms.join();

        var chartererCheckedClauses = this.chartererCheckedClauses.join();
        var chartererCheckedCustomClauses = this.chartererCheckedCustomClauses.join();
        var chartererCheckedCustomTermsClauses = this.chartererCheckedCustomTermsClauses.join();

        if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            var chartererCheckedClauses = this.checkedCheckBox.join();
            var chartererCheckedCustomClauses = this.checkedCheckBoxCustom.join();
            var chartererCheckedCustomTermsClauses = this.checkedCheckBoxCustomClauseTerms.join();
        }

        var ownerCheckedClauses = this.ownerCheckedClauses.join();
        var ownerCheckedCustomClauses = this.ownerCheckedCustomClauses.join();
        var ownerCheckedCustomTermsClauses = this.ownerCheckedCustomTermsClauses.join();

        if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            var ownerCheckedClauses = this.checkedCheckBox.join();
            var ownerCheckedCustomClauses = this.checkedCheckBoxCustom.join();
            var ownerCheckedCustomTermsClauses = this.checkedCheckBoxCustomClauseTerms.join();
        }

        if (this.isTrading == '2')
        {
            const reqData =
            {
                drawId: this.drawId,
                chartererId: toUserId,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
            }
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
                            
                            if (this.notifiactionres.success === true) {
                                
                            }
                        }
                    );
                } catch (err) {}
            });

            this.drawDataUpdate();

            this.drawExstingUpdate();
            
            if (JSON.parse(localStorage.getItem('userRoleId')) == '3')
            {
                const req =
                {
                    id : this.drawId,
                    broker_clauses: checkedCheckBox,
                    common_clauses: checkedCheckBox,
                    custom_term_clause: checkedCheckBoxCustom,
                    custom_common_clause: checkedCheckBoxCustomClauseTerms,
                    updatedBy: localStorage.getItem('userId')
                };
                try
                {
                    const header = new HttpHeaders();
                    header.append('Content-Type', 'application/json');
                    const headerOptions =
                    {
                        headers: header
                    }
                    this.http.post(`${config.baseUrl}/drawFormUpdateByBrokerCheck`, req, headerOptions).subscribe(
                    res =>
                    {
                        this.router.navigate(['/apps/draw-management']);
                    });
                } catch (err) {}
            }

            if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
            {
                const req =
                {
                    id : this.drawId,
                    charterer_clauses: checkedCheckBox,
                    common_clauses: checkedCheckBox,
                    custom_term_clause: checkedCheckBoxCustom,
                    custom_common_clause: checkedCheckBoxCustomClauseTerms,
                    updatedBy: localStorage.getItem('userId')
                };
                try
                {
                    const header = new HttpHeaders();
                    header.append('Content-Type', 'application/json');
                    const headerOptions =
                    {
                        headers: header
                    }
                    this.http.post(`${config.baseUrl}/drawFormUpdateByCharterCheck`, req, headerOptions).subscribe(
                    res =>
                    {
                        this.router.navigate(['/apps/draw-management']);
                    });
                } catch (err) {}
            }

            if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
            {
                const req =
                {
                    id : this.drawId,
                    owner_clauses: checkedCheckBox,
                    common_clauses: checkedCheckBox,
                    custom_term_clause: checkedCheckBoxCustom,
                    custom_common_clause: checkedCheckBoxCustomClauseTerms,
                    updatedBy: localStorage.getItem('userId')
                };
                try
                {
                    const header = new HttpHeaders();
                    header.append('Content-Type', 'application/json');
                    const headerOptions =
                    {
                        headers: header
                    }
                    this.http.post(`${config.baseUrl}/drawFormUpdateByOwnerCheck`, req, headerOptions).subscribe(
                    res =>
                    {
                        this.router.navigate(['/apps/draw-management']);
                    });
                } catch (err) {}
            }

        } else {
            var convertedDate = moment(this.clauseFormValues.cpDate.value).format("YYYY-MM-DD");
            var updateData = {};
                updateData['id'] = this.tradingId;

                console.log(this.message);

                if(this.ownerCounterNumber > '1')
                {
                    updateData['progress'] = '30';
                    updateData['progress_info'] = '3';
                }
                
                if(this.is_owner_main_term_sign_off == '1')
                {
                    updateData['progress'] = '40';
                    updateData['progress_info'] = '4';
                    this.message = this.ownerNameNotification+' Sign Off Main Term';
                }

                if(this.is_charterer_main_term_sign_off == '1')
                {
                    updateData['progress'] = '50';
                    updateData['progress_info'] = '5';
                    this.message = this.chartererNameNotification+' Sign Off Main Term';
                }

                if(this.ownerDetailCounterNumber > '1')
                {
                    updateData['progress'] = '60';
                    updateData['progress_info'] = '6';
                    this.message = this.pageTitle;
                }

                if(this.is_owner_detail_term_sign_off == '1' && this.ownerDetailCounterNumber > '1')
                {
                    updateData['progress'] = '70';
                    updateData['progress_info'] = '7';
                    this.message = this.ownerNameNotification+' Sign Off Detail Term';
                }

                if(this.is_charterer_detail_term_sign_off == '1' && this.ownerDetailCounterNumber > '1')
                {
                    updateData['progress'] = '80';
                    updateData['progress_info'] = '8';
                    this.message = this.chartererNameNotification+' Sign Off Detail Term';
                }

                
                updateData['cpTime'] = this.clauseFormValues.cpTime.value;
                updateData['cpCity'] = this.clauseFormValues.cityId.value;
                updateData['cpDate'] = convertedDate;

                updateData['is_owner_main_term_sign_off'] = this.is_owner_main_term_sign_off;
                updateData['is_charterer_main_term_sign_off'] = this.is_charterer_main_term_sign_off;
                updateData['is_owner_detail_term_sign_off'] = this.is_owner_detail_term_sign_off;
                updateData['is_charterer_detail_term_sign_off'] = this.is_charterer_detail_term_sign_off;

                if(this.is_owner_main_term_sign_off == '1' && this.is_charterer_main_term_sign_off == '1')
                {
                    updateData['main_term_checked_clauses'] = this.checkedClauseCategory.join();
                }

                if (JSON.parse(localStorage.getItem('userRoleId')) == '3')
                {
                    updateData['broker_clauses'] = checkedCheckBox;    
                }
                if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
                {
                    updateData['charterer_detail_counter'] = this.chartererDetailCounterNumber;
                    updateData['charterer_counter'] = this.chartererCounterNumber;
                    updateData['charterer_clauses'] = checkedCheckBox;    
                }
                if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
                {
                    updateData['owner_detail_counter'] = this.ownerDetailCounterNumber;
                    updateData['owner_counter'] = this.ownerCounterNumber;
                    updateData['owner_clauses'] = checkedCheckBox;    
                }
                updateData['common_clauses'] = checkedCheckBox;
                updateData['custom_term_clause'] = checkedCheckBoxCustom;
                updateData['custom_common_clause'] = checkedCheckBoxCustomClauseTerms;
                
                updateData['charterer_clauses'] = chartererCheckedClauses;
                updateData['charterer_custom_clauses'] = chartererCheckedCustomClauses;
                updateData['charterer_custom_terms_clauses'] = chartererCheckedCustomTermsClauses;

                updateData['owner_clauses'] = ownerCheckedClauses;
                updateData['owner_custom_clauses'] = ownerCheckedCustomClauses;
                updateData['owner_custom_terms_clauses'] = ownerCheckedCustomTermsClauses;

                updateData['main_term_clauses'] = mainTermCheckedClauses;
                updateData['main_term_checked_clauses_custom'] = mainTermCheckedClausesCustom;
                updateData['main_term_checked_clauses_custom_term'] = mainTermCheckedClausesCustomTerms;
                updateData['updatedBy'] = JSON.parse(localStorage.getItem('userId'));
                
                console.log(this.message);
                console.log(this.pageTitle);

                try{ this._userService.tradingDataUpdateCommon(updateData).pipe(first()).subscribe((res) =>{}, err => {  }); } catch (err){  }
                
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            var tradingMessageInsertData = {};
                tradingMessageInsertData['tradingId'] = this.tradingId;
                if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
                {
                    tradingMessageInsertData['message'] = this.message;
                }
                if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
                {
                    tradingMessageInsertData['message'] = this.message;
                    // tradingMessageInsertData['message'] = 'Charterer Updates';
                    if(this.ownerCounterNumber > '1')
                    {
                        tradingMessageInsertData['message'] = this.message;
                    }

                    if(this.ownerDetailCounterNumber > '1')
                    {
                        tradingMessageInsertData['message'] = this.message;
                    }
                }
                tradingMessageInsertData['createdBy'] = localStorage.getItem('userId');
                tradingMessageInsertData['updatedBy'] = localStorage.getItem('userId');
                this.http.post(`${config.baseUrl}/tradingMessageInsert`,tradingMessageInsertData, headerOptions).subscribe(res =>{},err =>{});

            var tradingProgressInsertData = {};
                tradingProgressInsertData['tradingId'] = this.tradingId;
                tradingProgressInsertData['ownerId'] = this.ownerId;
                tradingProgressInsertData['brokerId'] = this.brokerId;
                tradingProgressInsertData['chartererId'] = this.chartererId;
                if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
                {
                    tradingProgressInsertData['message'] = this.message;
                }
                if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
                {
                    tradingMessageInsertData['message'] = this.message;
                    // tradingProgressInsertData['message'] = 'Charterer Updates';
                    if(this.ownerCounterNumber > '1')
                    {
                        tradingProgressInsertData['message'] = this.message;
                    }
                    if(this.ownerDetailCounterNumber > '1')
                    {
                        tradingProgressInsertData['message'] = this.message;
                    }
                }


                tradingProgressInsertData['createdBy'] = localStorage.getItem('userId');
                tradingProgressInsertData['updatedBy'] = localStorage.getItem('userId');

            this.http.post(`${config.baseUrl}/tradingProgressInsert`,tradingProgressInsertData, headerOptions).subscribe(res =>{},err =>{});


            const tradingNotificationData =
            {
                fromUserId      :       localStorage.getItem('userId'),
                toUserId        :       this.brokerId,
                notification    :       this.message +' Fixture '+ this.tradingId,
                createdBy       :       localStorage.getItem('userId'),
                updatedBy       :       localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
            tradingNotificationData, headerOptions).subscribe(res =>{},err =>{});

            if(localStorage.getItem('userRoleId') == '4')
            {
                if(this.ownerId != '' && this.ownerId != null && this.ownerId != undefined)
                {
                    const tradingNotificationData =
                    {
                        fromUserId      :       localStorage.getItem('userId'),
                        toUserId        :       this.ownerId,
                        notification    :       this.message +' Fixture '+ this.tradingId,
                        createdBy       :       localStorage.getItem('userId'),
                        updatedBy       :       localStorage.getItem('userId')
                    };
                    this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                    tradingNotificationData, headerOptions).subscribe(res =>{},err =>{});
                }
            }

            if(localStorage.getItem('userRoleId') == '6')
            {
                if(this.chartererId != '' && this.chartererId != null && this.chartererId != undefined)
                {
                    const tradingNotificationData =
                    {
                        fromUserId      :       localStorage.getItem('userId'),
                        toUserId        :       this.chartererId,
                        notification    :       this.message +' Fixture '+ this.tradingId,
                        createdBy       :       localStorage.getItem('userId'),
                        updatedBy       :       localStorage.getItem('userId')
                    };
                    this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                    tradingNotificationData, headerOptions).subscribe(res =>{},err =>{});
                }
            }
            

            this.router.navigate(['/apps/trading-platform-management']);
        }
    }
     
   
    // Draw Data Update
    drawDataUpdate()
    {
        var convertedDate = moment(this.clauseFormValues.cpDate.value).format("YYYY-MM-DD");
        

        const req =
        {
            drawId: this.drawId,
            cpTime: this.clauseFormValues.cpTime.value,
            cpCity: this.clauseFormValues.cityId.value,
            cpDate: convertedDate,
            updatedBy: localStorage.getItem('userId')
        };
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/drawDataUpdate`, req, headerOptions).subscribe( res =>
        {
            this.drawProgressUpadte();
        });
    }

    // Draw Progress Update
    drawProgressUpadte()
    {
        const req =
        {
            id: this.drawId,
            broker_check: 20,
            updatedBy: localStorage.getItem('userId')
        };
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/drawProgressUpdate`, req, headerOptions).subscribe( res =>
        {
            this.drawStatusInfoUpdate();
        });
    }

    // Draw Existing Update
    drawExstingUpdate()
    {
        const req =
        {
            id: this.drawId,
            is_existing: 1,
            updatedBy: localStorage.getItem('userId')
        };
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/drawProgressUpdate`, req, headerOptions).subscribe( res =>
        {
            // this.drawStatusInfoUpdate();
        });
    }

    // Draw Status Information Update
    drawStatusInfoUpdate()
    {
        var statusInfoValue = 'Broker Updates';
        if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            statusInfoValue = 'Charterer Updates';
        }
        if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            statusInfoValue = 'Owner Updates';
        }
        const req =
        {
            drawId: this.drawId,
            statusInfo: statusInfoValue,
            updatedBy: localStorage.getItem('userId')
        };
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/drawStatusInfoUpdate`, req, headerOptions).subscribe( res =>
        {});
    }

    // check box    click and add
    checkclick(id)
    {
        let cid = id;
        this.check.push(cid);
    }

    // Check Clasue Terms
    get selectedOptions() { // right now: ['1','3']
    return this.options
              .filter(opt => opt.checked)
              .map(opt => opt.value)
    }

    

   
    clauseTermsCheck()
    {
        
    }
    
    // Custom Clause
    addCustomTermsOfCustomClauseToggleOpen(key,customClauseIDInfo): void
    {
        this.customClauseIDInfo = customClauseIDInfo;
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    addCustomTermsOfCustomClause() : void
    {
        if(this.customTermsOfCustomClause != '')
        {
            var clauseTermsArray = this.customClauseDataResponseData;
            

            var mainUserId = localStorage.getItem('userId');
            var companyId = localStorage.getItem('companyId');
            var drawId = this.drawId;
            var tradingId = this.tradingId;
            const req =
            {
                customCluaseCategoryId: this.customClauseIDInfo,
                customClauseTermsId: null,
                mainUserId: mainUserId,
                companyId: companyId,
                drawId: drawId,
                formId: this.formId,
                tradingId: tradingId,
                termsName : this.customTermsOfCustomClause,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/CustomClauseTermsInsert`, req, headerOptions).subscribe( res =>
            {
                this.customClauseDataResponse = res;
                if (this.customClauseDataResponse.success === true)
                {
                    this.alertService.success('Record Inserted Successfully', 'Success');
                    this._fuseSidebarService.getSidebar('addCustomTermsOfCustomClause').toggleOpen();
                    this.termsReviewRecords();
                } else {
                    this.alertService.error('Name Already Exist', 'Error');
                }
            });
        } else {
            this.alertService.error('Please Enter Custom Clause Term', 'Error');
        }
    }

     // Edit Custom Clause Term Of Custom Clause
     EditCustomClauseTermOfCustomClause(key, id, clauseid, parentID): void
     {
        this.customTermsOfCustomClauseEditID = id;
        this.customTermsOfCustomClauseEditCustomClauseID = clauseid;
        this.customTermsOfCustomClauseEditParentID = parentID;


        var filterCondition = {};
            filterCondition["id"] = id;

            
        
        try
        {
            this._userService.getCustomTermDataOfCustomClause(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.editCustomTermsOfCustomClauseResponse = res;
                if(this.editCustomTermsOfCustomClauseResponse.success == true)
                {
                    this.editCustomTermsOfCustomClauseResponseData = this.editCustomTermsOfCustomClauseResponse.data[0];
                    
                    this.customTermsOfCustomClauseEdit = this.editCustomTermsOfCustomClauseResponseData['termsName'];
                    
                }
            });
        }catch (err)
        {

        }
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    editCustomTermsOfCustomClause() : void
    {
        if(this.customTermsOfCustomClause != '')
        {
            var clauseTermsArray = this.customClauseDataResponseData;
            

            var mainUserId = localStorage.getItem('userId');
            var companyId = localStorage.getItem('companyId');
            var drawId = this.drawId;
            var tradingId = this.tradingId;
            const req =
            {
                customCluaseCategoryId: this.customTermsOfCustomClauseEditCustomClauseID,
                customClauseTermsId: this.customTermsOfCustomClauseEditParentID,
                mainUserId: mainUserId,
                companyId: companyId,
                drawId: drawId,
                formId: this.formId,
                tradingId: tradingId,
                termsName : this.customTermsOfCustomClauseEdit,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/CustomClauseTermsInsert`, req, headerOptions).subscribe( res =>
            {
                this.customClauseDataResponse = res;
                if (this.customClauseDataResponse.success === true)
                {
                    this.alertService.success('Record Inserted Successfully', 'Success');
                    this._fuseSidebarService.getSidebar('editCustomTermsOfCustomClause').toggleOpen();
                    this.termsReviewRecords();
                } else {
                    this.alertService.error('Name Already Exist', 'Error');
                }
            });

        } else {
            this.alertService.error('Please Enter Custom Clause Term', 'Error');
        }
    }
    
    // View Custom Terms Custom Updates Of Custom Clause
    ViewCustomTermsUpdatesOfCustomTermsOfCustomClause(key, parentID)
    {
        var filterCondition = {};
        filterCondition["customClauseTermsId"] = parentID;
        try
        {
            this._userService.viewCustomTermDataOfCustomClause(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.viewCustomTermsOfCustomClauseResponse = res;
                if(this.viewCustomTermsOfCustomClauseResponse.success == true)
                {
                    this.viewCustomTermsOfCustomClauseResponseData = this.viewCustomTermsOfCustomClauseResponse.data;
                    
                    this.dataSourceOfCustomTermsUpodateOfCustomTermsOfCustomClause = new MatTableDataSource(this.viewCustomTermsOfCustomClauseResponseData);
                    this.dataSourceOfCustomTermsUpodateOfCustomTermsOfCustomClause.paginator = this.paginator;
                    this.dataSourceOfCustomTermsUpodateOfCustomTermsOfCustomClause.sort = this.sort;

                    

                    this._fuseSidebarService.getSidebar(key).toggleOpen();
                }
            });
        } catch (err) {}
    }

    // Edit Clause Terms
    editClauseCategoryTermsOfMainClause(key, clauseTermsID, ClauseID)
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        
        var drawId = filter.drawId;
        var tradingId = filter.tradingId;
        var formID = filter.formId;
        var chartererId = filter.chartererId;
        var companyId = filter.companyId;
        var isTrading = filter.isTrading;

        this.editClauseTermOfMainClauseID = clauseTermsID;
        this.editClauseTermOfMainClauseCategoryID = ClauseID;

        var filterCondition = {};
            filterCondition["clauseTermsID"] = clauseTermsID;
            filterCondition["drawId"] = drawId;
            filterCondition["tradingId"] = tradingId;
            filterCondition["formID"] = formID;
            filterCondition["companyId"] = companyId;
            filterCondition["ClauseID"] = ClauseID;
        try
        {
            this._userService.getClauseTermDataForUpdate(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.editClauseTermOfMainClauseResponse = res;
                if(this.editClauseTermOfMainClauseResponse.success == true)
                {
                    this.editClauseTermOfMainClauseResponseData = this.editClauseTermOfMainClauseResponse.data;
                    

                    for (let index = 0; index < this.editClauseTermOfMainClauseResponseData.length; index++)
                    {
                        
                        this.editclausetext = this.editClauseTermOfMainClauseResponseData[index]['termsName'];
                    }

                    this._fuseSidebarService.getSidebar(key).toggleOpen();
                }
            });
        } catch (err) {}
    }

    // Clause Term Update Of Main Clause
    updateClauseTermOfMainClause()
    {
        var mainUserId = localStorage.getItem('userId');
        var companyId = localStorage.getItem('companyId');
        var drawId = this.drawId;
        var tradingId = this.tradingId;
        var formId = this.formId;
        var clauseCategoryId = this.editClauseTermOfMainClauseCategoryID;
        var clauseTermsId = this.editClauseTermOfMainClauseID;
        var nos = '1';
        var termsNameOrginal = this.tmpeditclausetext;
        var termsName = this.editclausetext;

        const req =
        {

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

        
        try
        {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(
                res => {
                    this.termsUpdateRes = res;
                    if (this.termsUpdateRes.success === true)
                    {
                        this._fuseSidebarService.getSidebar('editPanel').toggleOpen();
                        this.editclausetext = '';
                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) {}
    }

    // View Clause Terms Of Main Clause
    viewClauseCategoryTermsOfMainClause(key, clauseTermsID, ClauseID)
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        var drawId = filter.drawId;
        var tradingId = filter.tradingId;
        var formID = filter.formId;
        var companyId = filter.companyId;

        this.editClauseTermOfMainClauseID = clauseTermsID;
        this.editClauseTermOfMainClauseCategoryID = ClauseID;

        var filterCondition = {};
            filterCondition["clauseTermsID"] = clauseTermsID;
            filterCondition["drawId"] = drawId;
            filterCondition["tradingId"] = tradingId;
            filterCondition["formID"] = formID;
            filterCondition["companyId"] = companyId;
            filterCondition["ClauseID"] = ClauseID;
        try
        {
            this._userService.viewClauseTermUpdateRecordsOfMainClause(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.viewClauseTermOfMainClauseResponse = res;
                if(this.viewClauseTermOfMainClauseResponse.success == true)
                {
                    this.viewClauseTermOfMainClauseResponseData = this.viewClauseTermOfMainClauseResponse.data;
                    this.dataSource = new MatTableDataSource(this.viewClauseTermOfMainClauseResponseData);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this._fuseSidebarService.getSidebar(key).toggleOpen();
                }
            });
        } catch (err) {}
    }

    // Edit Custom Clause Terms
    editCustomClauseCategoryTermsOfMainClause(key, clauseTermsID, ClauseID)
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        
        this.editCustomClauseTermOfMainClauseID = clauseTermsID;
        this.editCustomClauseTermOfMainClauseCategoryID = ClauseID;

        var filterCondition = {};
            filterCondition["id"] = clauseTermsID;
        try
        {
            this._userService.getCustomClauseTermDataForUpdate(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.editCustomClauseTermOfMainClauseResponse = res;
                if(this.editCustomClauseTermOfMainClauseResponse.success == true)
                {
                    this.editCustomClauseTermOfMainClauseResponseData = this.editCustomClauseTermOfMainClauseResponse.data;
                    

                    for (let index = 0; index < this.editCustomClauseTermOfMainClauseResponseData.length; index++)
                    {
                        
                        this.editCustomClauseTermDataInput = this.editCustomClauseTermOfMainClauseResponseData[index]['termsName'];
                    }

                    this._fuseSidebarService.getSidebar(key).toggleOpen();
                }
            });
        } catch (err) {}
    }

    // Custom Clause Term Update Of Main Clause
    updateCustomClauseTermOfMainClause()
    {
        var mainUserId = localStorage.getItem('userId');
        var companyId = localStorage.getItem('companyId');
        var drawId = this.drawId;
        var tradingId = this.tradingId;
        var formId = this.formId;
        var clauseCategoryId = this.editCustomClauseTermOfMainClauseCategoryID;
        var parentId = this.editCustomClauseTermOfMainClauseID;
        var nos = '1';
        var termsNameOrginal = this.tmpeditclausetext;
        var termsName = this.editCustomClauseTermDataInput;

        const req =
        {

            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
            formId: formId,
            clauseCategoryId: clauseCategoryId,
            parentId: this.editCustomClauseTermOfMainClauseID,
            nos: nos,
            termsNameOrginal: termsNameOrginal,
            termsName: termsName,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
            isCustom: 'Y'
        };

        if (this.isTrading == '1') {
            const req =
            {
                mainUserId: mainUserId,
                companyId: companyId,
                tradingId: tradingId,
                formId: formId,
                clauseCategoryId: clauseCategoryId,
                parentId: this.editCustomClauseTermOfMainClauseID,
                nos: nos,
                termsNameOrginal: termsNameOrginal,
                termsName: termsName,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                isCustom: 'Y'
            };
        }

        try
        {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/customClauseDetailsInsert`, req, headerOptions).subscribe(
                res => {
                    this.termsUpdateRes = res;
                    if (this.termsUpdateRes.success === true)
                    {
                        this._fuseSidebarService.getSidebar('editCustomClauseTerm').toggleOpen();
                        this.editCustomClauseTermDataInput = '';
                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) {}
    }

    // View Custom Clause Terms Updates
    viewCustomClauseCategoryTermsUpdateOfMainClause(key, clauseTermsID, ClauseID)
    {
        var filterCondition = {};
            filterCondition["parentId"] = clauseTermsID;
        try
        {
            this._userService.viewCustomClauseTermUpdateRecordsOfMainClause(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.viewClauseTermOfMainClauseResponse = res;
                if(this.viewClauseTermOfMainClauseResponse.success == true)
                {
                    this.viewClauseTermOfMainClauseResponseData = this.viewClauseTermOfMainClauseResponse.data;
                    this.dataSource = new MatTableDataSource(this.viewClauseTermOfMainClauseResponseData);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this._fuseSidebarService.getSidebar(key).toggleOpen();
                }
            });
        } catch (err) {}
    }
}