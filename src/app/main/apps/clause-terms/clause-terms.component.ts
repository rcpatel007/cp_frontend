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
    id:String;
    clauseCategoryName: String;
    nos: String;
    name: string;
}

@Component(
{
    selector: 'app-clause-terms',
    templateUrl: './clause-terms.component.html',
    styleUrls: ['./clause-terms.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ClauseTermsComponent implements OnInit
{

    displayedColumns: string[] = ['id','clauseCategoryName', 'nos', 'termsName', 'action'];
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
    parentId: string;
    nos: string;
    termsName: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive: string;
    isDelete: string;
    clauseTerms: any;
    clauseTermsRes: any;
    clauseTermsData= [];
    cols: any[];
    cpFormListRes: any;
    cpFormListData: any;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */

    constructor
    (
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService,
        private router: Router
    )
    {
        this.dataSource = new MatTableDataSource(this.clauseTermsData);
    }

    ngOnInit()
    {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.clauseTermsRecords();
    }

    fromList(): void
    {
        try
        {
            this._userService.getclusesCategoryList()
                .pipe(first())
                .subscribe((res) =>
                {
                    this.cpFormListRes = res;
                    console.log(res);
                    if (this.cpFormListRes.success === true)
                    {
                        this.cpFormListData = this.cpFormListRes.data;
                        console.log(this.cpFormListData);
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

    clauseTermsRecords(): void
    {
        this.clauseTermsData = [];
        this.fromList();
        
        try
        {
            this._userService.getclusesList()
                .pipe(first())
                .subscribe((res) =>
                {
                    this.clauseTermsRes = res;
                    console.log(res);
                    console.log('Here In DATA');
                    if (this.clauseTermsRes.success === true)
                    {
                        for (let index = 0; index < this.clauseTermsRes.data.length; index++)
                        {
                            for (let secondindex = 0; secondindex < this.cpFormListData.length; secondindex++)
                            {
                                if (this.clauseTermsRes.data[index].parentId === this.cpFormListData[secondindex].id)
                                {
                                    let tempData =
                                    {
                                        clauseTermsId:this.clauseTermsRes.data[index].id,
                                        id:this.clauseTermsRes.data[index].id,
                                        nos:this.clauseTermsRes.data[index].nos,
                                        clauseCategoryName: this.cpFormListData[secondindex].name,
                                        termsName: this.clauseTermsRes.data[index].termsName,
                                        parentId: this.clauseTermsRes.data[index].parentId
                                    }
                                    console.log(tempData);
                                    this.clauseTermsData.push(tempData);
                                }
                            }
                        }
                        // this.clauseTermsData = this.clauseTermsRes.data;
                        this.dataSource = new MatTableDataSource(this.clauseTermsData);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        console.log("Final Records");
                        console.log(this.clauseTermsData);
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

    editClauseTermsData(data): void
    {
        console.log('Data For Edit');
        console.log(data);
        localStorage.setItem('clauseTermsData', JSON.stringify(data));
        this.router.navigate(['/apps/clause-terms-management/edit']);
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

    deleteClauseTermsData(): void
    {
        const req =
        {
            id: this.id,
        };
        try
        {
            this.http
                .post(`${config.baseUrl}/clusesdelete`, req, {})
                .subscribe
                (
                    res =>
                    {
                        console.log(res);
                        this.clauseTermsRes = res;
                        if (this.clauseTermsRes.success === true)
                        {
                            this.showModalStatus = false;
                            this.alertService.success('Successfully Deleted', 'Success');
                            this.clauseTermsRecords();
                        } else {
                            this.alertService.error(this.clauseTermsRes.message, 'Error');
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