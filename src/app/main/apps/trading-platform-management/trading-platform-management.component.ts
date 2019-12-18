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
    identifier : string;
    CPTypeId: string;
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
    newAction : string;
    std_bid_name : string;
}

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

    CharterPartyFormName:String;
    charterPartyTypeName: string;
    chartererName: string;
    ownerName: string;
    vesselName: string;
    charterBrokerName: string;
    ownerBrokerName: string;
    
    newAction : string;
    
    std_bid_name : string;
}

@Component(
{
    selector: 'app-trading-platform-management',
    templateUrl: './trading-platform-management.component.html',
    styleUrls: ['./trading-platform-management.component.scss']
})

export class TradingPlatformManagementComponent implements OnInit
{

    displayedColumns: string[] = ['identifier','cpDateInfo', 'chartererName', 'ownerName', 'vesselName', 'progress','statusInfo','isAccepted','newAction'];

    dataSource = new MatTableDataSource<PeriodicElement>();
    dataSourceFilter = new MatTableDataSource<PeriodicElement>();

    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    applyFilter(filterValue: string)
    {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    applyFilterExecuted(filterValue: string)
    {
        this.dataSourceFilter.filter = filterValue.trim().toLowerCase();
    }


    id: string;
    identifier : string;

    tradingId : string;

    drawId : string;
    chartererId: string;

    CPTypeId: string;
    formId: string;
    vesselId: string;
    ownerId: string;
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

    alertMessage : string;

    CPTypeIdSearch: string;
    formIdSearch: string;
    vesselIdSearch: string;
    ownerIdSearch: string;
    chartererIdSearch: string;
    cpDateSearch: string;
    drawCPIDSearch: string;

    std_bid_name : string;

    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive: string;
    isDelete: string;
    drawManagement: any;
    drawManagementRes: any;
    drawManagementData= [];

    drawManagementResFilter: any;
    drawManagementDataFilter = [];

    cols: any[];
    drawRecordsListRes: any;
    drawRecordsListData: any;

    DrawManagementSearchForm: FormGroup;

    DrawManagementForm: FormGroup;
    stdDivManagementForm: FormGroup;

    loading = false;
    submitted = false;
    createtypeRes :any;
    returnUrl: string;
    cpFormId:String;
    clauseTerms :any;
    clauseTermsRes: any;
    clauseTermsData: any;

    drawCPDataList: any;
    drawCPDataData: any;

    cpFormList: any;
    cpFormData: any;

    VesselList: any;
    VesselData: any;

    CharterPartyTypeList: any;
    CharterPartyTypeData: any;

    ChartereInfoList: any;
    ChartereInfoData=[];

    termsUpdateRes : any;

    termsReviewRecordsResponse : any;
    termsReviewRecordsData = [];

    clauseCategoryTermsResponse : any;
    clauseCategoryTermsData = [];

    clauseCategoryTermsReviewResponse : any;
    clauseCategoryTermsReviewData = [];

    CharterPartyTypeArray = [];

    charterPartyTypeID : string;

    formIdValueForDrawRecords;
    vesselIdValueForDrawRecords;
    cpDateValueForDrawRecords;
    chartererIdValueForDrawRecords;
    drawCPIDForDrawRecords;

    show = false;

    brokerDivShow = true;

    chartererDivShow : any;

    existingDrawCP = true;
    existingDrawCPButton = false;

    mainDrawCPDiv = false;

    drawRecordsFilterShow = false;
    drawRecordsTableShow = false;
    drawRecordsTableShowButton = false;

    standardOffersFormDivShow = false;
    standardOffersFormTableShow = false;

    clauseViewButtonShow = false;

    drawFormDivShow = false;

    stdDivShow = false;
    stdDivButtonShow = true;

    drawCharteAcceptRejectResponse : any;
    drawCharteAcceptRejectResponseData = [];

    activeModalStatus = false;
    inActiveModalStatus = false;

    dataID : string;
    statusAction : string;

    updateDataReqeust : any;

    buttonInfo : any;

    isEditView = false;
    isRecapView = false;
    isPdfView = false;

    ownerRecordResponse : any;
    ownerRecordData = [];

    ownerMultiple = [];

    ownerName :  string;
    ownerEmailID : string;
    ownerMobileNumber : string;
    ownerStatus : string;
    ownerStatusInfo : string;

    chartererName : string;
    chartererEmailID : string;
    chartererMobileNumber : string;
    chartererStatus : string;
    chartererStatusInfo : string;

    companyName : string;
    stdTableView = false;

    companyResponse : any;
    companyResponseData = [];

    tradingInfoResponse: any;
    tradingInfoResponseData = [];

    tradingStatusInfoResponse: any;
    tradingStatusInfoResponseData = [];
    
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
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
        this.dataSource = new MatTableDataSource(this.drawManagementData);
        this.dataSourceFilter = new MatTableDataSource(this.drawManagementData);
    }

