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

import { UserService } from '../../../../_services/user.service';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../../_services';




@Component({
  selector: 'app-clauses-detail',
  templateUrl: './clauses-detail.component.html',
  styleUrls: ['./clauses-detail.component.scss']
})
export class ClausesDetailComponent implements OnInit {
  showModalStatus = false;
  clauses = [];
  clauseCategory: any;
  dataSource: any;
  drawcluases = [];
  clusename: String;
  firstClase: any;
  tempData: any;
  drawManagementRes: any;
  clusesId = [];
  previusClause: any;
  nextClause: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /**
   * Constructor
   *
   * @param {ContactsService} _contactsService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {MatDialog} _matDialog
   */
  constructor(private _userService: UserService,
    private _fuseSidebarService: FuseSidebarService,
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router) {
    this.dataSource = new MatTableDataSource(this.drawcluases);
  }

  ngOnInit() {
    this.clausesDetail();
  }
  addModal() {
    this.showModalStatus = true;

  }

  clausesDetail() {

    this.clauseCategory = JSON.parse(localStorage.getItem('clausesId'));
    this.firstClase = this.clauseCategory[0];
    let clusename: String;
    console.log(this.clauseCategory);
    this._userService.clausesCategoryRecords().
      subscribe(res => {
        this.drawManagementRes = res;
        for (let index = 0; index < this.drawManagementRes.data.length; index++) {
          if (this.drawManagementRes.data[index].id == this.firstClase.cid) {
            this.clusename = this.drawManagementRes.data[index].name;

            this.previusClause = this.clauseCategory[0].cid;
            this.nextClause = this.clauseCategory[1].cid;
          }


        }

        console.log('data', this.clusename);
        console.log('previus', this.previusClause);
        console.log('next', this.nextClause);

      });
    this._userService.getclausesList()
      .subscribe(res => {
        console.log(res);
        this.tempData = res;

        for (let index = 0; index < this.tempData.data.length; index++) {

          if (this.tempData.data[index].parentId == this.firstClase.cid) {
            this.clauses.push(this.tempData.data[index]);

          }

        }
        console.log(this.tempData.data);
        console.log(this.clauses);

      });
  }

  Previous(previusClause) {
    this.clauses = [];
    let pc = this.previusClause;
    this.clusename = '';
    // this.clauseCategory = JSON.parse(localStorage.getItem('clausesId'));
    // this.firstClase = this.clauseCategory[0];
    // let clusename: String;
    // console.log(this.clauseCategory);
    this._userService.clausesCategoryRecords().
      subscribe(res => {
        this.drawManagementRes = res;
        for (let index = 0; index < this.drawManagementRes.data.length; index++) {
          if (this.drawManagementRes.data[index].id == this.previusClause) {
            this.clusename = this.drawManagementRes.data[index].name;
            this.previusClause = this.clauseCategory[1].cid;
            this.nextClause = this.clauseCategory[2].cid;

          }

        }

        console.log('data', this.clusename);
        console.log('previus', this.previusClause);
        console.log('next', this.nextClause);

      });
    this._userService.getclausesList()
      .subscribe(res => {
        console.log(res);
        this.tempData = res;

        for (let index = 0; index < this.tempData.data.length; index++) {

          if (this.tempData.data[index].parentId == this.previusClause) {
            this.clauses.push(this.tempData.data[index]);

          }

        }
        console.log(this.tempData.data);
        console.log(this.clauses);

      });
  }

  next(nextClause) {
    this.clauses = [];
    this.clusename = '';
    let nc = this.nextClause;
    // this.clauseCategory = JSON.parse(localStorage.getItem('clausesId'));
    // this.firstClase = this.clauseCategory[0];
    // let clusename: String;
    // console.log(this.clauseCategory);
    this._userService.clausesCategoryRecords().
      subscribe(res => {
        this.drawManagementRes = res;
        for (let index = 0; index < this.drawManagementRes.data.length; index++) {
          if (this.drawManagementRes.data[index].id == this.nextClause) {
            this.clusename = this.drawManagementRes.data[index].name;
            this.previusClause = this.clauseCategory[index - 1].cid;
            this.nextClause = this.clauseCategory[index + 1].cid;
          }


        }
        console.log('data', this.drawManagementRes.data);
        console.log('data', this.clusename);
        console.log('previus', this.previusClause);
        console.log('next', this.nextClause);

      });
    this._userService.getclausesList()
      .subscribe(res => {
        console.log(res);
        this.tempData = res;

        for (let index = 0; index < this.tempData.data.length; index++) {

          if (this.tempData.data[index].parentId == this.nextClause) {
            this.clauses.push(this.tempData.data[index]);

          }

        }
        console.log(this.tempData.data);
        console.log(this.clauses);

      });
  }

      /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

}
