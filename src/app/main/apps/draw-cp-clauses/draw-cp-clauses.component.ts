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

@Component({
  selector: 'app-draw-cp-clauses',
  templateUrl: './draw-cp-clauses.component.html',
  styleUrls: ['./draw-cp-clauses.component.scss']
})
export class DrawCpClausesComponent implements OnInit {
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
  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.drawManagementRecords();

  }
  drawManagementRecords(): void
  {
      this.drawcluases = [];
      let cpFormid = localStorage.getItem('cpFormId');
    
      try
      {
          this._userService.clausesCategoryRecords()
              .pipe(first())
              .subscribe((res) =>
              {
                  this.drawManagementRes = res;
                  console.log('Main Draw Management Records');
                  console.log(cpFormid);
                  if (this.drawManagementRes.success === true)
                  {
                    // console.log(this.drawManagementRes.data);
                    for (let index = 0; index < this.drawManagementRes.data.length; index++) {


                      if (this.drawManagementRes.data[index].cpFormId == cpFormid) {

                        this.drawcluases.push(this.drawManagementRes.data[index]);
                                             
                      }

                    }
                    this.dataSource = new MatTableDataSource(this.drawcluases);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    console.log("Final Records");
                    console.log(this.drawcluases);
                    console.log(this.drawcluases);                        

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

  clusesAdd(id,name){
    let cid =id;
    let clausesID= {
      cid:id,
      name:name
    }
    this.clusesId.push(clausesID);
  
    console.log(this.clusesId);
    
  }


nextcomponent(){
 let cluses = this.clusesId;
  localStorage.setItem('clausesId',JSON.stringify(cluses));
  // routerLink="/apps/Draw-management/draw-cp-Clause"
     this.router.navigate(['/apps/drawCp-Clauses-management/clauses-Detail']);

}

}
