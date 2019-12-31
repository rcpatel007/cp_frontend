import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { AnalyticsDashboardService } from 'app/main/apps/dashboards/analytics/analytics.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { UserService } from '../../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';
import {FormGroupDirective, NgForm,} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import * as moment from 'moment';

import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import * as shape from 'd3-shape';


export interface PeriodicElement
{
    id:String;
    identifier : string;
    CPTypeId:String;
    formId: string;
    vesselId: string;
    ownerId: string;
    chartererId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
    cpDateInfo : string;
    cpTime: string;
    cpCity: string;
    cpSubject: string;
    cpLiftDate: string;
    cpLiftTime: string;
    cpLiftCity: string;
    companyId: string;
    isAccepted : string;

    chartererName: string;

    CharterPartyFormName:String;
    charterPartyTypeName: string;
    
    ownerName: string;
    vesselName: string;
    brokerName: string;
    
    newAction : string;
    
    std_bid_name : string;

    isOwnerAccepted : string;

    ownerActionButton : string;

    chartererNameInfo : string;

    ownerNameInfo : string;
}

@Component({
    selector: 'analytics-dashboard',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})


export class AnalyticsDashboardComponent implements OnInit
{
    widget6: any = {};

    

    widgets: any;
    widget1SelectedYear = '2016';
    widget5SelectedDay = 'today';
    name: string;
    position: number;
    date: string;
    schar: string;
    symbol: string;
    charterer: string;
    
    userRecordsServerSideResponse : any;
    userRecordsServerSideResponseData = [];

    tradingRecordsServerSideResponse : any;
    tradingRecordsServerSideResponseData = [];

    // Vessel Search Form Settings Start

    vesselName : string;
    keywords : string;
    dateMin : string;
    dateMax : string;
    owner : string;
    vessel_type : string;
    status : string;
    charterer_broker : string;
    owner_broker : string;
    fixture_id : string;

    owner_signed : string;
    charterer_signed : string;

    owner_not_signed : string;
    charterer_not_signed : string;
    cp_not_signed : string;

    advanceView = false;

    createTradeButtonView : any;

    isBrokerView : any;
    isChartererView : any;
    isOwnerView : any;

    isEditView : any;
    isRecapView : any;

    acceptRejectTitle : any;
    afteracceptRejectTitle : any;

    vesselSearchForm : FormGroup;
    get vesselSearchFormValues() { return this.vesselSearchForm.controls; }
    // Vessel Search Form Settings End
    
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;


    tradingRecordsDisplayColumn: string[] = ['identifier','cpDateInfo','brokerName','chartererName','ownerName', 'vesselName',
     'progress','statusInfo'];
    tradingRecordsData = new MatTableDataSource<PeriodicElement>();

    tradingArchivedDisplayColumn: string[] = ['identifier','cpDateInfo','brokerName','chartererName','ownerName', 'vesselName',
     'progress','statusInfo'];
    tradingArchivedData = new MatTableDataSource<PeriodicElement>();

    applyFilter(filterValue: string)
    {
        this.tradingRecordsData.filter = filterValue.trim().toLowerCase();
        this.tradingArchivedData.filter = filterValue.trim().toLowerCase();
    }
    

