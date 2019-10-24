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
  showModalStatus=false;
  clauses =[];
  clauseCategory:any;
  dataSource:any;
  drawcluases= [];
  drawManagementRes:any;
clusesId=[];
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
      this.dataSource = new MatTableDataSource(this.drawcluases);
     }

  ngOnInit() {
    this.clausesDetail();
  }
  addModal(){
    this.showModalStatus = true;
   
  }

  clausesDetail(){

    this.clauseCategory = localStorage.getItem('clausesId');

    console.log(this.clauseCategory);
    
  }

}
