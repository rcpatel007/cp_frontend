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

import { UserService } from '../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../_services';

import { getNumberOfCurrencyDigits } from '@angular/common';

import {FormGroupDirective, NgForm,} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
// import { $ } from 'protractor';

export interface UserData
{
    id: string;
    CPTypeId: string;
    formId: string;
    vesselId: string;
    ownerId: string;
    chartererId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
    cpTime: string;
    cpCity: string;
    cpSubject: string;
    cpLiftDate: string;
    cpLiftTime: string;
    cpLiftCity: string;
    companyId: string;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }

  export class SelectErrorStateMatcherExample {
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
  
    matcher = new MyErrorStateMatcher();
  }

export interface PeriodicElement
{
    
    id:String;
    CPTypeId:String;
    formId: string;
    vesselId: string;
    ownerId: string;
    chartererId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
    cpTime: string;
    cpCity: string;
    cpSubject: string;
    cpLiftDate: string;
    cpLiftTime: string;
    cpLiftCity: string;
    companyId: string;

    CharterPartyFormName:String;
    charterPartyTypeName: string;
    chartererName: string;
    ownerName: string;
    vesselName: string;
    charterBrokerName: string;
    ownerBrokerName: string;
}


@Component(
{
    selector: 'app-draw',
    templateUrl: './draw.component.html',
    styleUrls: ['./draw.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class DrawComponent implements OnInit
{
    displayedColumns: string[] = ['action','id','cpDate', 'chartererName', 'ownerName', 'vesselName', 'progress','statusInfo'];

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
    
    drawId : string;

    CPTypeId: string;
    formId: string;
    vesselId: string;
    ownerId: string;
    chartererId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
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

    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive: string;
    isDelete: string;
    drawManagement: any;
    drawManagementRes: any;
    drawManagementData= [];
    cols: any[];
    drawRecordsListRes: any;
    drawRecordsListData: any;

    DrawManagementSearchForm: FormGroup;

    DrawManagementForm: FormGroup;
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
        this.dataSource = new MatTableDataSource(this.drawManagementData);
        this.dataSourceFilter = new MatTableDataSource(this.drawManagementData);
    }

    ngOnInit()
    {
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
            drawCPIDSearch: ['', ''],
        
        });

        this.CPTypeId = '1';

        this.drawManagementRecords();

        this.cpFormsRecords();
        this.vesselRecords();
        this.CPRecords();
        this.ChartereRecords();
        this.drawCPRecords();

        this.charterPartyTypeID = '2';

        this.termsReviewRecords();
    }

    setDrawID(drawID,formId,chartererId) : void
    {
        this.drawId = drawID;
        this.formId = formId;
        localStorage.setItem('charter_id',chartererId)
        this.existingDrawCPButton = true;
    }

    setDrawIDExecuted(drawID,formId) : void
    {
        this.drawId = drawID;
        this.formId = formId;
        this.drawRecordsTableShowButton = true;
    }

    getTermsReviewData() : void
    {
        const reqData =
        {
            mainUserId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            drawId: this.drawId,
            formId : this.formId,
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

        var drawId = '48';
       // console.log(drawId + " Draw ID");

        var formId = '1';
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
            drawId: drawId,
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


    termsReviewRecords(): void
    {
        this.termsReviewRecordsData = [];
        var clauseCategoryFilterCondition = {};
            clauseCategoryFilterCondition["cpFormId"] = '1';
        try
        {
            this._userService.clauseCategoryServerSideRecords(clauseCategoryFilterCondition)
                .pipe(first())
                .subscribe((res) =>
                {
                    this.termsReviewRecordsResponse = res;
                    if (this.termsReviewRecordsResponse.success === true)
                    {
                        this.termsReviewRecordsData = this.termsReviewRecordsResponse.data;
                        for (let index = 0; index < this.termsReviewRecordsData.length; index++)
                        {
                            var clauseCategoryID = this.termsReviewRecordsData[index].id;

                            
                            var clauseTermsDetailsFilterCondition = {};
                                clauseTermsDetailsFilterCondition["parentId"] = clauseCategoryID;

                            this._userService.clauseTermsDetailsRecordsServerSide(clauseTermsDetailsFilterCondition).pipe(first()).subscribe((res) =>
                            {
                                this.clauseCategoryTermsResponse = res;
                                if (this.clauseCategoryTermsResponse.success === true)
                                {
                                    for (let subIndex = 0; subIndex < this.clauseCategoryTermsResponse.data.length; subIndex++)
                                    {
                                        var termsNameUpdate = '';
                                        var clauseTermsID = this.clauseCategoryTermsResponse.data[subIndex].id;
                                        var parentID = this.clauseCategoryTermsResponse.data[subIndex].id;
                                        var clauseTermsReviewFilter = {};
                                            clauseTermsReviewFilter["tu.companyId"] = '1';
                                            clauseTermsReviewFilter["tu.drawId"] = '48';
                                            clauseTermsReviewFilter["tu.formId"] = '1';
                                            clauseTermsReviewFilter["tu.clauseCategoryId"] = parentID;
                                            clauseTermsReviewFilter["tu.clauseTermsId"] = clauseTermsID;

                                        this._userService.clauseTermsReviewsRecordsServerSide(clauseTermsReviewFilter).pipe(first()).subscribe((res) =>
                                        {
                                            this.clauseCategoryTermsReviewResponse = res;
                                            if (this.clauseCategoryTermsReviewResponse.success === true)
                                            {
                                                var termsReviewDataID = '';
                                                for (let verySubIndex = 0; verySubIndex < this.clauseCategoryTermsReviewResponse.data.length; verySubIndex++)
                                                {
                                                    var currentData = this.clauseCategoryTermsReviewResponse.data[verySubIndex];
                                                    console.log(currentData);
                                                    console.log(currentData.id);
                                                    termsReviewDataID = currentData.id;
                                                }
                                                console.log(termsReviewDataID);
                                                this.clauseCategoryTermsResponse.data[subIndex].termsReviewDataID = termsReviewDataID;
                                                console.log(this.clauseCategoryTermsResponse.data[subIndex] + " Clause Category Terms");
                                                // console.log(this.clauseCategoryTermsReviewResponse.data + " Clause Category Terms Review");
                                            }
                                        });
                                        console.log(this.clauseCategoryTermsResponse.data + " Clause Category Terms Review");
                                    }
                                    // this.termsReviewRecordsData[index].clauseCategoryTerms = this.clauseCategoryTermsResponse.data;
                                    // console.log(this.termsReviewRecordsData + " Clause Category Terms Review");
                                }
                            });
                        }
                        // console.log(this.termsReviewRecordsData + " Clause Category Terms Review");
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

    drawCPFormView() : void
    {
        this.existingDrawCP = false;
        this.existingDrawCPButton = false;
        this.mainDrawCPDiv = true;
    }

    existingDrawCPView() : void
    {
        this.existingDrawCP = true;
        this.mainDrawCPDiv = false;
        this.mainDrawCPDiv = false;
        this.drawRecordsFilterShow = false;
        this.drawRecordsTableShow = false;
        this.drawRecordsTableShowButton = false;
        this.standardOffersFormDivShow = false;
        this.standardOffersFormTableShow = false;
        this.drawFormDivShow = false;
    }

    drawManagementRecords(): void
    {
        this.drawManagementData = [];
        
        var arrfilterInfo = {};

        arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
        
        try
        {
            this._userService.drawRecordsServerSide(arrfilterInfo)
                .pipe(first())
                .subscribe((res) =>
                {
                    this.drawManagementRes = res;
                    
                    if (this.drawManagementRes.success === true)
                    {
                        this.drawManagementData = this.drawManagementRes.data;
                        this.dataSource = new MatTableDataSource(this.drawManagementRes.data);
                        // setTimeout(() => this.dataSource.paginator = this.paginator, 15000);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        
                    }

                    console.log(this.drawManagementData);
                },
                err =>
                {
                    this.alertService.error(err, 'Error');
                });
            } catch (err)
            {
            }
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
    
        
        try
        {
            this._userService.drawRecordsServerSide(arrfilterInfo).pipe(first()).subscribe((res) =>
            {
                this.drawManagementRes = res;
                this.drawFormDivShow = false;
                this.drawRecordsTableShow = true;
                this.drawManagementData = this.drawManagementRes.data;
                this.dataSourceFilter = new MatTableDataSource(this.drawManagementRes.data);
                this.dataSourceFilter.paginator = this.paginator;
                this.dataSourceFilter.sort = this.sort;
                if (this.drawManagementRes.success === true)
                {
                   
                    localStorage.setItem('drawId',this.drawManagementRes.data[0].id);
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
        if(this.drawCPIDForDrawRecords > 0)
        {
            isCondition = 1;
            arrfilterInfo["dcm.id"] = this.drawCPIDForDrawRecords;
        }

        arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
        
        try
        {
            this._userService.drawRecordsServerSide(arrfilterInfo).pipe(first()).subscribe((res) =>
            {
                this.drawManagementRes = res;
                this.drawFormDivShow = false;
                this.drawRecordsTableShow = true;
                this.drawManagementData = this.drawManagementRes.data;
                this.dataSourceFilter = new MatTableDataSource(this.drawManagementRes.data);
                this.dataSourceFilter.paginator = this.paginator;
                this.dataSourceFilter.sort = this.sort;
                if (this.drawManagementRes.success === true)
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
                .post(`${config.baseUrl}/drawDataRemove`, req, {})
                .subscribe
                (
                    res =>
                    {
                        this.drawManagementRes = res;
                        if (this.drawManagementRes.success === true)
                        {
                            this.showModalStatus = false;
                            this.alertService.success('Successfully Deleted', 'Success');
                            this.drawManagementRecords();
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
    get fSearch() { return this.DrawManagementSearchForm.controls; }

    // Draw CP Form Records Fetch Start
    
        drawCPRecords(): void
        {
            var arrfilterInfo = {};

            arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
            
            try
            {
                this._userService.drawRecordsServerSide(arrfilterInfo)
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
                                if(valueData.id != 3)
                                {
                                    this.CharterPartyTypeArray.push(valueData);
                                }
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
            try
            {
                this.http.get(`${config.baseUrl}/userList`).subscribe(
                    res =>
                    {
                        this.ChartereInfoList = res;
                        if (this.ChartereInfoList.success)
                        {
                            this.ChartereInfoList.data.forEach(valueData  => 
                            {
                                if(valueData.userRoleId === 4)
                                {
                                    this.ChartereInfoData.push(valueData);
                                }
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

        changeChartererType(event): void
        {
            this.chartererId = event.value;
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
            this.chartererId = '';
            this.ownerId = '';

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
                drawCPIDSearch: ['', ''],
            });

            // this.DrawManagementSearchForm.reset(); 
            // this.DrawManagementForm.reset(); 

            this.drawRecordsFilterShow = false;
            this.drawRecordsTableShow = false;
            this.drawRecordsTableShowButton = false;
            this.drawFormDivShow = false;
            this.CPTypeId = Type;
            if(Type == 1)
            {
                this.drawRecordsFilterShow = true;
            }
            if(Type == 2)
            {
                this.drawFormDivShow = true;
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
            var yearInfo = this.f.cpDate.value._i.year;
            var monthInfo = this.f.cpDate.value._i.month;
            var dateInfo = this.f.cpDate.value._i.date;

            if(monthInfo < 10) { monthInfo = '0'+monthInfo; }
            if(dateInfo < 10) { dateInfo = '0'+dateInfo; }

            this.formIdValueForDrawRecords      =       this.f.formId.value;
            this.vesselIdValueForDrawRecords    =       this.f.vesselId.value,
            this.cpDateValueForDrawRecords      =       yearInfo+"-"+monthInfo+"-"+dateInfo,
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
                this.http.post(`${config.baseUrl}/DrawFormCreate`, req, headerOptions).subscribe(
                    res =>
                    {
                        this.createtypeRes = res;
                        if (this.createtypeRes.success === true)
                        {
                            this.alertService.success(this.createtypeRes.message, 'Success');
                            this.DrawManagementForm.reset();
                         this.drawIdServerSide();
                                
                            this.router.navigate(['/apps/drawCp-Clauses-management']);

                            this.drawRecordsServerSide();
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
    

    fetchDrawRecords(): void
    {
        this.alertService.clear();
        
        var isValid = 1;

        if(isValid == 0)
        {
            return;
        }  else {
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
                this.cpDateValueForDrawRecords      =       this.fSearch.cpDateSearch.value._i.year+"-"+this.fSearch.cpDateSearch.value._i.month+"-"+this.fSearch.cpDateSearch.value._i.date;
            }
            if(this.fSearch.drawCPIDSearch.value)
            {
                this.drawCPIDForDrawRecords      =       this.fSearch.drawCPIDSearch.value;
            }
            this.drawRecordsServerSide();
        }
    }
}