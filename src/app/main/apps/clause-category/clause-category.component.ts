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

export interface PeriodicElement {
  cpFormName: String;
  name: string;

}

@Component({
  selector: 'app-clause-category',
  templateUrl: './clause-category.component.html',
  styleUrls: ['./clause-category.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ClauseCategoryComponent implements OnInit {
  displayedColumns: string[] = ['id', 'cpFormName', 'name', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  dialogRef: any;
  hasSelectedContacts: boolean;
  searchInput: FormControl;
  showModalStatus = false;
  showUpdateModalStatus = false;
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isActive: string;
  isDelete: string;
  clauseCategory: any;
  clauseCategoryRes: any;
  clauseCategoryData= [];
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

  constructor(
    private _userService: UserService,
    private _fuseSidebarService: FuseSidebarService,
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router) {
    this.dataSource = new MatTableDataSource(this.clauseCategoryData);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.clauseCategoryType();
    // this.fromList();
  }

  fromList(): void {
    try {
      this._userService.getFormList()
        .pipe(first())
        .subscribe((res) => {
          this.cpFormListRes = res;
          console.log(res);
          if (this.cpFormListRes.success === true) {
            this.cpFormListData = this.cpFormListRes.data;
            console.log(this.cpFormListData);
          }
        },
          err => {
            this.alertService.error(err, 'Error');
            console.log(err);
          });

    } catch (err) {
      console.log(err);
    }
  }

  clauseCategoryType(): void {
    this.clauseCategoryData = [];
    this.fromList();
    try {
      this._userService.getclusesCategoryList()
        .pipe(first())
        .subscribe((res) => {
          this.clauseCategoryRes = res;
          console.log(res);
          if (this.clauseCategoryRes.success === true) {
            // this._userService.getFormList()
            //   .pipe(first())
            //   .subscribe((response) => {
            //     this.cpFormListRes == response;
            //     console.log(res);
            //     if (this.cpFormListRes.success === true) {
            //       this.cpFormListData = this.cpFormListRes.data;
            //       console.log(this.cpFormListData);
            //     }
            //   },
            //     err => {
            //       this.alertService.error(err, 'Error');
            //       console.log(err);
            //     });


            for (let index = 0; index < this.clauseCategoryRes.data.length; index++) {

              for (let secondindex = 0; secondindex < this.cpFormListData.length; secondindex++) {
                if (this.clauseCategoryRes.data[index].cpFormId === this.cpFormListData[secondindex].id) {
                  let tempData = {
                    id:this.clauseCategoryRes.data[index].id,
                    cpFormName: this.cpFormListData[secondindex].cpformName,
                    name: this.clauseCategoryRes.data[index].name
                  }
                  this.clauseCategoryData.push(tempData);
                }
              

              }
            }


            // this.clauseCategoryData = this.clauseCategoryRes.data;
            this.dataSource = new MatTableDataSource(this.clauseCategoryData);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log(this.clauseCategoryData);
          }
        },
          err => {
            this.alertService.error(err, 'Error');
            console.log(err);
          });

    } catch (err) {
      console.log(err);
    }
  }

  editUser(data): void {
    console.log(data);
    localStorage.setItem('clauseCategoryData', JSON.stringify(data));
    this.router.navigate(['/apps/clause-category-management/edit']);
  }

  showDeleteModal(id): void {
    this.id = id;
    this.showModalStatus = !this.showModalStatus;
  }
  hideDeleteModal(): void {
    this.showModalStatus = !this.showModalStatus;
  }

  deleteCharterPartyType(): void {
    const req = {
      id: this.id,

    };
    try {
      this.http
        .post(`${config.baseUrl}/clusesCategorydelete`, req, {})
        .subscribe(
          res => {
            console.log(res);
            this.clauseCategoryRes = res;
            if (this.clauseCategoryRes.success === true) {
              this.showModalStatus = false;
              this.alertService.success('Successfully Deleted', 'Success');
              this.clauseCategoryType();
            } else {
              this.alertService.error(this.clauseCategoryRes.message, 'Error');
            }
          },
          err => {
            console.log(err);
            this.alertService.error(err.message, 'Error');
          }
        );
    } catch (err) {
      console.log(err);
    }
  }

}