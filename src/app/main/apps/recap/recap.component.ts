import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { UserService } from '../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';
import {FormGroupDirective, NgForm,} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import * as moment from 'moment';

import { SignaturePad } from 'angular2-signaturepad/signature-pad';

// import { SignaturePad } from 'angular2-signaturepad/signature-pad';

export interface PeriodicElement
{
    name: String,
    Date: Date,
    ClauseTracker: String;
}

@Component(
{
  	selector: 'app-recap',
  	templateUrl: './recap.component.html',
  	styleUrls: ['./recap.component.scss']
})

export class RecapComponent implements OnInit
{

    displayedColumns: string[] = ['name', 'Date', 'clauseTracker'];

    dataSource = new MatTableDataSource<PeriodicElement>();
    dataSourcecustom = new MatTableDataSource<PeriodicElement>();

    dataSourceFilter = new MatTableDataSource<PeriodicElement>();
    dataSourcecustomFilter = new MatTableDataSource<PeriodicElement>();
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.dataSourcecustom.filter = filterValue.trim().toLowerCase();
    }

    applyFilterExecuted(filterValue: string) {
        this.dataSourceFilter.filter = filterValue.trim().toLowerCase();
        this.dataSourcecustomFilter.filter = filterValue.trim().toLowerCase();
    }

    // dataSource:any;
    drawcluases = [];
    drawManagementRes: any;
    clusesId = [];
    viewtable: false;

    termsReviewRecordsResponse: any;
    termsReviewRecordsData = [];

    clauseCategoryTermsResponse: any;
    clauseCategoryTermsData = [];

    clauseCategoryTermsReviewResponse: any;
    clauseCategoryTermsReviewData = [];

    clauseCategoryTermsReviewResponseCustom: any;
    clauseCategoryTermsReviewDataCustom = [];

    customClauseDataResponse : any;
    customClauseDataResponseData = [];

    totalTermsReviewRecords : any;

    flag = 1;
    nextStatus = true;
    termsUpdateRes: any;
    customClause: String;
    parentId: String;
    tempedit: any;
    editclausetext: String;
    editclauses = [];
    editid: String;
    tmpeditclausetext: String;
    newClause = [];
    clauses = [];
    ceditid: String;
    tmpceditclausetext: String;
    viewData = [];
    viewCustomData = [];
    pageTitle: String;
    notifiactionres: any;

    customClauseID: string;

    tradingId : string;
    drawId : string;
    formId : string;
    chartererId : string;

    isTrading : string;

    submitResponse : any;

    checkedClauseCategory = [];
    clauseCategoryRecordResponse : any;
    clauseCategoryRecordResponseData = [];

    cpFormResponse : any;
    cpFormDataResponseData = [];

    drawResponseInformation : any;
    drawResponseInformationData = [];

    tradingResponseInformation : any;
    tradingResponseInformationData = [];

    vesselDataResponse : any;
    vesselDataResponseArray = [];

    cpFormName :  any;

    cityName : string;
    cpDate : string;
    cpTime : string;

    vesselId : string;

    ownerName : string;
    chartererName : string;
    brokerName : string;

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

    nonPrintView = true;
    printView = false;

    signature1Response : any;
    signature2Response : any;

    currentSignature1 : any;
    currentSignature2 : any;

    signature1ImageView = true;
    signature1NonImageView = false;

    signature2ImageView = true;
    signature2NonImageView = false;

    signature1MainImageView = false;
    signature2MainImageView = false;

    selectedSignature : any;

    updateSignatureButtonViewCharterer = false;
    updateSignatureButtonViewOwner = false;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    @ViewChild( SignaturePad, { static: false }) signaturePad: SignaturePad;

    ngAfterViewInit()
    {
        this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
        this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    }

    signatureReset()
    {
        console.log('here');
        this.signaturePad.clear();
    }

    signatureImageView()
    {
        this.signaturePad.clear();
        this.signature1ImageView = true;
        this.signature1NonImageView = false;
    }

    signmatureNonImageViwe(type)
    {
        this.signaturePad.clear();
        this.selectedSignature = type;
        this.signature1NonImageView = !this.signature1NonImageView;
    }
    
    
    drawComplete()
    {
    // will be notified of szimek/signature_pad's onEnd event
        // console.log(this.signaturePad.toDataURL());
    }
    
    drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    // console.log('begin drawing');
    }

    saveSignature()
    {
        // this.signature1ImageView = true;
        this.signature1NonImageView = !this.signature1NonImageView;
        var selectedSignature = this.selectedSignature;
        if(selectedSignature == '1')
        {
            this.signature1MainImageView = true;
            this.currentSignature1 = this.signaturePad.toDataURL();
        } else {
            this.signature2MainImageView = true;
            this.currentSignature2 = this.signaturePad.toDataURL();
        }

        this.defaultSignatureUpdate();
    }

    public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
        'minWidth': 5,
        'canvasWidth': 510,
        'canvasHeight': 300,
        // 'backgroundColor' : '#00000012'
      };

    /**
     * Constructor
     *  @param {ContactsService} _contactsService
     *  @param {FuseSidebarService} _fuseSidebarService
     *  @param {MatDialog} _matDialog
    */

    constructor
        (
            private _userService: UserService,
            private _fuseSidebarService: FuseSidebarService,
            private http: HttpClient,
            private alertService: AlertService,
            private router: Router
        ) {
        this.dataSource = new MatTableDataSource(this.termsReviewRecordsData);
        this.dataSourcecustom = new MatTableDataSource(this.termsReviewRecordsData);
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        this.dataSourcecustom.paginator = this.paginator;
        this.dataSourcecustom.sort = this.sort;

		this.pageTitle = 'Draw CP Recap';

        this.currentSignature1 = '';

        this.clauseCategoryRecordsServerSide();
        this.cpFormData();

        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        this.drawId = filter.drawId;
        this.tradingId = filter.tradingId;
        var isTrading = filter.isTrading;

        if(isTrading == '2')
        {
            this.fetchDrawData();
            this.drawStatusInfoUpdate();
        } else {
            this.fetchTradingData();
        }
        
    }

     // Custom Input Draw Data Update
     customInputDrawDataUpdate()
     {
         const req =
         {
             drawId : this.drawId,
             metricTonValue: this.metricTonValue,
             customInput1: this.customInput1,
             customInput2: this.customInput2,
         };
         console.log(req);
         const header = new HttpHeaders();
         header.append('Content-Type', 'application/json');
         const headerOptions = { headers: header }
         this.http.post(`${config.baseUrl}/customInputDrawDataUpdate`, req, headerOptions).subscribe( res =>
         {
            this.drawDataSignatureUpadate();
         });
    }
    
    // signatureUpdate
    defaultSignatureUpdate()
    {   
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        this.drawId = filter.drawId;
        this.tradingId = filter.tradingId;
        var isTrading = filter.isTrading;

        if(isTrading == '2')
        {
            const req =
            {
                drawId : this.drawId,
                signature1: this.currentSignature1,
                signature2: this.currentSignature2,
            };
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/drawDataSignatureUpadate`, req, headerOptions).subscribe( res =>
            {
                
            });

            var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
            this.drawId = filter.drawId;

            if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
            {
                const newReq =
                {
                    id: this.drawId,
                    charterer_signed_check: 20,
                    statusInfo: 'Charterer Signed',
                    updatedBy: localStorage.getItem('userId')
                };
                this.http.post(`${config.baseUrl}/drawProgressUpdate`, newReq, headerOptions).subscribe( res =>
                {
                });
            }

            if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
            {
                const newReq =
                {
                    id: this.drawId,
                    owner_signed_check: 20,
                    statusInfo: 'Owner Signed',
                    updatedBy: localStorage.getItem('userId')
                };
                this.http.post(`${config.baseUrl}/drawProgressUpdate`, newReq, headerOptions).subscribe( res =>
                {
                });
            }
            

        } else {
            const req =
            {
                tradingId : this.tradingId,
                signature1: this.currentSignature1,
                signature2: this.currentSignature2,
            };
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/tradingDataSignatureUpadate`, req, headerOptions).subscribe( res =>
            {

            });
        }
    }


    // Draw Data Signature Update
    drawDataSignatureUpadate()
    {
        const req =
        {
            drawId : this.drawId,
            signature1: this.currentSignature1,
            signature2: this.currentSignature2,
        };
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/drawDataSignatureUpadate`, req, headerOptions).subscribe( res =>
        {
        var printContents = document.getElementById('printDiv').innerHTML;
        var popupWin = window.open('', '_blank', 'width=1024,height=768');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
        });
    }

    // Trading Data Signature Update
    tradingDataSignatureUpadate()
    {
        const req =
        {
            tradingId : this.tradingId,
            signature1: this.currentSignature1,
            signature2: this.currentSignature2,
        };
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/tradingDataSignatureUpadate`, req, headerOptions).subscribe( res =>
        {
        var printContents = document.getElementById('printDiv').innerHTML;
        var popupWin = window.open('', '_blank', 'width=1024,height=768');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
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
           this.tradingDataSignatureUpadate();
        });
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

    

    dataURItoBlob(dataURI)
    {

            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {type:mimeString});
    }


    
    printPage()
    {
        // this.saveSignature();
        
        this.updateSignatureButtonViewOwner = false;
        this.updateSignatureButtonViewCharterer = false;

        this.nonPrintView = false;
        this.printView = true;

        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        var isTrading = filter.isTrading;

        if(isTrading == '2')
        {
            this.customInputDrawDataUpdate();
        } else {
            this.customInputTradingDataUpdate();
        }
    }

    // Fetch Trading Data
    fetchTradingData()
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
            this.tradingId = filter.tradingId;

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

                    this.tradingResponseInformationData['cityName'] = (this.tradingResponseInformationData['cityName'] == null) ? '' : this.tradingResponseInformationData['cityName'];

                    var cpTime = this.tradingResponseInformationData['cpTime'];
                    var cpDate = this.tradingResponseInformationData['cpDate'];
                    var cityName = this.tradingResponseInformationData['cityName'];

                    var current_date = (cpDate != '') ? moment(cpDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
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

                    console.log(cpTime);
                    console.log(cpDate);
                    console.log(cityName);

                    console.log(this.ownerName);
                    console.log(this.chartererName);
                    console.log(this.brokerName);

                    this.fetchVesselData();
                }
            });
        }catch (err){}
    }

    // Fetch Draw Data
    fetchDrawData()
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
            this.drawId = filter.drawId;

        if (JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            const newReq =
            {
                id: this.drawId,
                charterer_view_check: 20,
                updatedBy: localStorage.getItem('userId')
            };
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/drawProgressUpdate`, newReq, headerOptions).subscribe( res =>
            {
            });
        }
        

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

                    this.drawResponseInformationData['cityName'] = (this.drawResponseInformationData['cityName'] == null) ? '' : this.drawResponseInformationData['cityName'];

                    var cpTime = this.drawResponseInformationData['cpTime'];
                    var cpDate = this.drawResponseInformationData['cpDate'];
                    var cityName = this.drawResponseInformationData['cityName'];

                    var current_date = (cpDate != '') ? moment(cpDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
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
                        this.signature1MainImageView = true;
                    }

                    var signature2 = this.currentSignature2;
                    if(signature2 != '' && signature2 != null)
                    {
                        this.signature2MainImageView = true;
                    }

                    console.log(cpTime);
                    console.log(cpDate);
                    console.log(cityName);

                    console.log(this.ownerName);
                    console.log(this.chartererName);
                    console.log(this.brokerName);

                    this.fetchVesselData();
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

    next(id): void {
        if (this.termsReviewRecordsData[this.termsReviewRecordsData.length - 1].id == id) {
            this.flag = this.flag + 1;
            this.termsReviewRecords();
            this.nextStatus = false;
        } else {
            this.flag = this.flag + 1;
            this.termsReviewRecords();
            this.nextStatus = true;
            console.log(this.termsReviewRecordsData[this.termsReviewRecordsData.length - 1]);
        }

    }

    Previous(id): void {
        if (this.termsReviewRecordsData[this.termsReviewRecordsData.length - 1] == this.flag) {
            this.flag = this.flag - 1;
            this.termsReviewRecords();
            this.nextStatus = false;
        } else {
            this.flag = this.flag - 1;
            this.termsReviewRecords();
            this.nextStatus = true;
        }
    }

    // Clause Category Records Server Side
    clauseCategoryRecordsServerSide()
    {
        var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
        this.formId = filter.formId;

        var filterCondition = {};
            filterCondition['cpFormId'] = this.formId;
            filterCondition['checkedClauseCategory'] = [];
        try
        {
            this._userService.clauseCategoryRecordsServerSide(filterCondition).pipe(first()).subscribe((res) =>
            {
                this.clauseCategoryRecordResponse = res;
                if(this.clauseCategoryRecordResponse.success == true)
                {
                    this.clauseCategoryRecordResponseData = this.clauseCategoryRecordResponse.data;
                    this.checkedClauseCategory = [];
                    for (let index = 0; index < this.clauseCategoryRecordResponseData.length; index++)
                    {
                        this.checkedClauseCategory.push(Number(this.clauseCategoryRecordResponseData[index].id));
                    }
                    console.log(this.checkedClauseCategory);
                    this.termsReviewRecords();
                }
            });
        }catch (err){}
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

    // Main Array
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
            clauseCategoryFilterCondition["checked_clauses"] = this.checkedClauseCategory;
            try {
                this._userService.mainClauseScreenDataRecords(clauseCategoryFilterCondition).pipe(first()).subscribe((res) => {
                    this.termsReviewRecordsResponse = res;
                    if (this.termsReviewRecordsResponse.success === true) {
						this.termsReviewRecordsData = this.termsReviewRecordsResponse.data;
						
						for (let index = 0; index < this.termsReviewRecordsData.length; index++)
						{
							for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++)
							{
								this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
							}
							for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; sindex++)
							{
								this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindex]['identifier'] = String.fromCharCode(97 + sindex);
							}
                        }
                        
                        this.customClauseDataRecords();

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
            clauseCategoryFilterCondition["commonClauses"] = [];
            clauseCategoryFilterCondition["commonClausesCustomArray"] = [];
            clauseCategoryFilterCondition["checked_clauses"] = this.checkedClauseCategory;
            try {
                this._userService.mainClauseScreenDataRecordsTrading(clauseCategoryFilterCondition).pipe(first()).subscribe((res) => {
                    this.termsReviewRecordsResponse = res;
                    if (this.termsReviewRecordsResponse.success === true) {
                        this.termsReviewRecordsData = this.termsReviewRecordsResponse.data;
                        
                        for (let index = 0; index < this.termsReviewRecordsData.length; index++)
						{
							for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++)
							{
								this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
							}
							for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; sindex++)
							{
								this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindex]['identifier'] = String.fromCharCode(97 + sindex);
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
                    console.log(this.customClauseDataResponseData);
                }
            })
        } catch (err) { }
    }

    // // Draw Progress Update
    // drawProgressUpadte()
    // {
    //     const req =
    //     {
    //         drawId: this.drawId,
    //         updatedBy: localStorage.getItem('userId')
    //     };
    //     const header = new HttpHeaders();
    //     header.append('Content-Type', 'application/json');
    //     const headerOptions = { headers: header }
    //     this.http.post(`${config.baseUrl}/drawProgressUpdate`, req, headerOptions).subscribe( res =>
    //     {
    //         this.drawStatusInfoUpdate();
    //     });
    // }

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
            statusInfoValue = 'Charterer Viewed';
            this.updateSignatureButtonViewCharterer = true;
        }
        if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            statusInfoValue = 'Owner Viewed';
            this.updateSignatureButtonViewOwner = true;
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
            statusInfoValue = 'Charterer Viewed';
        }
        if (JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            statusInfoValue = 'Owner Viewed';
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
        this.http.post(`${config.baseUrl}/tradingStatusInfoUpdate`, req, headerOptions).subscribe( res =>
        {});
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

    }
}