    ngOnInit()
    {
        this.ownerStatusInfo = 'P';
        this.chartererStatusInfo = 'P';

        this.ownerStatus = 'Pending';
        this.chartererStatus = 'Pending';

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSourceFilter.paginator = this.paginator;
        this.dataSourceFilter.sort = this.sort;

        this.DrawManagementForm = this._formBuilder.group(
        {
            formId: ['', Validators.required],
            vesselId: ['', Validators.required],
            cpDate: ['', Validators.required],
            chartererId: ['', Validators.required],
        
        });

        this.DrawManagementSearchForm = this._formBuilder.group(
        {
            formIdSearch: ['', ''],
            vesselIdSearch: ['', ''],
            cpDateSearch: ['', ''],
            chartererIdSearch: ['', ''],
            drawCPIDSearch: ['', ''],
        
        });

        this.stdDivManagementForm = this._formBuilder.group(
        {
            formIdStdBid: ['', Validators.required],
            // invited_owners: ['', Validators.required],
            std_bid_name: ['', Validators.required],
            // vesselIdStdBid: ['', Validators.required],
            // cpDateStdBid: ['', Validators.required],
            chartererIdStdBid: ['', Validators.required],
            ownerIdStdBid: ['', Validators.required],
        });

        if(JSON.parse(localStorage.getItem('userRoleId')) == '3')
        {
            this.isEditView = true;    
            this.isRecapView = true;
            this.isPdfView = true;
        }

        if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            this.isEditView = true;    
            this.isRecapView = false;
            this.isPdfView = false;
        }

