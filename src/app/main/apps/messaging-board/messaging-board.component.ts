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

export interface UserData
{
    id: string;
    tradingId: string;
    message: string;
    broker_id: string;
    charterer_id: string;
    owner_id: string;
    is_broker_read: string;
    is_charterer_read: string;
    is_owner_read: string;
    total_read: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive : string;
    isDelete: string;
    action : string;

    createdDateInfo : string;
    createdTimeInfo : string;
    createdByName : string;
}

export interface PeriodicElement
{   
    id: string;
    tradingId: string;
    message: string;
    broker_id: string;
    charterer_id: string;
    owner_id: string;
    is_broker_read: string;
    is_charterer_read: string;
    is_owner_read: string;
    total_read: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive : string;
    isDelete: string;
    action : string;

    createdDateInfo : string;
    createdTimeInfo : string;
    createdByName : string;
}

export interface NotificationRecords
{   
    id:String;
    fromUserId: string;
    toUserId: string;
    notification: string;
    is_read: string;
    fromUserName: string;
    toUserName: string;
    createdAt: string;
}

@Component(
{
    selector: 'app-messaging-board',
    templateUrl: './messaging-board.component.html',
    styleUrls: ['./messaging-board.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class MessagingBoardComponent implements OnInit
{
    // Table Codes Start
    displayedColumns: string[] = ['id','tradingId','createdDateInfo','createdTimeInfo','createdByName','message','action'];
    displayedColumnsNotificaiton: string[] = ['id','notification','createdAt'];
    messageCenterRecords = new MatTableDataSource<PeriodicElement>();
    notificationRecords = new MatTableDataSource<NotificationRecords>();
    applyFilter(filterValue: string)
    {
        this.messageCenterRecords.filter = filterValue.trim().toLowerCase();
        this.notificationRecords.filter = filterValue.trim().toLowerCase();
    }
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    // Table Codes End
    
    // Main Data Variables Start
    id: string;
    tradingId: string;
    message: string;
    brokerId: string;
    chartererId: string;
    ownerId: string;
    is_broker_read: string;
    is_charterer_read: string;
    is_owner_read: string;
    total_read: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive : string;
    isDelete: string;
    action : string;
    // Main Data Variables End

    // Show Hide Variables Start
    nudgesTableDiv = true;
    nudgesFormDiv = false;
    systemAlertsDiv = false;
    notificationTableDiv = false;
    // Show Hide Variables End

    // General Variable Start
    loading = false;
    submitted = false;
    NudgesMessageCenterForm : FormGroup;
    get NudgesMessageCenterFormValues() { return this.NudgesMessageCenterForm.controls; }
    // General Variable Emd
    
    // Assign API Data Response And Array Variables Start
    messageCenterResponse: any;
    messageCenterResponseArray = [];

    tradingRecordsResponse: any;
    tradingRecordsResponseArray = [];

    notificationRecordsResponse: any;
    notificationRecordsResponseArray = [];
    // Assign API Data Response And Array Variables End
    
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
        this.messageCenterRecords = new MatTableDataSource(this.messageCenterResponseArray);
        this.notificationRecords = new MatTableDataSource(this.notificationRecordsResponseArray);
    }

    ngOnInit()
    {
        // Assign Paginator Values Start
        this.messageCenterRecords.paginator = this.paginator;
        this.messageCenterRecords.sort = this.sort;

        this.notificationRecords.paginator = this.paginator;
        this.notificationRecords.sort = this.sort;
        // Assign Paginator Values End

        // Assign Form Values Start
        this.NudgesMessageCenterForm = this._formBuilder.group(
        {
            tradingId: ['', Validators.required],
            message: ['', Validators.required]
        });
        // Assign Form Values End
        
        this.userDataUpdateToMessageCenter();
        this.messageCenterRecordsServerSide();
        this.tradingRecordsServerSide();
    }

    // Show Hide Div
    showHideModules(type)
    {
        this.alertService.clear();
        this.NudgesMessageCenterForm.reset();

        this.nudgesTableDiv = false;
        this.nudgesFormDiv = false;
        this.systemAlertsDiv = false;
        this.notificationTableDiv = false;

        if(type == '1')
        {
            this.nudgesTableDiv = true;
            this.messageCenterRecordsServerSide();
        }

        if(type == '2')
        {
            this.nudgesFormDiv = true;
        }

        if(type == '3')
        {
            this.systemAlertsDiv = true;
        }

        if(type == '4')
        {
            this.notificationTableDiv = true;
            this.notificationRecordsServerSide();
        }
    }

    // Assign Broker,Charter,Owner Values On Fixture Change
    onChangeFixture(event)
    {
        this.tradingId = event.value;
        for (let index = 0; index < this.tradingRecordsResponseArray.length; index++)
        {   
            if (this.tradingRecordsResponseArray[index].id == this.tradingId)
            {
                this.ownerId = this.tradingRecordsResponseArray[index].ownerId;
                this.chartererId = this.tradingRecordsResponseArray[index].chartererId;
                this.brokerId = this.tradingRecordsResponseArray[index].createdBy;
            }
        }
    }

    // Message Center Records Server Side
    messageCenterRecordsServerSide(): void
    {
        var filter = {};
        this._userService.messageCenterRecordsServerSide(filter).pipe(first())
        .subscribe(res =>
        {
            this.messageCenterResponse = res;
            if (this.messageCenterResponse.success === true)
            {
                this.messageCenterResponseArray = this.messageCenterResponse.data;
                this.messageCenterRecords = new MatTableDataSource(this.messageCenterResponse.data);
                this.messageCenterRecords.paginator = this.paginator;
                this.messageCenterRecords.sort = this.sort;
                setTimeout(() =>
                {
                    this.updateMessageCenterPaginator();
                }, 100);
            }   
        }); 
    }

    // Update Message Center Paginator
    updateMessageCenterPaginator()
    {
        this.messageCenterRecords = new MatTableDataSource(this.messageCenterResponse.data);
        this.messageCenterRecords.paginator = this.paginator;
        this.messageCenterRecords.sort = this.sort;
    }

    // User Data Update To Message Center
    userDataUpdateToMessageCenter(): void
    {
        var updateData = {};
        if(JSON.parse(localStorage.getItem('userRoleId')) == '3')
        {
            updateData["brokerId"] = localStorage.getItem('userId');
        }
        if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            updateData["chartererId"] = localStorage.getItem('userId');
        }
        if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            updateData["ownerId"] = localStorage.getItem('userId');
        }
        this._userService.messageCenterDataUpdate(updateData).pipe(first()).subscribe(res =>{}); 
    }

    // Trading Records Server Side
    tradingRecordsServerSide(): void
    {
        this.tradingRecordsResponseArray = [];
        var arrfilterInfo = {};
            arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
        if(JSON.parse(localStorage.getItem('userRoleId')) == '3')
        {
            arrfilterInfo["dcm.createdBy"] = localStorage.getItem('userId');
        }
        if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            arrfilterInfo["dcm.chartererId"] = localStorage.getItem('userId');
        }
        if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            arrfilterInfo["dcm.ownerId"] = localStorage.getItem('userId');
        }
        try
        {
            this._userService.TradingFormRecordsServerSide(arrfilterInfo).pipe(first()).subscribe((res) =>
            {
                this.tradingRecordsResponse = res;
                this.tradingRecordsResponseArray = this.tradingRecordsResponse.data;
            },err => { this.alertService.error(err, 'Error'); });
        } catch (err){}
    }

    // Nudges Form Submit
    NudgesMessageCenterFormSubmit(): void
    {
        this.submitted = true;
        this.alertService.clear();
        if (this.NudgesMessageCenterForm.invalid)
        { 
            return;
        } else {

            this.tradingId = this.NudgesMessageCenterFormValues.tradingId.value;
            this.message = this.NudgesMessageCenterFormValues.message.value;

            const req =
            {
                tradingId : this.tradingId,
                message : this.message,
                brokerId : this.brokerId,
                chartererId : this.chartererId,
                ownerId : this.ownerId,
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
                this.http.post(`${config.baseUrl}/messageCenterCreate`, req, headerOptions).subscribe(
                res =>
                {
                    this.alertService.success('Message Created And Send Successfully', 'Success');
                    this.showHideModules(1);
                    this.userDataUpdateToMessageCenter();
                    this.messageCenterRecordsServerSide();
                },
                err =>
                {
                    this.alertService.error(err, 'Error');
                }
                );
            } catch (err)
            {
            } 
        }
    }

    // Notification Records Server Side
    notificationRecordsServerSide()
    {
        var filter = {};
            // filter["toUserId"] = JSON.parse(localStorage.getItem('userId'));
        this._userService.notificationRecords(filter).pipe(first())
        .subscribe(res =>
        {
            this.notificationRecordsResponse = res;
            if (this.notificationRecordsResponse.success === true)
            {
                this.notificationRecordsResponseArray = this.notificationRecordsResponse.data;
                this.notificationRecords = new MatTableDataSource(this.notificationRecordsResponse.data);
                this.notificationRecords.paginator = this.paginator;
                this.notificationRecords.sort = this.sort;
                setTimeout(() =>
                {
                    this.updateNotificationPaginator();
                }, 100);
            }   
        }); 
    }

    // Update Notification Paginator
    updateNotificationPaginator()
    {
        this.notificationRecords = new MatTableDataSource(this.notificationRecordsResponse.data);
        this.notificationRecords.paginator = this.paginator;
        this.notificationRecords.sort = this.sort;
    }
}