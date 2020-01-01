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

@Component(
{
    selector: 'app-trading-platform-management',
    templateUrl: './trading-platform-management.component.html',
    styleUrls: ['./trading-platform-management.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class TradingPlatformManagementComponent implements OnInit
{
    // Assign Div Name For Hide And Show Start
    tradeRecordsDiv = true;
    createTradeButtonView = false;
    tradingFormDiv = false;
    tradeBothView = false;
    tradeChartererView = false;
    tradeOwnerView = false;
    tradeSubmitInformationView = false;
    isEditView = false;
    isRecapView = false;
    // Assign Div Name For Hide And Show End

    // Form Setting Start
    tradingForm: FormGroup;
    tradingFormSubmitResponse : any;
    tradingFormSubmitResponseData = [];
    get tradingFormValue() { return this.tradingForm.controls; }

    performaForm: FormGroup;
    performaFormSubmitResponse : any;
    performaFormSubmitResponseData = [];
    get performaFormValue() { return this.performaForm.controls; }

    executedForm: FormGroup;
    executedFormSubmitResponse : any;
    executedFormSubmitResponseData = [];
    get executedFormValue() { return this.executedForm.controls; }
    // Form Setting End

    // Assign Variables Start
    tradingId : string;
    companyId: string;
    vesselId : string;
    brokerId : string;
    
    ownerId : string;
    ownerName :  string;
    ownerNameNotification :  string;
    ownerEmailID : string;
    ownerMobileNumber : string;
    ownerStatus : string;
    ownerStatusInfo : string;

    chartererId: string;
    chartererName : string;
    chartererNameNotification : string;
    chartererEmailID : string;
    chartererMobileNumber : string;
    chartererStatus : string;
    chartererStatusInfo : string;
    
    companyName : string;
    tradeType : string;
    bidNameLabel : string;
    std_bid_name : string;

    isBrokerView : any;
    isChartererView : any;
    isOwnerView : any;

    acceptRejectTitle : any;
    afteracceptRejectTitle : any;

    statusAction : any;
    activeModalStatus : any;
    inActiveModalStatus : any;

    actionTypeModal : any;
    performaModal : any;
    executedModal : any;
    cpFormId : string;
    copyTradingId : string;
    // Assign Variables End

    // Assign API Variable Start
    tradingRecordsServerSideResponse : any;
    tradingRecordsServerSideResponseData = [];
    chartererRecordsServerSideResponse: any;
    chartererRecordsServerSideResponseData = [];
    ownerRecordsServerSideResponse : any;
    ownerRecordsServerSideResponseData = [];
    vesselRecordsServerSideResponse : any;
    vesselRecordsServerSideResponseData = [];
    companyRecordsServerSideResponse : any;
    companyRecordsServerSideResponseData = [];
    tradingDataUpdateResponse : any;
    tradingDataUpdateResponseData = [];
    cpFormRecordsServerSideResponse : any;
    cpFormRecordsServerSideResponseData = [];
    fixtureRecordsServerSideResponse : any;
    fixtureRecordsServerSideResponseData = [];
    // Assign API Variable End

    // Datatable Settings Start
    tradingRecordsDisplayColumn: string[] = ['identifier','cpDateInfo','brokerName','chartererName','ownerName', 'vesselName',
     'progress','statusInfo','isChartererAccepted','isOwnerAccepted','action'];
    tradingRecordsData = new MatTableDataSource<PeriodicElement>();
    applyFilter(filterValue: string)
    {
        this.tradingRecordsData.filter = filterValue.trim().toLowerCase();
    }
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    // Datatable Settings End
    
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
        this.tradingRecordsData = new MatTableDataSource(this.tradingRecordsServerSideResponseData );
    }

    ngOnInit()
    {
        // Assign Default Values To Variable Start
        this.bidNameLabel = 'Trade Name';
        this.ownerName = ' ------ ';
        this.ownerEmailID = ' ------ ';
        this.ownerMobileNumber = ' ------ ';
        this.chartererName = ' ------ ';
        this.chartererEmailID = ' ------ ';
        this.chartererMobileNumber = ' ------ ';
        // Assign Default Values To Variable End
        
        // Data Table On Page Load Settings Start
        this.tradingRecordsData.paginator = this.paginator;
        this.tradingRecordsData.sort = this.sort;
        this.tradingRecordsServerSide();
        // Data Table On Page Load Settings End

        // Set Form And Its Validation Start
        this.tradingForm = this._formBuilder.group(
        {
            tradeType: ['', Validators.required],
            std_bid_name:  ['',[ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")] ],
            chartererId: ['', Validators.required],
            ownerId: ['', Validators.required],
            vesselId: ['', Validators.required],
        });

        this.performaForm = this._formBuilder.group(
        {
            cpFormId: ['', Validators.required]
        });

        this.executedForm = this._formBuilder.group(
        {
            copyTradingId: ['', Validators.required]
        });
        // Set Form And Its Validation End

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

        this.chartererRecordsServerSide();
        this.ownerRecordsServerSide();
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
            },err => { this.alertService.error(err, 'Error'); });
        } catch (err){}
    }
    // Trading Records Server Side End

    // Trading Records Paginator Set Start
    setPaginatorOfTradingRecordsDataTable()
    {
        this.tradingRecordsData = new MatTableDataSource(this.tradingRecordsServerSideResponse.data);
        this.tradingRecordsData.paginator = this.paginator;
        this.tradingRecordsData.sort = this.sort;
    }
    // Trading Records Paginator Set End

    // Trading Div Hide Show Start
    divShowHide(type) : void
    {
        this.tradeSubmitInformationView = false;

        this.ownerName = ' ------ ';
        this.ownerEmailID = ' ------ ';
        this.ownerMobileNumber = ' ------ ';
        this.chartererName = ' ------ ';
        this.chartererEmailID = ' ------ ';
        this.chartererMobileNumber = ' ------ ';

        this.tradingForm = this._formBuilder.group(
        {
            tradeType: ['', Validators.required],
            std_bid_name:  ['',[ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")] ],
            chartererId: ['', Validators.required],
            ownerId: ['', Validators.required],
            vesselId: ['', Validators.required],
        });

        this.tradingFormDiv = false;
        this.tradeRecordsDiv = false;
        if(type == 1)
        {
            this.tradingFormDiv = false;
            this.tradeRecordsDiv = true;
        }
        if(type == 2)
        {
            this.tradingFormDiv = true;
            this.tradeRecordsDiv = false;
            // Fetch Company Data Start
            this.fetchCompanyData();
            // Fetch Company Data End
        }
       
    }
    // Trading Div Hide Show End

    // Trading Form Inputs Hide Show Start
    setTradeFormView(event)
    {
        this.tradeBothView = false;
        this.tradeChartererView = false;
        this.tradeOwnerView = false;
        var tradeType = event.value;
        
        if(tradeType == 1)
        {
            // Set Form And Its Validation Start
            this.tradingForm = this._formBuilder.group(
            {
                tradeType: [tradeType, Validators.required],
                std_bid_name:  ['',[ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")] ],
                chartererId: ['', Validators.required],
                ownerId: ['', ''],
                vesselId: ['', '']
            });
            // Set Form And Its Validation End
            this.bidNameLabel = 'Bid Name';
            this.tradeBothView = true;
            this.tradeChartererView = true;
            this.chartererRecordsServerSide();
        }
        if(tradeType == 2)
        {
            // Set Form And Its Validation Start
            this.tradingForm = this._formBuilder.group(
            {
                tradeType: [tradeType, Validators.required],
                std_bid_name:  ['',[ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")] ],
                chartererId: ['', ''],
                ownerId: ['', Validators.required],
                vesselId: ['', Validators.required]
            });
            // Set Form And Its Validation End
            this.bidNameLabel = 'Offer Name';
            this.tradeBothView = true;
            this.tradeOwnerView = true;
            this.ownerRecordsServerSide();
        }
        if(tradeType == 3)
        {
            // Set Form And Its Validation Start
            this.tradingForm = this._formBuilder.group(
            {
                tradeType: [tradeType, Validators.required],
                std_bid_name:  ['',[ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")] ],
                chartererId: ['', Validators.required],
                ownerId: ['', Validators.required],
                vesselId: ['', Validators.required]
            });
            // Set Form And Its Validation End
            this.bidNameLabel = 'Trade Name';
            this.tradeBothView = true;
            this.tradeChartererView = true;
            this.tradeOwnerView = true;
            this.chartererRecordsServerSide();
            this.ownerRecordsServerSide();
        }
    }
    // Trading Form Inputs Hide Show End

    // Charterer Records Server Side Start
    chartererRecordsServerSide(): void
    {
        var conditionData = {};
            conditionData['companyId'] = JSON.parse(localStorage.getItem('companyId'));
            conditionData['userRoleId'] = '4';
        try
        {
            this._userService.userRecordsServerSide(conditionData).pipe(first()).subscribe((res) =>
            {
                this.chartererRecordsServerSideResponse = res;
                if (this.chartererRecordsServerSideResponse.success === true)
                {
                    this.chartererRecordsServerSideResponseData   = this.chartererRecordsServerSideResponse.data;
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
            }, err => { console.log(err); });
        } catch (err)
        { console.log(err); }
    }
    // Charterer Records Server Side End

    // On Charterer Change Start
    onChangeCharterer(event): void
    {
        this.chartererId = event.value;
        let target = event.source.selected._element.nativeElement;
        this.chartererName = target.innerText.trim();
        for(let index = 0; index < this.chartererRecordsServerSideResponseData . length; index++)
        {
            if(this.chartererId == this.chartererRecordsServerSideResponseData [ index].id)
            {
                this.chartererEmailID = this.chartererRecordsServerSideResponseData [ index].email;
                this.chartererMobileNumber = this.chartererRecordsServerSideResponseData [ index].mobileNo;
            }
        }
    }
    // On Charterer Change End

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
            }, err => { console.log(err); });
        } catch (err)
        { console.log(err); }
    }
    // Owners Records Server Side End

    // On Owner Change Start
    onChangeOwner(event)
    {
        this.ownerId =  event.value;
        let target = event.source.selected._element.nativeElement;
        this.ownerName = target.innerText.trim();
        for(let index = 0; index < this.ownerRecordsServerSideResponseData.length; index++)
        {
            if(this.ownerId == this.ownerRecordsServerSideResponseData[index].id)
            {
                this.ownerEmailID = this.ownerRecordsServerSideResponseData[index].email;
                this.ownerMobileNumber = this.ownerRecordsServerSideResponseData[index].mobileNo;
            }
        }
        this.vesselRecordsServerSide();
    }
    // On Owner Change End

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

    // Fetch Company Data Start
    fetchCompanyData()
    {
        var filter = {};
            filter['id'] = localStorage.getItem('companyId');
        try
        {
            this._userService.getCompanyName(filter).pipe(first()).subscribe((res) =>
            {
                this.companyRecordsServerSideResponse = res;
                if (this.companyRecordsServerSideResponse.success === true)
                {
                    this.companyRecordsServerSideResponseData = this.companyRecordsServerSideResponse.data;
                    this.companyName = this.companyRecordsServerSideResponseData[0].companyName;
                }
            }, err => {  });
        } catch (err){  }
    }
    // Fetch Company Data End

    // Trading Form Submit Start 
    tradingFormSubmit(): void
    {
        this.alertService.clear();
        if (this.tradingForm.invalid)
        { 
            return;
        } else {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.ownerId = this.tradingFormValue.ownerId.value;
            this.vesselId = this.tradingFormValue.vesselId.value;
            this.chartererId = this.tradingFormValue.chartererId.value;
            this.ownerId = (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) ? this.ownerId : null;
            this.chartererId = (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) ? this.chartererId : null;
            const submitData =
            {
                CPTypeId: '3',
                brokerId: localStorage.getItem('userId'),
                ownerId : this.ownerId,
                vesselId : (this.vesselId != '' && this.vesselId != null && this.vesselId != undefined) ? this.vesselId : null,
                chartererId : this.chartererId,
                std_bid_name:this.tradingFormValue.std_bid_name.value,
                chartererBrokerId: localStorage.getItem('userId'),
                ownerBrokerId: localStorage.getItem('userId'),
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                companyId: localStorage.getItem('companyId'),
            };
            try
            {
                this.http.post(`${config.baseUrl}/TradingStandardFormCreate`, submitData, headerOptions).subscribe(
                res =>
                {
                    this.tradingFormSubmitResponse = res;
                    if (this.tradingFormSubmitResponse.success === true)
                    {
                        this.tradingId = this.tradingFormSubmitResponse.data[0];

                        const tradingMessageData =
                        {
                            tradingId       :       this.tradingId,
                            message         :       'BROKER INITIATED TRADE',
                            createdBy       :       localStorage.getItem('userId'),
                            updatedBy       :       localStorage.getItem('userId')
                        };
                        this.http.post(`${config.baseUrl}/tradingMessageInsert`,
                        tradingMessageData, headerOptions).subscribe(res =>{},err =>{});
                        
                        if(this.ownerId != '' && this.ownerId != null && this.ownerId != undefined)
                        {
                            const ownerNotificationData =
                            {
                                fromUserId      :       localStorage.getItem('userId'),
                                toUserId        :       this.ownerId,
                                ownerId         :       this.ownerId,
                                chartererId     :       null,
                                tradingId       :       this.tradingId,
                                email           :       this.ownerEmailID,
                                notification    :       'You are invited for trading offer',
                                createdBy       :       localStorage.getItem('userId'),
                                updatedBy       :       localStorage.getItem('userId')
                            };
                            this.http.post(`${config.baseUrl}/tradingEmailIDAndNotificationSend`,
                            ownerNotificationData, headerOptions).subscribe(res =>{},err =>{});

                            const tradingProgressData =
                            {
                                tradingId       :       this.tradingId,
                                ownerId         :       this.ownerId,
                                brokerId        :       localStorage.getItem('userId'),
                                chartererId     :       null,
                                message         :       'BROKER INITIATED TRADE',
                                createdBy       :       localStorage.getItem('userId'),
                                updatedBy       :       localStorage.getItem('userId')
                            };
                            this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                            tradingProgressData, headerOptions).subscribe(res =>{},err =>{});
                        }
                        
                        if(this.chartererId != '' && this.chartererId != null && this.chartererId != undefined)
                        {
                            const chartererNotificatioNData =
                            {
                                fromUserId      :       localStorage.getItem('userId'),
                                toUserId        :       this.chartererId,
                                ownerId         :       null,
                                chartererId     :       this.chartererId,
                                tradingId       :       this.tradingId,
                                email           :       this.chartererEmailID,
                                notification    :       'You are invited for trading standard bid',
                                createdBy       :       localStorage.getItem('userId'),
                                updatedBy       :       localStorage.getItem('userId')
                            };

                            this.http.post(`${config.baseUrl}/tradingEmailIDAndNotificationSend`, chartererNotificatioNData, headerOptions).subscribe(res =>{},err =>{});

                            const tradingProgressData =
                            {
                                tradingId       :       this.tradingId,
                                ownerId         :       null,
                                brokerId        :       localStorage.getItem('userId'),
                                chartererId     :       this.chartererId,
                                message         :       'BROKER INITIATED TRADE',
                                createdBy       :       localStorage.getItem('userId'),
                                updatedBy       :       localStorage.getItem('userId')
                            };
                            this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                            tradingProgressData, headerOptions).subscribe(res =>{},err =>{});
                        }
                        this.tradeSubmitInformationView = true;
                    }


                    this.tradingRecordsServerSide();
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
    // Trading Form Submit End

    // Show Active Modal Start
    showActiveModal(status,tradingId,ownerId,chartererId,brokerId): void
    {
        this.tradingId = tradingId;
        this.brokerId = brokerId;
        this.ownerId = ownerId;
        this.chartererId = chartererId;
        this.statusAction = status;
        this.activeModalStatus = !this.activeModalStatus;
    }
    // Show Active Modal End

    // Hide Active Modal Start
    hideActiveModal(): void
    {
        this.activeModalStatus = !this.activeModalStatus;
    }
    // Hide Active Modal End

    // Show Inavtive Modal Start
    showInActiveModal(status,tradingId,ownerId,chartererId,brokerId): void
    {
        this.tradingId = tradingId;
        this.brokerId = brokerId;
        this.ownerId = ownerId;
        this.chartererId = chartererId;
        this.statusAction = status;
        this.inActiveModalStatus = !this.inActiveModalStatus;
    }
    // Show Inavtive Modal End

    // Hide Inactive Modal Start
    hideInActiveModal(): void
    {
        this.inActiveModalStatus = !this.inActiveModalStatus;
    }
    // Hide Inactive Modal End

    // Show Action Type Modal Start
    showActionTypeModal(): void
    {
        this.activeModalStatus = !this.activeModalStatus;
        this.actionTypeModal = !this.actionTypeModal;
    }
    // Show Action Type Modal End

    // Hide Action Type Modal Start
    hideActionTypeModal(): void
    {
        this.actionTypeModal = !this.actionTypeModal;
    }
    // Hide Action Type Modal End

    // Show Performa Modal Start
    showPerformaModal(): void
    {
        this.actionTypeModal = !this.actionTypeModal;
        this.performaModal = !this.performaModal;
        // Set Form And Its Validation Start
        this.performaForm = this._formBuilder.group(
        {
            cpFormId: ['', Validators.required]
        });
        // Set Form And Its Validation End
        this.cpFormRecordsServerSide();
    }
    // Show Performa Modal End

    // Hide Performa Modal Start
    hidePerformaModal(): void
    {
        this.performaModal = !this.performaModal;
    }
    // Hide Performa Modal End

    // Fetch CP Form Data Records Server Side Start
    cpFormRecordsServerSide()
    {
        try
        {
            this.http.get(`${config.baseUrl}/cpFromlist`).subscribe((res) =>
            {
                this.cpFormRecordsServerSideResponse = res;
                if(this.cpFormRecordsServerSideResponse.success == true)
                {
                    this.cpFormRecordsServerSideResponseData = this.cpFormRecordsServerSideResponse.data;
                }
            });
        }catch (err){}
    }
    // Fetch CP Form Data Records Server Side End

    // Performa Form Submit Start 
    performaFormSubmit(): void
    {
        this.alertService.clear();
        if (this.performaForm.invalid)
        { 
            return;
        } else {
            this.performaModal = !this.performaModal;
            this.cpFormId = this.performaFormValue.cpFormId.value;
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            const tradingDataUpdate =
            {
                id: this.tradingId,
                formId: this.cpFormId,
                updatedBy: localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`, tradingDataUpdate, headerOptions).subscribe( res =>{});
            
            var updateData = {};
                updateData['tradingId'] = this.tradingId;
                updateData['isAccepted'] = this.statusAction;
                updateData['updatedBy'] = localStorage.getItem('userId');
        
            if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
            {
                updateData['chartererId'] = this.chartererId;
            }

            if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
            {
                updateData['ownerId'] = this.ownerId;
            }

            this._userService.TradingPlatformRequestStatusUpdateCommon(updateData).pipe(first()).subscribe(data =>
            {
                this.tradingDataUpdateResponse = data;
                if (this.tradingDataUpdateResponse.success === true)
                {
                    this.alertService.success(this.tradingDataUpdateResponse.message, 'Success');
                    
                } else {
                    this.alertService.error(this.tradingDataUpdateResponse.message, 'Error');
                }
            },
            error =>
            {
                this.alertService.error(error.message, 'Error');
            });

            if(updateData['isAccepted'] == 'Y')
            {
                const tradingDataUpdate =
                {
                    id: this.tradingId,
                    progress: '20',
                    progress_info: '2',
                    updatedBy: localStorage.getItem('userId')
                };
                this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`, tradingDataUpdate, headerOptions).subscribe( res =>{});
            } else {
                var finalUpdateData = {};
                    finalUpdateData['id'] = this.tradingId;
                if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
                {
                    finalUpdateData['chartererId'] = null;
                }
                if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
                {
                    finalUpdateData['ownerId'] = null;
                    finalUpdateData['vesselId'] = null;
                }
                this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`, tradingDataUpdate, headerOptions).subscribe( res =>{});
            }

            if(localStorage.getItem('userRoleId') == '4')
            {
                var UpdateMessage = (updateData['isAccepted'] == 'Y') ? 'Charterer Accepted Bid' : 'Charterer Rejected Bid';

                var userName =  this.chartererNameNotification;
                var identifier = this.tradingId;

                var acceptedRejected = (updateData['isAccepted'] == 'Y') ? 'Accepted' : 'Rejected';

                var updateMessageForNotification = userName + ' '+acceptedRejected+' Bid '+identifier;

            }

            if(localStorage.getItem('userRoleId') == '6')
            {
                var UpdateMessage = (updateData['isAccepted'] == 'Y') ? 'Owner Accepted Offer' : 'Owner Rejected Offer';

                var userName =  this.ownerNameNotification;
                var identifier = this.tradingId;

                var acceptedRejected = (updateData['isAccepted'] == 'Y') ? 'Accepted' : 'Rejected';

                var updateMessageForNotification = userName + ' '+acceptedRejected+' Bid '+identifier;
            }

            const tradingMessageData =
            {
                tradingId       :       this.tradingId,
                message         :       UpdateMessage,
                createdBy       :       localStorage.getItem('userId'),
                updatedBy       :       localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingMessageInsert`,
            tradingMessageData, headerOptions).subscribe(res =>{},err =>{});

            const tradingNotificationData =
            {
                fromUserId      :       localStorage.getItem('userId'),
                toUserId        :       this.brokerId,
                notification    :       updateMessageForNotification,
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
                        notification    :       updateMessageForNotification,
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
                        notification    :       updateMessageForNotification,
                        createdBy       :       localStorage.getItem('userId'),
                        updatedBy       :       localStorage.getItem('userId')
                    };
                    this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                    tradingNotificationData, headerOptions).subscribe(res =>{},err =>{});
                }
            }
            
            if(this.ownerId != '' && this.ownerId != null && this.ownerId != undefined)
            {
                const tradingProgressData =
                {
                    tradingId       :       this.tradingId,
                    ownerId         :       this.ownerId,
                    brokerId        :       localStorage.getItem('userId'),
                    chartererId     :       null,
                    message         :       UpdateMessage,
                    createdBy       :       localStorage.getItem('userId'),
                    updatedBy       :       localStorage.getItem('userId')
                };
                this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                tradingProgressData, headerOptions).subscribe(res =>{},err =>{});
            }
            
            if(this.chartererId != '' && this.chartererId != null && this.chartererId != undefined)
            {
                const tradingProgressData =
                {
                    tradingId       :       this.tradingId,
                    ownerId         :       null,
                    brokerId        :       localStorage.getItem('userId'),
                    chartererId     :       this.chartererId,
                    message         :       UpdateMessage,
                    createdBy       :       localStorage.getItem('userId'),
                    updatedBy       :       localStorage.getItem('userId')
                };
                this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                tradingProgressData, headerOptions).subscribe(res =>{},err =>{});
            }
            this.tradingRecordsServerSide();
        }
    }
    // Trading Form Submit End

    // Show Executed Modal Start
    showExecutedModal(): void
    {
        this.actionTypeModal = !this.actionTypeModal;
        this.executedModal = !this.executedModal;
        // Set Form And Its Validation Start
        this.executedForm = this._formBuilder.group(
        {
            copyTradingId: ['', Validators.required]
        });
        // Set Form And Its Validation End
        this.fixtureRecordsServerSide();
    }
    // Show Performa Modal End

    // Fetch Fixture Records Server Side Start
    fixtureRecordsServerSide()
    {
        var ConditionData = {};
            ConditionData["dcm.progress"] = '100';
        try
        {
            this._userService.TradingFormRecordsServerSide(ConditionData).pipe(first()).subscribe((res) =>
            {
                this.fixtureRecordsServerSideResponse = res;
                if(this.fixtureRecordsServerSideResponse.success == true)
                {
                    this.fixtureRecordsServerSideResponseData = this.fixtureRecordsServerSideResponse.data;
                }
            });
        }catch (err){}
    }
    // Fetch CP Form Data Records Server Side End

    // Executed Form Submit Start 
    executedFormSubmit(): void
    {
        this.alertService.clear();
        if (this.executedForm.invalid)
        { 
            return;
        } else {
            this.executedModal = !this.executedModal;
            this.copyTradingId = this.executedFormValue.copyTradingId.value;
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }

            const copyTradingData =
            {
                tradingId: this.tradingId,
                copyID: this.copyTradingId,
                updatedBy: localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/copyTradingData`, copyTradingData, headerOptions).subscribe( res =>{});

            var updateData = {};
            updateData['tradingId'] = this.tradingId;
            updateData['isAccepted'] = this.statusAction;
            updateData['updatedBy'] = localStorage.getItem('userId');
    
            if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
            {
                updateData['chartererId'] = this.chartererId;
            }

            if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
            {
                updateData['ownerId'] = this.ownerId;
            }

            const statusUpdateData =
            {
                tradingId: this.tradingId,
                ownerId: this.ownerId,
                chartererId: this.chartererId,
                isAccepted: this.statusAction,
                updatedBy: localStorage.getItem('userId'),
            };
            this._userService.TradingPlatformRequestStatusUpdateCommon(updateData).pipe(first()).subscribe(data =>
            {
                this.tradingDataUpdateResponse = data;
                if (this.tradingDataUpdateResponse.success === true)
                {
                    this.alertService.success(this.tradingDataUpdateResponse.message, 'Success');
                    // this.tradingRecordsServerSide();
                } else {
                    this.alertService.error(this.tradingDataUpdateResponse.message, 'Error');
                }
            },
            error =>
            {
                this.alertService.error(error.message, 'Error');
            });

            if(statusUpdateData.isAccepted == 'Y')
            {
                const tradingDataUpdate =
                {
                    id: this.tradingId,
                    progress: '20',
                    progress_info: '2',
                    updatedBy: localStorage.getItem('userId')
                };
                this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`, tradingDataUpdate, headerOptions).subscribe( res =>{});
            } else {
                var finalUpdateData = {};
                finalUpdateData['id'] = this.tradingId;
                if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
                {
                    finalUpdateData['chartererId'] = null;
                }
                if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
                {
                    finalUpdateData['ownerId'] = null;
                    finalUpdateData['vesselId'] = null;
                }
                this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`, finalUpdateData, headerOptions).subscribe( res =>{});
            }

            if(localStorage.getItem('userRoleId') == '4')
            {
                var UpdateMessage = (statusUpdateData.isAccepted == 'Y') ? 'Charterer Accepted Bid' : 'Charterer Rejected Bid';
                var userName =  this.chartererNameNotification;
                var identifier = this.tradingId;
                var acceptedRejected = (updateData['isAccepted'] == 'Y') ? 'Accepted' : 'Rejected';
                var updateMessageForNotification = userName + ' '+acceptedRejected+' Bid '+identifier;
            }

            if(localStorage.getItem('userRoleId') == '6')
            {
                var UpdateMessage = (statusUpdateData.isAccepted == 'Y') ? 'Owner Accepted Offer' : 'Owner Rejected OfferfownerDropdownView';
                var userName =  this.ownerNameNotification;
                var identifier = this.tradingId;
                var acceptedRejected = (updateData['isAccepted'] == 'Y') ? 'Accepted' : 'Rejected';
                var updateMessageForNotification = userName + ' '+acceptedRejected+' Bid '+identifier;
            }

            const tradingMessageData =
            {
                tradingId       :       this.tradingId,
                message         :       UpdateMessage,
                createdBy       :       localStorage.getItem('userId'),
                updatedBy       :       localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingMessageInsert`,
            tradingMessageData, headerOptions).subscribe(res =>{},err =>{});

            const tradingNotificationData =
            {
                fromUserId      :       localStorage.getItem('userId'),
                toUserId        :       this.brokerId,
                notification    :       updateMessageForNotification,
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
                        notification    :       updateMessageForNotification,
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
                        notification    :       updateMessageForNotification,
                        createdBy       :       localStorage.getItem('userId'),
                        updatedBy       :       localStorage.getItem('userId')
                    };
                    this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                    tradingNotificationData, headerOptions).subscribe(res =>{},err =>{});
                }
            }
            
            if(this.ownerId != '' && this.ownerId != null && this.ownerId != undefined)
            {
                const tradingProgressData =
                {
                    tradingId       :       this.tradingId,
                    ownerId         :       this.ownerId,
                    brokerId        :       localStorage.getItem('userId'),
                    chartererId     :       null,
                    message         :       UpdateMessage,
                    createdBy       :       localStorage.getItem('userId'),
                    updatedBy       :       localStorage.getItem('userId')
                };
                this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                tradingProgressData, headerOptions).subscribe(res =>{},err =>{});
            }
            
            if(this.chartererId != '' && this.chartererId != null && this.chartererId != undefined)
            {
                const tradingProgressData =
                {
                    tradingId       :       this.tradingId,
                    ownerId         :       null,
                    brokerId        :       localStorage.getItem('userId'),
                    chartererId     :       this.chartererId,
                    message         :       UpdateMessage,
                    createdBy       :       localStorage.getItem('userId'),
                    updatedBy       :       localStorage.getItem('userId')
                };
                this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                tradingProgressData, headerOptions).subscribe(res =>{},err =>{});
            }
            this.tradingRecordsServerSide();
        }
    }
    // Executed Form Submit End

    // Hide Performa Modal Start
    hideExecutedModal(): void
    {
        this.executedModal = !this.executedModal;
    }
    // Hide Performa Modal End

    // Accept / Reject Charterer Owner Request Start
    acceptRejectChartererOwnerTradeRequest(): void
    {
        var updateData = {};
            updateData['tradingId'] = this.tradingId;
            updateData['isAccepted'] = this.statusAction;
            updateData['updatedBy'] = localStorage.getItem('userId');
        
        if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            updateData['chartererId'] = this.chartererId;
        }

        if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            updateData['ownerId'] = this.ownerId;
        }

        // const statusUpdateData =
        // {
        //     tradingId: this.tradingId,
        //     ownerId: this.ownerId,
        //     chartererId: this.chartererId,
        //     isAccepted: this.statusAction,
        //     updatedBy: localStorage.getItem('userId'),
        // };
        this._userService.TradingPlatformRequestStatusUpdateCommon(updateData).pipe(first()).subscribe(data =>
        {
            this.tradingDataUpdateResponse = data;
            if (this.tradingDataUpdateResponse.success === true)
            {
                this.alertService.success(this.tradingDataUpdateResponse.message, 'Success');
                if(updateData['isAccepted'] == 'Y')
                {
                    this.activeModalStatus = !this.activeModalStatus;
                } else {
                    this.inActiveModalStatus = !this.inActiveModalStatus;
                }
                this.tradingRecordsServerSide();
            } else {
                this.alertService.error(this.tradingDataUpdateResponse.message, 'Error');
            }
        },
        error =>
        {
            this.alertService.error(error.message, 'Error');
        });

        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        if(updateData['isAccepted'] == 'Y')
        {
            const tradingDataUpdate =
            {
                id: this.tradingId,
                progress: '20',
                progress_info: '2',
                updatedBy: localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`, tradingDataUpdate, headerOptions).subscribe( res =>{});
        } else {
            var finalUpdateData = {};
                finalUpdateData['id'] = this.tradingId;
            if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
            {
                finalUpdateData['chartererId'] = null;
            }
            if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
            {
                finalUpdateData['ownerId'] = null;
                finalUpdateData['vesselId'] = null;
            }
            this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`, finalUpdateData, headerOptions).subscribe( res =>{});
        }

        if(localStorage.getItem('userRoleId') == '4')
        {
            var UpdateMessage = (updateData['isAccepted'] == 'Y') ? 'Charterer Accepted Bid' : 'Charterer Rejected Bid';
            var userName =  this.chartererNameNotification;
            var identifier = this.tradingId;
            var acceptedRejected = (updateData['isAccepted'] == 'Y') ? 'Accepted' : 'Rejected';
            var updateMessageForNotification = userName + ' '+acceptedRejected+' Bid '+identifier;
        }

        if(localStorage.getItem('userRoleId') == '6')
        {
            var UpdateMessage = (updateData['isAccepted'] == 'Y') ? 'Owner Accepted Offer' : 'Owner Rejected Offer';
            var userName =  this.ownerNameNotification;
            var identifier = this.tradingId;
            var acceptedRejected = (updateData['isAccepted'] == 'Y') ? 'Accepted' : 'Rejected';
            var updateMessageForNotification = userName + ' '+acceptedRejected+' Bid '+identifier;
        }

        const tradingMessageData =
        {
            tradingId       :       this.tradingId,
            message         :       UpdateMessage,
            createdBy       :       localStorage.getItem('userId'),
            updatedBy       :       localStorage.getItem('userId')
        };
        this.http.post(`${config.baseUrl}/tradingMessageInsert`,
        tradingMessageData, headerOptions).subscribe(res =>{},err =>{});

        const tradingNotificationData =
        {
            fromUserId      :       localStorage.getItem('userId'),
            toUserId        :       this.brokerId,
            notification    :       updateMessageForNotification,
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
                    notification    :       updateMessageForNotification,
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
                    notification    :       updateMessageForNotification,
                    createdBy       :       localStorage.getItem('userId'),
                    updatedBy       :       localStorage.getItem('userId')
                };
                this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                tradingNotificationData, headerOptions).subscribe(res =>{},err =>{});
            }
        }
        
        if(this.ownerId != '' && this.ownerId != null && this.ownerId != undefined)
        {
            const tradingProgressData =
            {
                tradingId       :       this.tradingId,
                ownerId         :       this.ownerId,
                brokerId        :       localStorage.getItem('userId'),
                chartererId     :       null,
                message         :       UpdateMessage,
                createdBy       :       localStorage.getItem('userId'),
                updatedBy       :       localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingProgressInsert`,
            tradingProgressData, headerOptions).subscribe(res =>{},err =>{});
        }
        
        if(this.chartererId != '' && this.chartererId != null && this.chartererId != undefined)
        {
            const tradingProgressData =
            {
                tradingId       :       this.tradingId,
                ownerId         :       null,
                brokerId        :       localStorage.getItem('userId'),
                chartererId     :       this.chartererId,
                message         :       UpdateMessage,
                createdBy       :       localStorage.getItem('userId'),
                updatedBy       :       localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingProgressInsert`,
            tradingProgressData, headerOptions).subscribe(res =>{},err =>{});
        }
    }
    // Accept / Reject Charterer Owner Request End

    // Trade Edit View Start
    editView(tradingId) : void
    {
        const reqData =
        {
            mainUserId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            tradingId: tradingId,
            isTrading : '1'
        };
        localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
        this.router.navigate(['/apps/drawCp-Clauses-management']);
    }
    // Trade Edit View End

    // Trade Recap View Start
    recapView(tradingId)
    {
        const reqData =
        {
            mainUserId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            tradingId: tradingId,
            isTrading : '1',
        };
        localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
        this.router.navigate(['/apps/recap-management']);
    }
    // Trade Recap View End
}