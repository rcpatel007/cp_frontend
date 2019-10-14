
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
import { HttpClient } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../_services';

export interface PeriodicElement
{
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
    displayedColumns: string[] = ['id','CPTypeId','formId','vesselId','chartererId','chartererBrokerId'
    ,'ownerBrokerId','cpDate','cpTime','cpCity','cpSubject','cpLiftDate','cpLiftTime','cpLiftCity','action'];
    
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
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive: string;
    isDelete: string;
    DrawDatalist :any;
    DrawDataListRes: any;
    DrawDataListData: any;
    cols: any[];

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    /**
     * Constructor
     *
     *      @param {ContactsService} _contactsService
     *      @param {FuseSidebarService} _fuseSidebarService
     *      @param {MatDialog} _matDialog
     */

    constructor( 
            
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService,
        private router: Router)
        {
            this.dataSource = new MatTableDataSource(this.DrawDataListData);
        }

    ngOnInit()
    {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.DrawData();
    }

    DrawData(): void
    {
        try
        {
            this._userService.getcharterpartytypeList()
                .pipe(first())
                .subscribe((res) =>
                {
                    this.DrawDataListRes = res;
                    console.log(res);
                    if (this.DrawDataListRes.success === true)
                    {
                        this.DrawDataListData = this.DrawDataListRes.data;
                        this.dataSource = new MatTableDataSource(this.DrawDataListData);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        console.log(this.DrawDataListData);
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

    editUser(data): void
    {
        console.log(data);       
        localStorage.setItem('cptypeData', JSON.stringify(data));
        this.router.navigate(['/apps/charter-type-management/edit']);
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

    deleteCharterPartyType(): void
    {
        const req =
        {
            id: this.id,
        };
        
        try
        {
            this.http
                .post(`${config.baseUrl}/charterpartytypedelete`, req, {})
                .subscribe(
                    res =>
                    {
                        console.log(res);
                        this.DrawDataListRes = res;
                        if (this.DrawDataListRes.success === true)
                        {
                            this.showModalStatus = false;
                            this.alertService.success('Successfully Deleted', 'Success');
                            this.DrawData();
                        } else {
                            this.alertService.error(this.DrawDataListRes.message, 'Error');
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
}