
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
  name: string; 
}

@Component({
  selector: 'app-cp-form',
  templateUrl: './cp-form.component.html',
  styleUrls: ['./cp-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CpFormComponent implements OnInit {

  displayedColumns: string[] = ['id','cpformName','action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  // displayedColumns = ['name'];
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    // dataSource: MatTableDataSource<UserData>;
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    id: string;
    cpformName: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isActive: string;
  isDelete: string;
  cpForm :any;
  cpFormRes: any;
  cpFormData: any;
  cols: any[];


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */

  constructor( private _userService: UserService,
    private _fuseSidebarService: FuseSidebarService,
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router) {
      this.dataSource = new MatTableDataSource(this.cpFormData);
     }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.CPFORM();

    
  }

  
  CPFORM(): void {
    try {
        this._userService.getFormList()
            .pipe(first())
            .subscribe((res) => {
                this.cpFormRes = res;
                console.log(res);
                if (this.cpFormRes.success === true) {
                    this.cpFormData = this.cpFormRes.data;
                    this.dataSource = new MatTableDataSource(this.cpFormData);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    console.log(this.cpFormData);
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
  localStorage.setItem('cpformdata', JSON.stringify(data));
  this.router.navigate(['/apps/cp-form-management/edit']);
}

showDeleteModal(id): void {
  this.id =id;
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
          .post(`${config.baseUrl}/cpFromdelete`, req, {})
          .subscribe(
              res => {
                  console.log(res);
                  this.cpFormRes = res;
                  if (this.cpFormRes.success === true) {
                      this.showModalStatus = false;
                      this.alertService.success('Successfully Deleted', 'Success');
                      this.CPFORM();
                  } else {
                      this.alertService.error(this.cpFormRes.message, 'Error');
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
