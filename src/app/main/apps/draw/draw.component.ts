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
    // displayedColumns: string[] = ['id','charterPartyTypeName', 'CharterPartyFormName', 'vesselName', 'ownerName',
    //  'chartererName', 'charterBrokerName', 'ownerBrokerName',
    //  'cpDate', 'cpTime', 'cpCity', 'cpSubject', 'cpLiftDate', 'cpLiftTime', 'cpLiftCity', 'action'];

    displayedColumns: string[] = ['id','cpDate', 'chartererName', 'ownerName', 'vesselName', 'progress','statusInfo', 'action'];


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

    alertMessage : string;

    CPTypeIdSearch: string;
    formIdSearch: string;
    vesselIdSearch: string;
    ownerIdSearch: string;
    chartererIdSearch: string;
    cpDateSearch: string;

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

    cpFormList: any;
    cpFormData: any;

    VesselList: any;
    VesselData: any;

    CharterPartyTypeList: any;
    CharterPartyTypeData: any;

    ChartereInfoList: any;
    ChartereInfoData=[];

    formIdValueForDrawRecords;
    vesselIdValueForDrawRecords;
    cpDateValueForDrawRecords;
    chartererIdValueForDrawRecords;

    show = false;
    drawRecordsFilterShow = false;
    drawRecordsTableShow = false;

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
    }

    ngOnInit()
    {
        this.DrawManagementForm = this._formBuilder.group(
        {
        
            // CPTypeId: ['0', Validators.required],
            formId: ['0', Validators.required],
            vesselId: ['0', Validators.required],
            cpDate: ['', Validators.required],
            chartererId: ['0', Validators.required],
        
        });

        this.DrawManagementSearchForm = this._formBuilder.group(
        {
        
            // CPTypeId: ['0', Validators.required],
            formIdSearch: ['0', ''],
            vesselIdSearch: ['0', ''],
            cpDateSearch: ['', ''],
            chartererIdSearch: ['0', ''],
        
        });

        this.CPTypeId = '1';

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.drawManagementRecords();
        this.cpFormRecords();
        this.vesselRecords();
        this.CPRecords();
        this.ChartereRecords();
    }

    drawManagementRecords(): void
    {
        this.drawManagementData = [];
        try
        {
            this._userService.drawFormRecords()
                .pipe(first())
                .subscribe((res) =>
                {
                    this.drawManagementRes = res;
                    console.log('Main Draw Management Records');
                    console.log(res);
                    if (this.drawManagementRes.success === true)
                    {
                        this.drawManagementData = this.drawManagementRes.data;
                        this.dataSource = new MatTableDataSource(this.drawManagementRes.data);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        console.log("Final Records");
                        console.log(this.drawManagementData);
                    }
                },
                err =>
                {
                    this.alertService.error(err, 'Error');
                    console.log(err);
                });
            } catch (err)
            {
                console.log(err);
        }
    }

    drawRecordsServerSide() : void
    {
        this.drawManagementData = [];
        const filterData =
        {
            formId:this.formIdValueForDrawRecords,
            vesselId: this.vesselIdValueForDrawRecords,
            cpDate: this.cpDateValueForDrawRecords,
            chartererId: this.chartererIdValueForDrawRecords
        };
        try
        {
            this._userService.drawRecordsServerSide(filterData).pipe(first()).subscribe((res) =>
            {
                this.drawManagementRes = res;
                if (this.drawManagementRes.success === true)
                {
                    this.drawFormDivShow = false;
                    this.drawRecordsTableShow = true;
                    this.drawManagementData = this.drawManagementRes.data;
                    this.dataSource = new MatTableDataSource(this.drawManagementRes.data);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }
                this.show = true;
            },
            err =>
            {
                this.alertService.error(err, 'Error');
            });
        } catch (err)
        {
            console.log(err);
        }
    }

    editdrawManagementData(data): void
    {
        console.log('Data For Edit');
        console.log(data);
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
                        console.log(res);
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
                        console.log(err);
                        this.alertService.error(err.message, 'Error');
                    }
                );
        } catch (err)
        {
            console.log(err);
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

    // CP Form Records Fetch Start
    
        cpFormRecords(): void
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
                        console.log(err);
                    }
                );
            } catch (err)
            {
                console.log(err);
            }
        }

        changeCPForm(event): void
        {
            this.formId = event.target.value;
        }

        changeCPFormSearch(event): void
        {
            this.formId = event.target.value;
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
                        console.log(err);
                    }
                );
            } catch (err)
            {
                console.log(err);
            }
        }

        changeVesselEvent(event): void
        {
            this.vesselId = event.target.value;
            for (let index = 0; index < this.VesselData.length; index++)
            {   
                console.log(this.VesselData[index]);
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
                    },
                    err =>
                    {
                        console.log(err);
                    }
                );
            } catch (err)
            {
                console.log(err);
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
                            console.log(this.ChartereInfoList.data);
                            this.ChartereInfoList.data.forEach(valueData  => 
                            {
                                console.log(valueData.userRoleId);
                                if(valueData.userRoleId === 4)
                                {
                                    this.ChartereInfoData.push(valueData);
                                }
                            });
                            console.log('Charterer Records');
                            console.log(this.ChartereInfoData);
                            
                        }
                    },
                    err =>
                    {
                        console.log(err);
                    }
                );
            } catch (err)
            {
                console.log(err);
            }
        }

        changeChartererType(event): void
        {
            console.log('Chartere ID Info');
            console.log(event.target.value);
            this.chartererId = event.target.value;
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
            
                formId: ['0', Validators.required],
                vesselId: ['0', Validators.required],
                cpDate: ['', Validators.required],
                chartererId: ['0', Validators.required],
            });
    
            this.DrawManagementSearchForm = this._formBuilder.group(
            {
                formIdSearch: ['0', ''],
                vesselIdSearch: ['0', ''],
                cpDateSearch: ['', ''],
                chartererIdSearch: ['0', ''],
            });

            // this.DrawManagementSearchForm.reset(); 
            // this.DrawManagementForm.reset(); 

            this.drawRecordsFilterShow = false;
            this.drawRecordsTableShow = false;
            this.drawFormDivShow = false;
            console.log(Type);
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
        // reset alerts on submit
        this.alertService.clear();
 
        // stop here if form is invalid
        if (this.DrawManagementForm.invalid)
        { 
            return;
        } else {
            
            console.log(this.f.cpDate);
            console.log(this.f.cpDate.value);
            console.log(this.f.cpDate.value._i);
            console.log(this.f.cpDate.value._i.year);
            console.log(this.f.cpDate.value._i.month);
            console.log(this.f.cpDate.value._i.date);

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

            this.drawRecordsServerSide();

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
                            // this.router.navigate([this.returnUrl]);
                            this.drawRecordsServerSide();
        this.router.navigate(['/apps/drawCp-Clauses-management']);

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
        this.alertMessage = '';

        var isValid = 1;

        if(this.fSearch.formIdSearch.value == 0)
        {
            isValid = 0;
            this.alertMessage = this.alertMessage+'Please Select CP Form';
        }

        if(this.fSearch.vesselIdSearch.value == 0)
        {
            isValid = 0;
            this.alertMessage = this.alertMessage+'Please Select Vessel';
        }

        if(this.fSearch.cpDateSearch.value == '')
        {
            isValid = 0;
            this.alertMessage = this.alertMessage+'Please Select CP Date';
        }

        if(this.fSearch.chartererIdSearch.value == 0)
        {
            isValid = 0;
            this.alertMessage = this.alertMessage+'Please Select Charterer';
        }

        if(isValid == 0)
        {
            this.alertService.error(this.alertMessage, 'Required');
            return;
        }  else {

            this.formIdValueForDrawRecords      =       this.fSearch.formIdSearch.value;
            this.vesselIdValueForDrawRecords    =       this.fSearch.vesselIdSearch.value,
            this.cpDateValueForDrawRecords      =       this.fSearch.cpDateSearch.value._i.year+"-"+this.fSearch.cpDateSearch.value._i.month+"-"+this.fSearch.cpDateSearch.value._i.date,
            this.chartererIdValueForDrawRecords =       this.fSearch.chartererIdSearch.value;

            this.drawRecordsServerSide();
        }
    }
}