    /**
     * Constructor
     *
     * @param {AnalyticsDashboardService} _analyticsDashboardService
     */
    constructor(
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private _analyticsDashboardService: AnalyticsDashboardService,
        private router: Router,
    ) {
        // Register the custom chart.js plugin
        // this._registerCustomChartJSPlugin();
        console.log('Application loaded. Initializing data.');
        this.tradingRecordsData = new MatTableDataSource(this.tradingRecordsServerSideResponseData );
        let userToken = localStorage.getItem('userToken')
        if(userToken==undefined){
            this.router.navigate(['/']);
        }

        this.widget6 = {
            currentRange : 'TW',
            legend       : false,
            explodeSlices: false,
            labels       : true,
            doughnut     : true,
            gradient     : false,
            scheme       : {
                domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63']
            },
            onSelect     : (ev) => {
                console.log(ev);
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
        // Get the widgets from the service
        this.widgets = this._analyticsDashboardService.widgets;
        this.newUsersRecords();

        this.tradingRecordsData.paginator = this.paginator;
        this.tradingRecordsData.sort = this.sort;
        this.tradingRecordsServerSide();

        // Vessel Search Form
        this.vesselSearchForm = this._formBuilder.group(
        {
            vesselName: ['', ''],
            keywords: ['', ''],
            charterer: ['', ''],
            dateMin: ['', ''],
            dateMax: ['', ''],
            owner: ['', ''],
            vessel_type: ['', ''],
            status: ['', ''],
            charterer_broker: ['', ''],
            fixture_id: ['', ''],
            owner_signed: ['', ''],
            charterer_signed: ['', ''],
            owner_not_signed: ['', ''],
            charterer_not_signed: ['', ''],
            cp_not_signed: ['', ''],
            owner_broker: ['', ''],
            created_by: ['', ''],
            responsible_user: ['', ''],
            bookmarked_by: ['', ''],
            active_user: ['', ''],
            office_location: ['', ''],
            hits_page: ['', ''],
        });

         // Assign Default Values Start
         this.isBrokerView = 'N';
         this.isChartererView = 'N';
         this.isOwnerView = 'N';
         // Assign Default Values End
        
         if(JSON.parse(localStorage.getItem('userRoleId')) == '3')
         {
             this.createTradeButtonView = true;
             this.isBrokerView = 'Y';
             this.isEditView = true;    
             this.isRecapView = true;
         }
 
         if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
         {
             this.acceptRejectTitle = 'Participate / Boycott';
             this.afteracceptRejectTitle = 'BID';
             this.isChartererView = 'Y';
             this.isEditView = true;    
             this.isRecapView = true;
         }
 
         if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
         {
             this.acceptRejectTitle = 'Offer Accept / Reject';
             this.afteracceptRejectTitle = 'OFFER';
             this.isOwnerView = 'Y';
             this.isEditView = true;    
             this.isRecapView = true;
         }

    }

    advanceOptionView()
    {
        this.advanceView = !this.advanceView;
    }

    // New Users Records
    newUsersRecords()
    {
        var filter = {};
            filter["companyId"] = JSON.parse(localStorage.getItem('companyId'));
        this._userService.newUsersRecords(filter).pipe(first())
        .subscribe(res =>
        {
            this.userRecordsServerSideResponse = res;
            if (this.userRecordsServerSideResponse.success === true)
            {
                this.userRecordsServerSideResponseData = this.userRecordsServerSideResponse.data;
                console.log(this.userRecordsServerSideResponse);
                console.log(this.userRecordsServerSideResponseData);
            }   
        }); 
    }

    // Trading Progress Records Server Side
    tradingProgressRecordsServerSide()
    {
        var filter = {};
            filter["companyId"] = JSON.parse(localStorage.getItem('companyId'));
        this._userService.newUsersRecords(filter).pipe(first())
        .subscribe(res =>
        {
            this.userRecordsServerSideResponse = res;
            if (this.userRecordsServerSideResponse.success === true)
            {
                this.userRecordsServerSideResponseData = this.userRecordsServerSideResponse.data;

            }   
        }); 
    }
    
     // Trading Records Server Side Start
     tradingRecordsServerSide(): void
     {
         this.tradingRecordsServerSideResponseData  = [];
         var conditionData = {};
            conditionData["dcm.companyId"] = localStorage.getItem('companyId');
            conditionData["dcm.createdBy"] = (JSON.parse(localStorage.getItem('userRoleId')) == '3') ? localStorage.getItem('userId') : undefined;
            conditionData["dcm.chartererId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '4') ? localStorage.getItem('userId') : undefined;
            conditionData["dcm.ownerId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '6') ? localStorage.getItem('userId') : undefined;
         try
         {
             this._userService.TradingFormRecordsServerSide(conditionData).pipe(first()).subscribe((res) =>
             {
                 this.tradingRecordsServerSideResponse = res;
                 if (this.tradingRecordsServerSideResponse.success === true)
                 {
                     this.tradingRecordsServerSideResponseData  = this.tradingRecordsServerSideResponse.data;
                     setTimeout(() => { this.setPaginatorOfTradingRecordsDataTable(); }, 100);
                 }
             },err => { });
         } catch (err){}
     }

    // Trading Records Archived Server Side Start
    tradingRecordsServerSideArchvied(): void
    {
        this.tradingRecordsServerSideResponseData  = [];
        var conditionData = {};
            conditionData["dcm.progress"] = '100';
            conditionData["dcm.companyId"] = localStorage.getItem('companyId');
            conditionData["dcm.createdBy"] = (JSON.parse(localStorage.getItem('userRoleId')) == '3') ? localStorage.getItem('userId') : undefined;
            conditionData["dcm.chartererId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '4') ? localStorage.getItem('userId') : undefined;
            conditionData["dcm.ownerId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '6') ? localStorage.getItem('userId') : undefined;
        try
        {
            this._userService.TradingFormRecordsServerSide(conditionData).pipe(first()).subscribe((res) =>
            {
                this.tradingRecordsServerSideResponse = res;
                if (this.tradingRecordsServerSideResponse.success === true)
                {
                    this.tradingRecordsServerSideResponseData  = this.tradingRecordsServerSideResponse.data;
                    setTimeout(() => { this.setPaginatorOfTradingRecordsDataTable(); }, 100);
                }
            },err => { });
        } catch (err){}
    }

      // Trading Records Paginator Set Start
    setPaginatorOfTradingRecordsDataTable()
    {
        this.tradingRecordsData = new MatTableDataSource(this.tradingRecordsServerSideResponse.data);
        this.tradingRecordsData.paginator = this.paginator;
        this.tradingRecordsData.sort = this.sort;
    }
    // Trading Records Paginator Set End

    public static widgets =
    {
        'widget6'      : 
        {
            'title'      : 'Task Distribution',
            'ranges'     : {
                'TW': 'This Week',
                'LW': 'Last Week',
                '2W': '2 Weeks Ago'
            },
            'mainChart'  : {
                'TW': [
                    {
                        'name' : 'Frontend',
                        'value': 15
                    },
                    {
                        'name' : 'Backend',
                        'value': 20
                    },
                    {
                        'name' : 'API',
                        'value': 38
                    },
                    {
                        'name' : 'Issues',
                        'value': 27
                    }
                ],
                'LW': [
                    {
                        'name' : 'Frontend',
                        'value': 19
                    },
                    {
                        'name' : 'Backend',
                        'value': 16
                    },
                    {
                        'name' : 'API',
                        'value': 42
                    },
                    {
                        'name' : 'Issues',
                        'value': 23
                    }
                ],
                '2W': [
                    {
                        'name' : 'Frontend',
                        'value': 18
                    },
                    {
                        'name' : 'Backend',
                        'value': 17
                    },
                    {
                        'name' : 'API',
                        'value': 40
                    },
                    {
                        'name' : 'Issues',
                        'value': 25
                    }
                ]
            },
            'footerLeft' : {
                'title': 'Tasks Added',
                'count': {
                    '2W': 487,
                    'LW': 526,
                    'TW': 594
                }
            },
            'footerRight': {
                'title': 'Tasks Completed',
                'count': {
                    '2W': 193,
                    'LW': 260,
                    'TW': 287
                }
            }
        }
    };
}