        if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            this.isEditView = true;    
            this.isRecapView = false;
            this.isPdfView = false;
        }

        this.CPTypeId = '1';

        this.chartererDivShow = 'N';
        if(JSON.parse(localStorage.getItem('userRoleId')) == 4)
        {
            this.chartererDivShow = 'Y';
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.dataSourceFilter.paginator = this.paginator;
            this.dataSourceFilter.sort = this.sort;
            this.TradingPlatformRecordsServerSideCharterer();
        } else {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.dataSourceFilter.paginator = this.paginator;
            this.dataSourceFilter.sort = this.sort;
            this.TradingFormRecords();
        }

        this.cpFormsRecords();
        this.vesselRecords();
        this.CPRecords();
        this.ChartereRecords();
        this.tradingPlatformRecordsServerSide();
        this.fetchOwnerData();
        this.getCompanyName();

        this.charterPartyTypeID = '2';

        if(localStorage.getItem('userRoleId') != '3')
        {
            this.brokerDivShow = false;
        }

        this.buttonInfo = 'View / Update Clause';
    }

     // Fetch Company Data
     getCompanyName()
     {
        var filter = {};
            filter['id'] = localStorage.getItem('companyId');
        try
        {
            this._userService.getCompanyName(filter).pipe(first()).subscribe((res) =>
            {
                this.companyResponse = res;
                if (this.companyResponse.success === true)
                {
                    this.companyResponseData = this.companyResponse.data;
                    this.companyName = this.companyResponseData[0].companyName;
                    console.log(this.companyName);
                }
            }, err => {  });
        } catch (err){  }
     }

    // Fetch Owner Data
    fetchOwnerData()
    {
        var filter = {};
            filter['companyId'] = this.companyId;
            filter['userRoleId'] = '6';
        try
        {
            this._userService.userRecordsServerSide(filter).pipe(first()).subscribe((res) =>
            {
                this.ownerRecordResponse = res;
                if (this.ownerRecordResponse.success === true)
                {
                    this.ownerRecordData = this.ownerRecordResponse.data;
                }
            }, err => { console.log(err); });
        } catch (err)
        { console.log(err); }
    }

    // Owner On Change
    onChangeOwner(event)
    {
        this.ownerId =  event.value;
        let target = event.source.selected._element.nativeElement;
        this.ownerName = target.innerText.trim();
        for(let index = 0; index < this.ownerRecordData.length; index++)
        {
            if(this.ownerId == this.ownerRecordData[index].id)
            {
                this.ownerEmailID = this.ownerRecordData[index].email;
                this.ownerMobileNumber = this.ownerRecordData[index].mobileNo;
            }
        }
    }


    recapView(tradingId,formId,chartererId)
    {
        const reqData =
        {
            mainUserId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            tradingId: tradingId,
            formId : formId,
            chartererId : chartererId,
            isTrading : '1',
        };
        console.log(reqData,"Recap View");
        localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
        this.router.navigate(['/apps/recap-management']);
    }

    editView(tradingId,formId,chartererId,isStdBid,ownerId,std_bid_name) : void
    {
        console.log(isStdBid);
        this.tradingId = tradingId;
        this.chartererId = chartererId;
        this.ownerId = ownerId;
        console.log(std_bid_name);

        const reqData =
        {
            mainUserId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            tradingId: tradingId,
            formId : formId,
            chartererId : chartererId,
            isTrading : '1',
            isStdBid : isStdBid,
            std_bid_name : std_bid_name,
        };
        console.log(reqData);

        localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
        if(isStdBid == 'N')
        {
            this.router.navigate(['/apps/drawCp-Clauses-management']);
        } else {

            this.existingDrawCP = false;
            this.brokerDivShow = false;
            this.existingDrawCPButton = false;
            this.drawRecordsFilterShow = false;
            this.drawRecordsTableShow = false;
            this.drawRecordsTableShowButton = false;
            this.drawFormDivShow = false;

            var filter = {};
                filter['tradingId'] = tradingId;
                filter['ownerId'] = this.ownerId;
                filter['chartererId'] = this.chartererId;
            try
            {
                this._userService.fetchTradingStdBidReady(filter).pipe(first()).subscribe((res) =>
                {
                    this.tradingStatusInfoResponse = res;
                    if (this.tradingStatusInfoResponse.success === true)
                    {
                        this.tradingStatusInfoResponseData = this.tradingStatusInfoResponse.data;

                        this.ownerStatusInfo =  this.tradingStatusInfoResponseData['isOwnerAccepted'];
                        this.chartererStatusInfo =  this.tradingStatusInfoResponseData['isChartererAccepted'];
                        
                        if(this.ownerStatusInfo == 'Y' && this.chartererStatusInfo == 'Y')
                        {
                            this.router.navigate(['/apps/drawCp-Clauses-management']);
                        } else {
                            this.ownerStatus = (this.ownerStatusInfo == 'Y') ? 'Accepted' : this.ownerStatus;
                            this.ownerStatus = (this.ownerStatusInfo == 'N') ? 'Rejected' : this.ownerStatus;

                            this.chartererStatus = (this.chartererStatusInfo == 'Y') ? 'Accepted' : this.chartererStatus;
                            this.chartererStatus = (this.chartererStatusInfo == 'N') ? 'Rejected' : this.chartererStatus;

                            this.stdDivManagementForm = this._formBuilder.group(
                            {
                                formIdStdBid        :   [formId, Validators.required],
                                std_bid_name        :   [std_bid_name, Validators.required],
                                chartererIdStdBid   :   [chartererId, Validators.required],
                                ownerIdStdBid       :   [ownerId, Validators.required],
                            });
                
                            for(let index = 0; index < this.ownerRecordData.length; index++)
                            {
                                if(this.ownerId == this.ownerRecordData[index].id)
                                {
                                    this.ownerName = this.ownerRecordData[index].username;
                                    this.ownerEmailID = this.ownerRecordData[index].email;
                                    this.ownerMobileNumber = this.ownerRecordData[index].mobileNo;
                                }
                            }
                
                            for(let index = 0; index < this.ChartereInfoData.length; index++)
                            {
                                if(this.chartererId == this.ChartereInfoData[index].id)
                                {
                                    this.chartererName = this.ChartereInfoData[index].username;
                                    this.chartererEmailID = this.ChartereInfoData[index].email;
                                    this.chartererMobileNumber = this.ChartereInfoData[index].mobileNo;
                                }
                            }
                            
                            this.mainDrawCPDiv = true;
                            this.stdDivShow = true;
                
                            this.CharterPartyTypeArray = [];
                
                            for(let index = 0; index < this.CharterPartyTypeData.length; index++)
                            {
                                this.CharterPartyTypeData[index]['isChecked'] = 'N';
                                if(this.CharterPartyTypeData[index].id == '3')
                                {
                                    this.CharterPartyTypeData[index]['isChecked'] = 'Y';
                                }
                                this.CharterPartyTypeArray.push(this.CharterPartyTypeData[index]);
                            }
                            this.stdTableView = true;
                        }
                    }
                }, err => { console.log(err); });
            } catch (err)
            { console.log(err); }
        }
    }

    setDrawID(tradingId,formId,chartererId) : void
    {
        this.tradingId = tradingId;
        this.formId = formId;
        this.chartererId = chartererId;
        this.existingDrawCPButton = true;
    }

    setDrawIDExecuted(tradingId,formId,chartererId) : void
    {
        this.tradingId = tradingId;
        this.formId = formId;
        this.chartererId = chartererId;
        this.drawRecordsTableShowButton = true;
    }

    getTermsReviewData() : void
    {
        const reqData =
        {
            mainUserId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            tradingId: this.tradingId,
            formId : this.formId,
            chartererId : this.chartererId,
            isTrading : '1',
        };
        console.log(reqData);
        localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
        this.router.navigate(['/apps/drawCp-Clauses-management']);
    }
    
    claueseDetailInsertUpdate() : void
    {   
       // console.log("HERE IN TERMS INSERT UPDATE");
        
        var mainUserId = localStorage.getItem('userId');
       // console.log(mainUserId +" Main User ID");

        var companyId = localStorage.getItem('companyId');
       // console.log(companyId + " Company ID");

        var tradingId = this.tradingId;
       // console.log(tradingId + " Draw ID");

        var formId = this.formId;
       // console.log(formId + " CP Form ID");

        var clauseCategoryId = '1';
       // console.log(clauseCategoryId + " Clause Category ID");

        var clauseTermsId = '1';
       // console.log(clauseTermsId + " Clause Terms ID");

        var nos = '1';
       // console.log(nos + " Nos");

        var termsNameOrginal = 'Clause Terms 1';
       // console.log(termsNameOrginal + " Terms Orginal Name");

        var termsName = 'Clause Terms 1 2 Custom';
       // console.log(termsName + " Terms Name");

        const req =
        {
            mainUserId:mainUserId,
            companyId:companyId,
            tradingId: tradingId,
            formId:formId,
            clauseCategoryId: clauseCategoryId,
            clauseTermsId: clauseTermsId,
            nos: nos,
            termsNameOrginal: termsNameOrginal,
            termsName: termsName,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
        };
        
        try
        {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }

            // Post URL For Insert Update Without Custom = claueseDetailInsertUpdate
            // Post URL For Insert Update With Custom = claueseDetailCustomInsertUpdate

            this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(
                res =>
                {
                    this.termsUpdateRes = res;
                   console.log("HERE OUT RESPONSE");
                   console.log(this.termsUpdateRes);
                    if (this.termsUpdateRes.success === true)
                    {
                       // console.log("HERE IN RESPONSE");
                       // console.log(this.termsUpdateRes);
                    }
                }
            );
        } catch (err)
        {
        } 
    }



    drawCPFormView() : void
    {
        this.brokerDivShow = false;
        this.existingDrawCP = false;
        this.existingDrawCPButton = false;
        this.mainDrawCPDiv = true;
    }

    existingDrawCPView() : void
    {
        this.brokerDivShow = true;
        this.existingDrawCP = true;
        this.mainDrawCPDiv = false;
        this.mainDrawCPDiv = false;
        this.drawRecordsFilterShow = false;
        this.drawRecordsTableShow = false;
        this.drawRecordsTableShowButton = false;
        this.standardOffersFormDivShow = false;
        this.standardOffersFormTableShow = false;
        this.drawFormDivShow = false;
        this.stdDivShow = false;
        this.TradingFormRecords();
    }

    TradingFormRecords(): void
    {
        this.drawManagementData = [];
        
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
        // arrfilterInfo["dcm.createdBy"] = localStorage.getItem('userId');
        
        try
        {
            this._userService.TradingFormRecordsServerSide(arrfilterInfo)
                .pipe(first())
                .subscribe((res) =>
                {
                    this.drawManagementRes = res;
                   
                    this.drawManagementData = this.drawManagementRes.data;
                    this.dataSource = new MatTableDataSource(this.drawManagementRes.data);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;

                    // setTimeout(() => {
                    //     this.updateFilterPaginatorMainTrading();
                    // }, 1000);
                    
                    if (this.drawManagementRes.success === true)
                    {
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

    updateFilterPaginatorMainTrading()
    {
        console.log('HERE IN MAIN TRADING');
        console.log(this.drawManagementRes.data);
        this.dataSource = new MatTableDataSource(this.drawManagementRes.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }


    drawIdServerSide() : void
    {
        this.drawManagementData = [];

        var arrfilterInfo = {};

        var isCondition = 0;

        if(this.formIdValueForDrawRecords > 0)
        {
            isCondition = 1;
            arrfilterInfo["dcm.formId"] = this.formIdValueForDrawRecords;
        }
        if(this.vesselIdValueForDrawRecords > 0)
        {
            isCondition = 1;
            arrfilterInfo["dcm.vesselId"] = this.vesselIdValueForDrawRecords;
        }
        if(this.cpDateValueForDrawRecords != '')
        {
            isCondition = 1;
            arrfilterInfo["dcm.cpDate"] = this.cpDateValueForDrawRecords;
        }
        if(this.drawCPIDForDrawRecords > 0)
        {
            isCondition = 1;
            arrfilterInfo["dcm.chartererBrokerId"] = this.chartererIdValueForDrawRecords;
        }

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
        // arrfilterInfo["dcm.createdBy"] = localStorage.getItem('userId');

        arrfilterInfo["dcm.progress"] = '100';
        
        try
        {
            this._userService.TradingFormRecordsServerSide(arrfilterInfo).pipe(first()).subscribe((res) =>
            {
                this.drawManagementResFilter = res;
                this.drawFormDivShow = false;
                this.stdDivShow = false;
                this.drawRecordsTableShow = true;
                this.drawManagementData = this.drawManagementResFilter.data;
                this.dataSourceFilter = new MatTableDataSource(this.drawManagementResFilter.data);
                this.dataSourceFilter.paginator = this.paginator;
                this.dataSourceFilter.sort = this.sort;
                if (this.drawManagementResFilter.success === true)
                {
                   
                    localStorage.setItem('tradingId',this.drawManagementResFilter.data[0].id);
                }
                this.show = true;
            },
            err =>
            {
                this.alertService.error(err, 'Error');
            });
        } catch (err)
        {
        }
    }


    drawRecordsServerSide() : void
    {
        this.drawManagementData = [];

        var arrfilterInfo = {};

        var isCondition = 0;

        if(this.formIdValueForDrawRecords > 0)
        {
            isCondition = 1;
            arrfilterInfo["dcm.formId"] = this.formIdValueForDrawRecords;
        }
        if(this.vesselIdValueForDrawRecords > 0)
        {
            isCondition = 1;
            arrfilterInfo["dcm.vesselId"] = this.vesselIdValueForDrawRecords;
        }
        if(this.cpDateValueForDrawRecords != '')
        {
            isCondition = 1;
            arrfilterInfo["dcm.cpDate"] = this.cpDateValueForDrawRecords;
        }
        if(this.chartererIdValueForDrawRecords != '')
        {
            isCondition = 1;
            arrfilterInfo["dcm.chartererId"] = this.chartererIdValueForDrawRecords;
        }
        if(this.drawCPIDForDrawRecords > 0)
        {
            isCondition = 1;
            arrfilterInfo["dcm.id"] = this.drawCPIDForDrawRecords;
        }

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
        // arrfilterInfo["dcm.createdBy"] = localStorage.getItem('userId');
        arrfilterInfo["dcm.progress"] = '100';
        try
        {
            this._userService.TradingFormRecordsServerSide(arrfilterInfo).pipe(first()).subscribe((res) =>
            {
                this.drawManagementResFilter = res;
                this.drawFormDivShow = false;
                this.stdDivShow = false;
                this.drawRecordsTableShow = true;
                this.drawManagementData = this.drawManagementResFilter.data;
                
                setTimeout(() => {
                    this.updateFilterPaginator();
                }, 100);

                if (this.drawManagementResFilter.success === true)
                {
                   
                }
                this.show = true;
            },
            err =>
            {
                this.alertService.error(err, 'Error');
            });
        } catch (err)
        {
        }
    }

    
    updateFilterPaginator()
    {
        this.dataSourceFilter = new MatTableDataSource(this.drawManagementResFilter.data);
        this.dataSourceFilter.paginator = this.paginator;
        this.dataSourceFilter.sort = this.sort;
    }

    editdrawManagementData(data): void
    {
        localStorage.setItem('drawManagementData', JSON.stringify(data));
        this.router.navigate(['/apps/draw-management/edit']);
    }

    showDeleteModal(id): void
    {
        this.id = id;
        this.showModalStatus = !this.showModalStatus;
    }

    hideDeleteModal(): void
    {
        this.showModalStatus = !this.showModalStatus;
    }

    deletedrawManagementData(): void
    {
        const req =
        {
            id: this.id,
        };
        try
        {
            this.http
                .post(`${config.baseUrl}/TradingPlatformDataRemove`, req, {})
                .subscribe
                (
                    res =>
                    {
                        this.drawManagementRes = res;
                        if (this.drawManagementRes.success === true)
                        {
                            this.showModalStatus = false;
                            this.alertService.success('Successfully Deleted', 'Success');
                            this.TradingFormRecords();
                        } else {
                            this.alertService.error(this.drawManagementRes.message, 'Error');
                        }
                    },
                    err =>
                    {
                        this.alertService.error(err.message, 'Error');
                    }
                );
        } catch (err)
        {
        }
    }

    selected = new FormControl('valid', [
        Validators.required,
        Validators.pattern('valid'),
      ]);
    
      selectFormControl = new FormControl('valid', [
        Validators.required,
        Validators.pattern('valid'),
      ]);
    
      nativeSelectFormControl = new FormControl('valid', [
        Validators.required,
        Validators.pattern('valid'),
      ]);
    
    //   matcher = new MyErrorStateMatcher();

    get f() { return this.DrawManagementForm.controls; }
    get fStdBid() { return this.stdDivManagementForm.controls; }
    get fSearch() { return this.DrawManagementSearchForm.controls; }

    // Draw CP Form Records Fetch Start
    
        tradingPlatformRecordsServerSide(): void
        {
            var arrfilterInfo = {};

            arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');

            
            if(this.formIdValueForDrawRecords > 0)
            {
                
                arrfilterInfo["dcm.formId"] = this.formIdValueForDrawRecords;
            }
            if(this.vesselIdValueForDrawRecords > 0)
            {
                
                arrfilterInfo["dcm.vesselId"] = this.vesselIdValueForDrawRecords;
            }
            if(this.cpDateValueForDrawRecords != '')
            {
                
                arrfilterInfo["dcm.cpDate"] = this.cpDateValueForDrawRecords;
            }
            if(this.chartererIdValueForDrawRecords != '')
            {
                
                arrfilterInfo["dcm.chartererId"] = this.chartererIdValueForDrawRecords;
            }
            if(this.drawCPIDForDrawRecords > 0)
            {
                
                arrfilterInfo["dcm.id"] = this.drawCPIDForDrawRecords;
            }
            
            try
            {
                this._userService.TradingFormRecordsServerSide(arrfilterInfo)
                    .pipe(first())
                    .subscribe((res) =>
                    {
                        this.drawManagementRes = res;
                        if (this.drawManagementRes.success === true)
                        {
                            this.drawCPDataData = this.drawManagementRes.data;
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

        changeDrawCP(event): void
        {
            this.formId = event.value;
        }

    // Draw CP Form Records Fetch End

    // CP Records Fetch Start
    
    cpFormsRecords(): void
    {
        try
        {
            this.http.get(`${config.baseUrl}/cpFromlist`).subscribe(
                res =>
                {
                    this.cpFormList = res;
                    if (this.cpFormList.success)
                    {
                        this.cpFormData = this.cpFormList.data;
                    }
                },
                err =>
                {
                }
            );
        } catch (err)
        {
        }
    }

    changeCPForm(event): void
    {
        this.formId = event.value;
    }

    changeCPFormSearch(event): void
    {
        this.formId = event.value;
    }

// CP Form Records Fetch End

    // Vessel Records Fetch Start

        vesselRecords(): void
        {
            try
            {
                this.http.get(`${config.baseUrl}/vessellist`).subscribe(
                    res =>
                    {
                        this.VesselList = res;
                        if (this.VesselList.success)
                        {
                            this.VesselData = this.VesselList.data;
                        }
                    },
                    err => {
                    }
                );
            } catch (err)
            {
            }
        }

        changeVesselEvent(event): void
        {
            this.vesselId = event.value;
            for (let index = 0; index < this.VesselData.length; index++)
            {   
                if (this.VesselData[index].id == this.vesselId)
                {
                    this.ownerId = this.VesselData[index].id_owner;
                }
            }
        }

    // Vessel Records Fetch End

    // Charter Party Type Records Fetch Start

        CPRecords(): void
        {
            try
            {
                this.http.get(`${config.baseUrl}/charterpartylist`).subscribe(
                    res =>
                    {
                        this.CharterPartyTypeList = res;
                        if (this.CharterPartyTypeList.success)
                        {
                            this.CharterPartyTypeData = this.CharterPartyTypeList.data;
                        }

                        this.CharterPartyTypeList = res;
                        if (this.CharterPartyTypeList.success)
                        {
                            this.CharterPartyTypeList.data.forEach(valueData  => 
                            {
                                this.CharterPartyTypeArray.push(valueData);
                            });
                        }

                    },
                    err =>
                    {
                    }
                );
            } catch (err)
            {
            }
        }

        changeCharterPartyType(event): void
        {
            this.chartererId = event.target.value;
        }

    // Charter Party Type Records Fetch End

    // Charter Party Type Records Fetch Start

        ChartereRecords(): void
        {
        
            var filter = {};
                filter['companyId'] = JSON.parse(localStorage.getItem('companyId'));
                filter['userRoleId'] = '4';
            try
            {
                this._userService.userRecordsServerSide(filter).pipe(first()).subscribe((res) =>
                {
                    this.ChartereInfoList = res;
                    if (this.ChartereInfoList.success === true)
                    {
                        this.ChartereInfoData = this.ChartereInfoList.data;
                    }
                }, err => { console.log(err); });
            } catch (err)
            { console.log(err); }
        }

        changeChartererType(event): void
        {
            this.chartererId = event.value;
            let target = event.source.selected._element.nativeElement;
            this.chartererName = target.innerText.trim();
            for(let index = 0; index < this.ChartereInfoData.length; index++)
            {
                if(this.chartererId == this.ChartereInfoData[index].id)
                {
                    this.chartererEmailID = this.ChartereInfoData[index].email;
                    this.chartererMobileNumber = this.ChartereInfoData[index].mobileNo;
                }
            }
        }

    // Charter Party Type Records Fetch End

    // Set Applicable Charter Party Type Start

        setApplicabelCharterParty(Type): void
        {
            this.formId = '';
            this.vesselId = '';
            this.cpDate = '';
            this.chartererId = '';
            this.ownerId = '';

            this.formIdSearch = '';
            this.vesselIdSearch = '';
            this.cpDateSearch = '';
            this.chartererIdSearch = '';
            this.chartererId = '';
            this.ownerId = '';

            this.DrawManagementForm = this._formBuilder.group(
            {
            
                formId: ['', Validators.required],
                vesselId: ['', Validators.required],
                cpDate: ['', Validators.required],
                chartererId: ['', Validators.required],
            });

            this.stdDivManagementForm = this._formBuilder.group(
            {
                formIdStdBid: ['', Validators.required],
                // invited_owners: ['', Validators.required],
                std_bid_name: ['', Validators.required],
                // vesselIdStdBid: ['', Validators.required],
                // cpDateStdBid: ['', Validators.required],
                chartererIdStdBid: ['', Validators.required],
                ownerIdStdBid: ['', Validators.required],
            });
    
            this.DrawManagementSearchForm = this._formBuilder.group(
            {
                formIdSearch: ['', ''],
                vesselIdSearch: ['', ''],
                cpDateSearch: ['', ''],
                chartererIdSearch: ['', ''],
                drawCPIDSearch: ['', ''],
            });

            // this.DrawManagementSearchForm.reset(); 
            // this.DrawManagementForm.reset(); 

            this.drawRecordsFilterShow = false;
            this.drawRecordsTableShow = false;
            this.drawRecordsTableShowButton = false;
            this.drawFormDivShow = false;
            this.stdDivShow = false;
            this.CPTypeId = Type;
            if(Type == 1)
            {
                this.drawRecordsFilterShow = true;
            }
            if(Type == 2)
            {
                this.drawFormDivShow = true;
            }
            if(Type == 3)
            {
                this.stdDivShow = true;
            }
        }

    // Set Applicable Charter Party Type End
 
    onSubmit(): void
    {
        this.submitted = true;
        this.alertService.clear();
        if (this.DrawManagementForm.invalid)
        { 
            return;
        } else {

            var convertedDate = moment(this.f.cpDate.value).format("YYYY-MM-DD");

            this.formIdValueForDrawRecords      =       this.f.formId.value;
            this.vesselIdValueForDrawRecords    =       this.f.vesselId.value,
            this.cpDateValueForDrawRecords      =       convertedDate,
            this.chartererIdValueForDrawRecords =       this.f.chartererId.value;

            // localStorage.setItem('userId','1');

            // this.drawRecordsServerSide();

            const req =
            {
                CPTypeId:this.CPTypeId,
                formId:this.formIdValueForDrawRecords,
                vesselId: this.vesselIdValueForDrawRecords,
                ownerId:this.ownerId,
                cpDate: this.cpDateValueForDrawRecords,
                chartererBrokerId: localStorage.getItem('userId'),
                chartererId: this.chartererIdValueForDrawRecords,
                ownerBrokerId: localStorage.getItem('userId'),
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                companyId: localStorage.getItem('companyId'),
            };
            
            localStorage.setItem('cpFormId',req.formId);
            
            this.loading = true;
            try
            {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/TradingFormCreate`, req, headerOptions).subscribe(
                    res =>
                    {
                        this.createtypeRes = res;
                        if (this.createtypeRes.success === true)
                        {
                            this.tradingId = this.createtypeRes.data[0];
                            this.alertService.success(this.createtypeRes.message, 'Success');
                            // this.DrawManagementForm.reset();
                            // this.drawIdServerSide();

                            const reqData =
                            {
                                mainUserId: localStorage.getItem('userId'),
                                companyId: localStorage.getItem('companyId'),
                                tradingId: this.tradingId,
                                formId : req.formId,
                                chartererId : this.chartererIdValueForDrawRecords,
                                isTrading : '1',
                            };
                            console.log(reqData);
                            localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
                            this.router.navigate(['/apps/drawCp-Clauses-management']);
                            // this.drawRecordsServerSide();
                        } else {
                            this.alertService.error(this.createtypeRes.message, 'Error');
                        }
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
    
    onSubmitStdBidOffer(): void
    {
        console.log('HERE IN STD BID SUBMIT');
        this.submitted = true;
        this.alertService.clear();
        if (this.stdDivManagementForm.invalid)
        { 
            console.log(this.stdDivManagementForm);
            return;
        } else {

            // var convertedDate = moment(this.fStdBid.cpDateStdBid.value).format("YYYY-MM-DD");

            this.formIdValueForDrawRecords      =       this.fStdBid.formIdStdBid.value;
            // this.vesselIdValueForDrawRecords    =       this.fStdBid.vesselIdStdBid.value,
            // this.cpDateValueForDrawRecords      =       convertedDate,
            // this.chartererIdValueForDrawRecords =       this.fStdBid.chartererIdStdBid.value;
            this.std_bid_name = this.fStdBid.std_bid_name.value;

            var owners = this.ownerMultiple.join();
            console.log(owners);
            
            const req =
            {
                CPTypeId:this.CPTypeId,
                formId:this.formIdValueForDrawRecords,
                vesselId: null,
                ownerId:this.ownerId,
                std_bid_name:this.std_bid_name,
                invited_owners:'',
                cpDate: this.cpDateValueForDrawRecords,
                chartererBrokerId: localStorage.getItem('userId'),
                chartererId: this.chartererId,
                ownerBrokerId: localStorage.getItem('userId'),
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                companyId: localStorage.getItem('companyId'),
            };

            console.log(req);
            
            localStorage.setItem('cpFormId',req.formId);
            
            this.loading = true;
            try
            {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/TradingStandardFormCreate`, req, headerOptions).subscribe(
                res =>
                {
                    this.createtypeRes = res;
                    if (this.createtypeRes.success === true)
                    {
                        this.tradingId = this.createtypeRes.data[0];
                        
                        const ownerNotificationData =
                        {
                            fromUserId      :       localStorage.getItem('userId'),
                            toUserId        :       this.ownerId,
                            ownerId         :       this.ownerId,
                            chartererId     :       null,
                            tradingId       :       this.tradingId,
                            email           :       this.ownerEmailID,
                            notification    :       'You are invited for trading standard bid',
                            createdBy       :       localStorage.getItem('userId'),
                            updatedBy       :       localStorage.getItem('userId')
                        };

                        this.http.post(`${config.baseUrl}/tradingEmailIDAndNotificationSend`, ownerNotificationData, headerOptions).subscribe(res =>{},err =>{});

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

                        this.stdTableView = true;
                        this.stdDivButtonShow = false;

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



    fetchDrawRecords(): void
    {
        this.alertService.clear();
        
        var isValid = 1;

        if(isValid == 0)
        {
            return;
        }  else {
            var convertedDate = moment(this.fSearch.cpDateSearch.value).format("YYYY-MM-DD");
            if(this.fSearch.formIdSearch.value)
            {
                this.formIdValueForDrawRecords      =       this.fSearch.formIdSearch.value;
            }
            if(this.fSearch.vesselIdSearch.value)
            {
                this.vesselIdValueForDrawRecords      =       this.fSearch.vesselIdSearch.value;
            }
            if(this.fSearch.cpDateSearch.value)
            {
                this.cpDateValueForDrawRecords      =       convertedDate;
            }
            if(this.fSearch.chartererIdSearch.value)
            {
                this.chartererIdValueForDrawRecords      =       this.fSearch.chartererIdSearch.value;
            }
            if(this.fSearch.drawCPIDSearch.value)
            {
                this.drawCPIDForDrawRecords      =       this.fSearch.drawCPIDSearch.value;
            }
            this.drawRecordsServerSide();
        }
    }

    TradingPlatformRecordsServerSideCharterer(): void
    {
        this.drawManagementData = [];
        var arrfilterInfo = {};
        arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
        arrfilterInfo["dcm.chartererId"] = localStorage.getItem('userId');
        arrfilterInfo["ds.chartererId"] = localStorage.getItem('userId');
        try
        {
            this._userService.TradingPlatformRecordsServerSideCharterer(arrfilterInfo)
                .pipe(first())
                .subscribe((res) =>
                {
                    this.drawManagementRes = res;
                    if (this.drawManagementRes.success === true)
                    {
                        this.drawManagementData = this.drawManagementRes.data;
                        this.dataSource = new MatTableDataSource(this.drawManagementData);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    }
                    console.log(this.dataSource)
                },
                err =>
                {
                    this.alertService.error(err, 'Error');
                });
            } catch (err)
            {
            }
    }

    updateDataStatus(): void
    {
        const req =
        {
            id: this.dataID,
            isAccepted: this.statusAction,
            updatedBy: localStorage.getItem('userId'),
        };
        this._userService.TradingPlatformRequestStatusUpdate(req)
            .pipe(first())
            .subscribe(
            data =>
            {
                this.updateDataReqeust = data;
                if (this.updateDataReqeust.success === true)
                {
                    this.alertService.success(this.updateDataReqeust.message, 'Success');
                    if(req.isAccepted == 'Y')
                    {
                        this.activeModalStatus = !this.activeModalStatus;
                    } else {
                        this.inActiveModalStatus = !this.inActiveModalStatus;
                    }
                    this.TradingPlatformRecordsServerSideCharterer();
                } else {
                    this.alertService.error(this.updateDataReqeust.message, 'Error');
                }
            },
            error =>
            {
                this.alertService.error(error.message, 'Error');
            });
    }

    showActiveModal(status,id): void
    {
        this.dataID = id;
        this.statusAction = status;
        this.activeModalStatus = !this.activeModalStatus;
    }

    hideActiveModal(): void
    {
        this.activeModalStatus = !this.activeModalStatus;
    }

    showInActiveModal(status,id): void
    {
        this.dataID = id;
        this.statusAction = status;
        this.inActiveModalStatus = !this.inActiveModalStatus;
    }

    hideInActiveModal(): void
    {
        this.inActiveModalStatus = !this.inActiveModalStatus;
    }

}