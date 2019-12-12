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

    drawResponse: any;

    tradingResponse : any;

    commonClausesArray = [];
    commonClausesCustomArray = [];
    commonClausesCustomClauseTermArray = [];

    counterIdInfo: any;

    reviewData = [];

    tradingId: String;
    customClause: String;
    isTrading: String;
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


    cityManagementRes: any;
    cityManagementData = [];

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

    cpTime: string;
    cityId: string;
    cpDate: string;
    formId: string;
    pageTitle: String;
    OwnersFirstCounterForm: FormGroup;
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

    tradingResponseInformation : any;
    tradingResponseInformationData = [];

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

    firstScreen = true;
    secondScreen = false;
    thirdScreen = false;

    thirdScreenButton = false;

    drawId: String;


    ownerName : string;
    chartererName : string;
    brokerName : string;

    cpFormResponse : any;
    cpFormDataResponseData = [];

    
    
    vesselDataResponse : any;
    vesselDataResponseArray = [];

    cpFormName :  any;
    cityName : string;
    
    vesselId : string;

    vesselName : string;
    imoNumber : string;
    vesselFlag : string;
    vesselYear : string;
    vesselDescription : string;

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

    ngOnInit()
    {
        // this.dynamicInputForDatePicker = 1;
        // var dynamicInput = this.dynamicInputForDatePicker + 1;

        // var string = "#date this is datepicker";

        // var dateString = '<input [matDatepicker]="demoDatePicker'+dynamicInput+'"><mat-datepicker-toggle matSuffix [for]="demoDatePicker'+dynamicInput+'"></mat-datepicker-toggle><mat-datepicker #demoDatePicker'+dynamicInput+'></mat-datepicker>';

        // var newstr = string.replace("#date", dateString); 
        // console.log(newstr)

        // this.convrtedString = newstr;
            
        this.ownerName = '';
        this.chartererName = '';
        this.brokerName = '';

        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        console.log(filter);
        this.drawId = filter.drawId;
        this.formId = filter.formId;
        this.tradingId = filter.tradingId;
        this.isTrading = filter.isTrading;

        var current_date = moment(new Date()).format("YYYY-MM-DD")
        var current_time = moment().format("HH:mm A");
        this.OwnersFirstCounterForm = this._formBuilder.group
        (
            {
                cpTime: [current_time, Validators.required],
                cityId: ['', Validators.required],
                cpDate: [current_date, Validators.required],
            }
        );

        this.formId = localStorage.getItem('formId');
        this.companyId = localStorage.getItem('companyId');

        this.cityRecords();
        
        if (JSON.parse(localStorage.getItem('userRoleId')) == '3')
        {
            if(filter.isTrading == '2')
            {
                this.pageTitle = 'Draw C/P Clauses';
            } else {
                this.pageTitle = 'Trading Clauses';
            }
            
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            this.pageTitle = 'Charterer First Counter';
            this.getCounterNumber();
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            this.pageTitle = 'Owner First Counter';
            this.getCounterNumber();
        }
        
        this.clauseTermNumber = 1;

        if(filter.isTrading == '2')
        {
            this.fetchDrawDataRecap();
        } else {
            console.log('Here In Condition');
            // this.thirdScreenView();
            this.fetchTradingDataRecap();
            // this.fetchDrawData();
            // this.fetchTradingData();
        }
        this.clauseTermsCheckBox = true;
        this.cpFormData();
    }

    dateMonthYearFormatFunction(date)
    {
        var dateInfo = moment(date).format("Do");
        console.log(dateInfo," Date Info ");

        var monthInfo = moment(date).format("MMM");
        console.log(monthInfo," Month Info ");

        var yearInfo = moment(date).format("YYYY");
        console.log(yearInfo," Year Info ");

        var string = 'this '+dateInfo+' of '+ monthInfo+','+yearInfo;
        console.log(string);

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
        console.log(req);
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
        console.log(req);
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/customInputTradingDataUpdate`, req, headerOptions).subscribe( res =>
        {
            
        });
    }

     // CP Form Datga
     cpFormData()
     {
         var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
         this.formId = filter.formId;
 
         var filterCondition = {};
             filterCondition['id'] = this.formId;
         try
         {
             this._userService.cpFormData(filterCondition).pipe(first()).subscribe((res) =>
             {
                 this.cpFormResponse = res;
                 if(this.cpFormResponse.success == true)
                 {
                     this.cpFormDataResponseData = this.cpFormResponse.data;
                     console.log(this.cpFormDataResponseData);
                     this.cpFormName = this.cpFormDataResponseData[0].cpformName;
                     console.log(this.cpFormName);
                 }
             });
         }catch (err){}
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

                    console.log(current_date);

                    this.OwnersFirstCounterForm = this._formBuilder.group
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

                    console.log(checked_clauses);

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

                    console.log(this.checkedClauseCategory," Main Checked CLause Categogry CHeckBox  ");

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

    // Fetch Draw Data
    fetchDrawDataRecap()
    {
        console.log('HERE IN FIRST FETCH DRAW DATA RECAP');
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

                    console.log(current_date);

                    this.OwnersFirstCounterForm = this._formBuilder.group
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

                    this.clauseCategoryRecordsServerSideRecap();
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
                this.tradingResponseInformation = res;
                if(this.tradingResponseInformation.success == true)
                {
                    this.tradingResponseInformationData = this.tradingResponseInformation.data[0];

                    this.tradingResponseInformationData['cpCity'] = (this.tradingResponseInformationData['cpCity'] == null && this.tradingResponseInformationData['cpCity'] == '') ? '' : this.tradingResponseInformationData['cpCity'];

                    var cpTime = this.tradingResponseInformationData['cpTime'];
                    var cpDate = this.tradingResponseInformationData['cpDate'];
                    var cpCity = this.tradingResponseInformationData['cpCity'];
                    var cityName = this.tradingResponseInformationData['cityName'];

                    var current_date = (cpDate != '') ? cpDate : moment(new Date()).format("YYYY-MM-DD")
                    var current_time = (cpTime != '') ? cpTime : moment().format("HH:mm A");
                    var cityID = (cpCity != '') ? cpCity : '0';

                    console.log(current_date);

                    this.OwnersFirstCounterForm = this._formBuilder.group
                    (
                        {
                            cpTime: [current_time, Validators.required],
                            cityId: [cityID, Validators.required],
                            cpDate: [current_date, Validators.required],
                        }
                    );

                    this.cpDate = current_date;

                    this.checkedClauseCategoryRecap = [];

                    var checked_clauses = this.tradingResponseInformation.data[0].checked_clauses;
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

                    this.ownerName = this.tradingResponseInformation.data[0].ownerName;
                    this.chartererName = this.tradingResponseInformation.data[0].chartererName;
                    this.brokerName = this.tradingResponseInformation.data[0].brokerName;

                    var cpTime = this.tradingResponseInformationData['cpTime'];
                    var cpDate = this.tradingResponseInformationData['cpDate'];
                    var cityName = this.tradingResponseInformationData['cityName'];

                    current_date = (cpDate != '') ? moment(cpDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
                    var current_time = (cpTime != '') ? cpTime : moment().format("HH:mm A");
                    var cityID = (cityName != '') ? cityName : '0';

                    this.cpDate = current_date;

                    this.cityName = cityName;
                    this.cpDate = current_date;
                    this.cpTime = cpTime;

                    this.ownerName = this.tradingResponseInformation.data[0].ownerName;
                    this.chartererName = this.tradingResponseInformation.data[0].chartererName;
                    this.brokerName = this.tradingResponseInformation.data[0].brokerName;

                    this.vesselId = this.tradingResponseInformation.data[0].vesselId;

                    this.dateMonthYearString = this.dateMonthYearFormatFunction(this.cpDate);

                    this.metricTonValue = this.tradingResponseInformation.data[0].metricTonValue;
                    this.customInput1 = this.tradingResponseInformation.data[0].customInput1;
                    this.customInput2 = this.tradingResponseInformation.data[0].customInput2;

                    this.currentSignature1 = this.tradingResponseInformation.data[0].signature1;
                    this.currentSignature2 = this.tradingResponseInformation.data[0].signature2;

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

                    this.clauseCategoryRecordsServerSideRecap();
                }
            });
        }catch (err){}
    }
    
    // Fetch Vessel Data
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
                    this.vesselDataResponseArray = this.vesselDataResponse.data[0];
                    
                    this.vesselName = this.vesselDataResponse.data[0].vessel_name;
                    this.imoNumber = this.vesselDataResponse.data[0].imo;
                    this.vesselFlag = this.vesselDataResponse.data[0].flageName;
                    this.vesselYear = this.vesselDataResponse.data[0].built_year;
                    this.vesselDescription = this.vesselDataResponse.data[0].vessel_info;
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
        
            console.log(filterCondition,"Clause Category Server Side Record");
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
                    console.log(this.checkedClauseCategoryRecap);
                    this.termsReviewRecordsRecap();
                }
            });
        }catch (err){}
    }

    // Clause Category Records Server Side
    clauseCategoryRecordsServerSide()
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));

        var filterCondition = {};
            filterCondition['cpFormId'] = filter.formId;
            filterCondition['checkedClauseCategory'] = this.checkedClauseCategory;
        
        try
        {
            this._userService.clauseCategoryRecordsServerSide(filterCondition).pipe(first()).subscribe((res) =>
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

    

    // First Screen View
    firstScreenView()
    {
        this.firstScreen = true;
        this.secondScreen = false;
        this.thirdScreen = false;
    }

    // Second Screen View
    secondScreenView()
    {
        this.firstScreen = false;
        this.secondScreen = true;
        this.thirdScreen = false;
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        this.isTrading = filter.isTrading;

        if(filter.isTrading == '2')
        {
            this.customInputDrawDataUpdate();
            this.fetchDrawData();    
        } else {
            this.customInputTradingDataUpdate();
            this.fetchTradingData();
        }
    }

    // Third Screen View
    thirdScreenView()
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        console.log(filter);
        this.drawId = filter.drawId;
        this.formId = filter.formId;
        this.tradingId = filter.tradingId;
        this.isTrading = filter.isTrading;
        if(filter.isTrading == '2')
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
                this.secondScreen = false;
                this.thirdScreen = true;
                this.termsReviewRecords();
            });
        } else {
            this.firstScreen = false;
            this.secondScreen = false;
            this.thirdScreen = true;
            // console.log('Here In Condition');
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

    get f() { return this.OwnersFirstCounterForm.controls; }

    


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

        console.log(this.checkedClauseCategory);

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

        console.log(this.checkedClauseCategory);

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
                    this.pageTitle = 'Charterer '+this.NumInWords(this.counterResponse.data.counterNumber)+' Counter';
                }
        
                if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
                {
                    this.pageTitle = 'Owner '+this.NumInWords(this.counterResponse.data.counterNumber)+' Counter';
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

    // Fetch City Records Start
    cityRecords(): void
    {
        try {
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
                err => {
                    this.alertService.error(err, 'Error');
                });
        } catch (err) {}
    }

    changeCity(event): void
    {
        this.cityId = event.target.value;
    }
    // Fetch City Records End

    // Main Array
    termsReviewRecordsRecap(): void
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        console.log(filter);
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
            console.log(clauseCategoryFilterCondition,"Review Record mainClauseScreenDataRecords");
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

						console.log(this.termsReviewRecordsDataRecap);
                    }
                },
                    err => {
                        this.alertService.error(err, 'Error');
                    });
            } catch (err) { }
            this.drawProgressUpadte();
        } else {
            var clauseCategoryFilterCondition = {};
            clauseCategoryFilterCondition["cpFormId"] = formID;
            clauseCategoryFilterCondition["tradingId"] = tradingId;
            clauseCategoryFilterCondition["companyId"] = companyId;
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

            this.tradingProgressUpdate();
        }
        
    }

    // Main Data Record Fetch Start
    termsReviewRecords(): void
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        
        var drawId = filter.drawId;
        var tradingId = filter.tradingId;
        var formID = filter.formId;
        var chartererId = filter.chartererId;
        var companyId = filter.companyId;
        var isTrading = filter.isTrading;

        this.tradingId = tradingId;
        this.drawId = drawId;
        this.formId = formID;
        this.chartererId = chartererId;

        localStorage.setItem('tradingId', tradingId);
        localStorage.setItem('drawId', drawId);
        localStorage.setItem('cpFormId', formID);

        this.commonClausesArray = [];
        localStorage.setItem('commonClausesArray', JSON.stringify(this.commonClausesArray));

        this.commonClausesCustomArray = [];
        localStorage.setItem('commonClausesCustomArray', JSON.stringify(this.commonClausesCustomArray));

        this.commonClausesCustomClauseTermArray = [];
        localStorage.setItem('commonClausesCustomClauseTermArray', JSON.stringify(this.commonClausesCustomClauseTermArray));

        if (isTrading == '2')
        {
            var drawCondition = {};
                drawCondition["dcm.id"] = drawId;

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

                        console.log(cpDate);
                        console.log(cpTime);
                        console.log(cpCity);

                        var current_date = (cpDate != '' && cpDate != null) ? cpDate : moment(new Date()).format("YYYY-MM-DD")
                        var current_time = (cpTime != '' && cpTime != null) ? cpTime : moment(new Date()).format("HH:mm A");
                        var cityID = (cpCity != '' && cpCity != null) ? cpCity : '0';

                        console.log(current_date);
                        console.log(current_time);
                        console.log(cityID);

                        this.OwnersFirstCounterForm = this._formBuilder.group
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

                        console.log(this.checkedClauseCategory);
                        
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
                            clauseCategoryFilterCondition["cpFormId"] = formID;
                            clauseCategoryFilterCondition["drawId"] = drawId;
                            clauseCategoryFilterCondition["companyId"] = companyId;
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
                                    this.termsReviewRecordsData = this.termsReviewRecordsResponse.data;
                                    console.log("test",this.termsReviewRecordsData);
                                    
                                    var totalCount = 0;
                                    for (let index = 0; index < this.termsReviewRecordsData.length; index++)
                                    {
                                        totalCount = totalCount + 1;
                                        for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++)
                                        {
                                            this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                                        }
                                        for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; sindex++)
                                        {
                                            this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindex]['identifier'] = String.fromCharCode(97 + sindex);
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
                drawCondition["id"] = tradingId;
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
                        
                        this.OwnersFirstCounterForm = this._formBuilder.group
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

                        // var checkedCheckBoxArray = this.checkedClauseCategory;
                        // var startLength = 0;
                        // var endLength = 0;
                        // for (let index = 0; index < this.clauseCategoryRecordResponseData.length; index++)
                        // {
                        //     startLength = startLength + 1;
                        //     if(checkedCheckBoxArray.indexOf(this.clauseCategoryRecordResponseData[index].id) >= 0)
                        //     {
                        //         endLength = endLength + 1;
                        //     }
                        // }
                        // this.clauseCategoryRecordResponseDataAllChecked =  'N';
                        // if (startLength == endLength )
                        // {
                        //     this.clauseCategoryRecordResponseDataAllChecked =  'Y';
                        // }

                        this.termsReviewRecordsData = [];
            
                        var clauseCategoryFilterCondition = {};
                            clauseCategoryFilterCondition["cpFormId"] = formID;
                            clauseCategoryFilterCondition["tradingId"] = tradingId;
                            clauseCategoryFilterCondition["companyId"] = companyId;
                            clauseCategoryFilterCondition["commonClauses"] = commonClausesArray;
                            clauseCategoryFilterCondition["commonClausesCustomArray"] = commonClausesCustomArray;
                            clauseCategoryFilterCondition["checked_clauses"] = this.checkedClauseCategory;

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
                                            this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                                        }
                                        for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; sindex++)
                                        {
                                            this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindex]['identifier'] = String.fromCharCode(97 + sindex);
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
                            this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                        }
                        for (let sindex = 0; sindex < this.customClauseDataResponseData[index].clauseCategoryTermsUpdateCustom.length; sindex++)
                        {
                            this.customClauseDataResponseData[index].clauseCategoryTermsUpdateCustom[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                        }
                    }
                    
                    console.log(this.customClauseDataResponseData,"Clause Category Records Server Side");

                    this.checkAllFunctionChecked();

                }
            })
        } catch (err) { }
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
                    
                    console.log(this.customClauseDataResponseData,"Clause Category Records Server Side");

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
        var fromUserId = localStorage.getItem('userId');
        var notification = 'New Draw Charter Party Available';
        var toUserId = this.chartererId;
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        var isTrading = filter.isTrading;
        this.isTrading = filter.isTrading;
        let borkerName: 'broker3';
        let formName :'NYPE 2015'
        this.drawId = filter.drawId;

        var checkedCheckBox = this.checkedCheckBox.join();
        var checkedCheckBoxCustom = this.checkedCheckBoxCustom.join();
        var checkedCheckBoxCustomClauseTerms = this.checkedCheckBoxCustomClauseTerms.join();

        

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
                    notification: this.brokerName+ 'creates charter party form' + formName,
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
            const reqData =
            {
                tradingId: this.tradingId,
                chartererId: toUserId,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
            }
            this._userService.TradingPlatformRequestToChartererCreate(reqData).pipe(first()).subscribe(
            data => {
                this.submitResponse = data;
                const req =
                {
                    fromUserId: localStorage.getItem('userId'),
                    toUserId: toUserId,
                    notification: this.brokerName+'creates charter party form'+ formName,
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
                    res =>
                    {});
                } catch (err) {}
            });

            const req =
            {
                tradingId : this.tradingId,
                userId: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                createdBy: localStorage.getItem('userId')
            };
            try {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/TradingCounterInsert`, req, headerOptions).subscribe(res => {});
            } catch (err) {}

            this.tradingDataUpdate();

            this.tradingProgressUpdate();
            

            if (JSON.parse(localStorage.getItem('userRoleId')) == '3')
            {
                const req =
                {
                    id : this.tradingId,
                    broker_clauses: checkedCheckBox,
                    common_clauses: checkedCheckBox,
                    custom_term_clause: checkedCheckBoxCustom,
                    custom_common_clause: checkedCheckBoxCustomClauseTerms,
                    updatedBy: localStorage.getItem('userId')
                };
                try {
                    const header = new HttpHeaders();
                    header.append('Content-Type', 'application/json');
                    const headerOptions =
                    {
                        headers: header
                    }
                    this.http.post(`${config.baseUrl}/tradingFormUpdateByBrokerCheck`, req, headerOptions).subscribe(
                    res =>
                    {
                        this.router.navigate(['/apps/trading-platform-management']);
                    });
                } catch (err) {}
            }

            if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
            {
                const req =
                {
                    id : this.tradingId,
                    charterer_clauses: checkedCheckBox,
                    common_clauses: checkedCheckBox,
                    custom_term_clause: checkedCheckBoxCustom,
                    custom_common_clause: checkedCheckBoxCustomClauseTerms,
                    updatedBy: localStorage.getItem('userId')
                };
                try {
                    const header = new HttpHeaders();
                    header.append('Content-Type', 'application/json');
                    const headerOptions =
                    {
                        headers: header
                    }
                    this.http.post(`${config.baseUrl}/tradingFormUpdateByChartererCheck`, req, headerOptions).subscribe(
                    res =>
                    {
                        this.router.navigate(['/apps/trading-platform-management']);
                    });
                } catch (err) {}
            }

            if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
            {
                const req =
                {
                    id : this.tradingId,
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
                    this.http.post(`${config.baseUrl}/tradingFormUpdateByOwnerCheck`, req, headerOptions).subscribe(
                    res =>
                    {
                        this.router.navigate(['/apps/trading-platform-management']);
                    });
                } catch (err) {}
            }
        }

        
    }

    

     // Fetch Trading Data
     fetchTradingData ()
     {
         var filterCondition = {};
             filterCondition["dcm.id"] = this.tradingId;
         try
         {
             this._userService.fetchTradingData(filterCondition).pipe(first()).subscribe((res) =>
             {
                 this.tradingResponseInformation = res;
                 if(this.tradingResponseInformation.success == true)
                 {
                     this.tradingResponseInformationData = this.tradingResponseInformation.data[0];
 
                     this.tradingResponseInformationData['cpCity'] = (this.tradingResponseInformationData['cpCity'] == null && this.tradingResponseInformationData['cpCity'] == '') ? '' : this.tradingResponseInformationData['cpCity'];
 
                     var cpTime = this.tradingResponseInformationData['cpTime'];
                     var cpDate = this.tradingResponseInformationData['cpDate'];
                     var cpCity = this.tradingResponseInformationData['cpCity'];

                     var current_date = (cpDate != '' && cpDate != null) ? moment(cpDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
                     var current_time = (cpTime != '' && cpTime != null) ? moment(cpTime).format("YYYY-MM-DD") : moment().format("HH:mm A");
                     var cityID = (cpCity != '') ? cpCity : '0';

                     this.OwnersFirstCounterForm = this._formBuilder.group
                     (
                         {
                             cpTime: [current_time, Validators.required],
                             cityId: [cityID, Validators.required],
                             cpDate: [current_date, Validators.required],
                         }
                     );

                    this.cpDate = current_date;

                    this.checkedClauseCategory = [];
                    var checked_clauses = this.tradingResponseInformation.data[0].checked_clauses;
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

                    this.ownerName = this.tradingResponseInformation.data[0].ownerName;
                    this.chartererName = this.tradingResponseInformation.data[0].chartererName;
                    this.brokerName = this.tradingResponseInformation.data[0].brokerName;

                    this.clauseCategoryRecordsServerSide();

                    var cpTime = this.tradingResponseInformation['cpTime'];
                    var cpDate = this.tradingResponseInformation['cpDate'];
                    var cityName = this.tradingResponseInformation['cityName'];

                    current_date = (cpDate != '') ? moment(cpDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
                    current_time = (cpTime != '') ? cpTime : moment(new Date()).format("HH:mm A");
                    var cityID = (cityName != '') ? cityName : '0';

                    this.cpDate = current_date;

                    this.cityName = cityName;
                    this.cpDate = current_date;
                    this.cpTime = current_time;

                    this.ownerName = this.tradingResponseInformation.data[0].ownerName;
                    this.chartererName = this.tradingResponseInformation.data[0].chartererName;
                    this.brokerName = this.tradingResponseInformation.data[0].brokerName;

                    this.vesselId = this.tradingResponseInformation.data[0].vesselId;

                    this.fetchVesselData();

                    //  this.termsReviewRecords();
 
                 }
             });
         }catch (err){}
     }

    // Trading Data Update
    tradingDataUpdate()
    {
        var convertedDate = moment(this.f.cpDate.value).format("YYYY-MM-DD");
        
        const req =
        {
            tradingId: this.tradingId,
            cpTime: this.f.cpTime.value,
            cpCity: this.f.cityId.value,
            cpDate: convertedDate,
            updatedBy: localStorage.getItem('userId')
        };
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/tradingDataUpdate`, req, headerOptions).subscribe( res =>
        {
            this.tradingProgressUpdate();
        });
    }

    setCPDate(event)
    {
        
        
    }

    // Draw Data Update
    drawDataUpdate()
    {
        var convertedDate = moment(this.f.cpDate.value).format("YYYY-MM-DD");
        

        const req =
        {
            drawId: this.drawId,
            cpTime: this.f.cpTime.value,
            cpCity: this.f.cityId.value,
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

    // Trading Progress Update
    tradingProgressUpdate()
    {
        const req =
        {
            tradingId: this.tradingId,
            updatedBy: localStorage.getItem('userId')
        };
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/tradingProgressUpdate`, req, headerOptions).subscribe( res =>
        {
            this.tradingStatusInfoUpdate();
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

    // Trading Status Information Update
    tradingStatusInfoUpdate()
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
            tradingId: this.tradingId,
            statusInfo: statusInfoValue,
            updatedBy: localStorage.getItem('userId')
        };
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/tradingStatusInfoUpdate`, req, headerOptions).subscribe( res =>
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