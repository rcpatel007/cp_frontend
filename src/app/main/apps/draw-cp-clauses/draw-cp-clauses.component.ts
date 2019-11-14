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
import { $ } from 'protractor';
export interface PeriodicElement {

  name: String,
  Date: Date,
  ClauseTracker: String;
}

@Component(
  {
    selector: 'app-draw-cp-clauses',
    templateUrl: './draw-cp-clauses.component.html',
    styleUrls: ['./draw-cp-clauses.component.scss'],

  })


export class DrawCpClausesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'Date', 'clauseTracker'];

  dataSource = new MatTableDataSource<PeriodicElement>();
  dataSourcecustom = new MatTableDataSource<PeriodicElement>();

  dataSourceFilter = new MatTableDataSource<PeriodicElement>();
  dataSourcecustomFilter = new MatTableDataSource<PeriodicElement>();
  dialogRef: any;
  hasSelectedContacts: boolean;
  searchInput: FormControl;
  showModalStatus = false;
  showUpdateModalStatus = false;
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSourcecustom.filter = filterValue.trim().toLowerCase();
  }

  applyFilterExecuted(filterValue: string) {
    this.dataSourceFilter.filter = filterValue.trim().toLowerCase();
    this.dataSourcecustomFilter.filter = filterValue.trim().toLowerCase();
  }

  // dataSource:any;
  drawcluases = [];
  drawManagementRes: any;
  clusesId = [];
  viewtable: false;

  termsReviewRecordsResponse: any;
  termsReviewRecordsData = [];

  clauseCategoryTermsResponse: any;
  clauseCategoryTermsData = [];

  clauseCategoryTermsReviewResponse: any;
  clauseCategoryTermsReviewData = [];

  clauseCategoryTermsReviewResponseCustom: any;
  clauseCategoryTermsReviewDataCustom = [];
  flag = 1;
  nextStatus = true;
  termsUpdateRes: any;
  customClause: String;
  parentId: String;
  tempedit: any;
  editclausetext: String;
  editclauses = [];
  editid: String;
  tmpeditclausetext: String;
  newClause = [];
  clauses = [];
  ceditid: String;
  tmpceditclausetext: String;
  viewData = [];
  viewCustomData = [];
  pageTitle: String;
  notifiactionres: any;
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
    ) {
    this.dataSource = new MatTableDataSource(this.termsReviewRecordsData);
    this.dataSourcecustom = new MatTableDataSource(this.termsReviewRecordsData);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.termsReviewRecords();
    this.dataSourcecustom.paginator = this.paginator;
    this.dataSourcecustom.sort = this.sort;

    if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
      this.pageTitle = 'Draw C/P Clauses';
    }

    if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
      this.pageTitle = 'Charterer First Counter';
    }

    if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
      this.pageTitle = 'Owner First Counter';
    }

  }

  next(id): void {
    // console.log(id);
    if (this.termsReviewRecordsData[this.termsReviewRecordsData.length - 1].id == id) {
      this.flag = this.flag + 1;
      console.log(this.flag);
      this.termsReviewRecords();
      this.nextStatus = false;
      // console.log(this.termsReviewRecordsData[this.termsReviewRecordsData.length -1]);

      console.log(this.nextStatus);
    }

    else {
      this.flag = this.flag + 1;
      console.log(this.flag);
      this.termsReviewRecords();
      this.nextStatus = true;
      console.log(this.nextStatus);
      console.log(this.termsReviewRecordsData[this.termsReviewRecordsData.length - 1]);

    }

  }

  Previous(id): void {
    // console.log(id);
    if (this.termsReviewRecordsData[this.termsReviewRecordsData.length - 1] == this.flag) {
      this.flag = this.flag - 1;
      console.log(this.flag);
      this.termsReviewRecords();
      this.nextStatus = false;
      console.log(this.nextStatus);
    }

    else {
      this.flag = this.flag - 1;
      console.log(this.flag);
      this.termsReviewRecords();
      this.nextStatus = true;
      console.log(this.nextStatus);

    }


    // this.flag = this.flag-1;
    // console.log(this.flag);

    // this.termsReviewRecords();
  }




  // trems display 


  termsReviewRecords(): void {
    var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
    var drawId = filter.drawId;
    var formID = filter.formId;
    var companyId = filter.companyId;

    this.termsReviewRecordsData = [];
    var clauseCategoryFilterCondition = {};
    clauseCategoryFilterCondition["cpFormId"] = formID;
    try {
      this._userService.clauseCategoryServerSideRecords(clauseCategoryFilterCondition)
        .pipe(first())
        .subscribe((res) => {
          this.termsReviewRecordsResponse = res;
          if (this.termsReviewRecordsResponse.success === true) {
            this.termsReviewRecordsData = this.termsReviewRecordsResponse.data;

            for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
              this.clauseCategoryTermsData = [];
              var clauseCategoryID = this.termsReviewRecordsData[index].id;

              var clauseTermsDetailsFilterCondition = {};
              clauseTermsDetailsFilterCondition["parentId"] = clauseCategoryID;
              
              this._userService.clauseTermsDetailsRecordsServerSide(clauseTermsDetailsFilterCondition).pipe(first()).subscribe((res) => {
                this.clauseCategoryTermsResponse = res;
                if (this.clauseCategoryTermsResponse.success === true) {
                  this.clauseCategoryTermsData = this.clauseCategoryTermsResponse.data;

                  for (let subIndex = 0; subIndex < this.clauseCategoryTermsData.length; subIndex++) {
                    var clauseTermsID = this.clauseCategoryTermsData[subIndex].id;
                    var parentID = this.clauseCategoryTermsData[subIndex].parentId;

                    this.clauseCategoryTermsReviewData = [];
                    this.clauseCategoryTermsData[subIndex].clauseCategoryTermsUpdate = this.clauseCategoryTermsReviewData;

                    var clauseTermsReviewFilter = {};
                    clauseTermsReviewFilter["tu.companyId"] = companyId;
                    clauseTermsReviewFilter["tu.drawId"] = drawId;
                    clauseTermsReviewFilter["tu.formId"] = formID;
                    clauseTermsReviewFilter["tu.clauseCategoryId"] = parentID;
                    clauseTermsReviewFilter["tu.clauseTermsId"] = clauseTermsID;

                    this._userService.clauseTermsReviewsRecordsServerSide(clauseTermsReviewFilter).pipe(first()).subscribe((res) => {
                      this.clauseCategoryTermsReviewResponse = res;
                      if (this.clauseCategoryTermsReviewResponse.success === true) {
                        this.clauseCategoryTermsReviewData = this.clauseCategoryTermsReviewResponse.data;
                        this.clauseCategoryTermsData[subIndex].clauseCategoryTermsUpdate = this.clauseCategoryTermsReviewData;
                      }
                    });
                  }
                  this.termsReviewRecordsData[index].clauseCategoryTerms = this.clauseCategoryTermsData;
                }
              });

              this.clauseCategoryTermsReviewDataCustom = [];
              this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom = this.clauseCategoryTermsReviewDataCustom;

              var clauseTermsReviewFilter = {};
              clauseTermsReviewFilter["tu.companyId"] = companyId;
              clauseTermsReviewFilter["tu.drawId"] = drawId;
              clauseTermsReviewFilter["tu.formId"] = formID;
              clauseTermsReviewFilter["tu.clauseCategoryId"] = clauseCategoryID;
              clauseTermsReviewFilter["tu.isCustom"] = 'Y';

              this._userService.clauseTermsReviewsRecordsServerSideCustom(clauseTermsReviewFilter).pipe(first()).subscribe((res) => {
                this.clauseCategoryTermsReviewResponseCustom = res;
                if (this.clauseCategoryTermsReviewResponseCustom.success === true) {
                  if (this.termsReviewRecordsData[index]) {
                    console.log(this.clauseCategoryTermsReviewResponseCustom.data);
                    
                    this.clauseCategoryTermsReviewDataCustom = this.clauseCategoryTermsReviewResponseCustom.data;
                    this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom = this.clauseCategoryTermsReviewResponseCustom.data;
                  }
                }
              });
            }
            console.log(this.termsReviewRecordsData);
          }
        },
          err => {
            this.alertService.error(err, 'Error');
          });
    } catch (err) {
    }
  }
  // custome terms add toggle
  toggleOpen(key, id): void {
    this._fuseSidebarService.getSidebar(key).toggleOpen();
    this.parentId = id;
  }

  // custom terms add
  addClause() {
    this.termsReviewRecordsData =[];
    var mainUserId = localStorage.getItem('userId');
    // console.log(mainUserId +" Main User ID");

    var companyId = localStorage.getItem('companyId');
    // console.log(companyId + " Company ID");

    var drawId = localStorage.getItem('drawId');
    // console.log(drawId + " Draw ID");

    var formId = localStorage.getItem('cpFormId');
    // console.log(formId + " CP Form ID");

    var clauseCategoryId = this.parentId;
    // console.log(clauseCategoryId + " Clause Category ID");

    // var clauseTermsId = '1';
    // console.log(clauseTermsId + " Clause Terms ID");

    var nos = '1';
    // console.log(nos + " Nos");

    var termsNameOrginal = this.customClause;
    // console.log(termsNameOrginal + " Terms Orginal Name");

    var termsName = this.customClause;
    // console.log(termsName + " Terms Name");

    const req =
    {
      mainUserId: mainUserId,
      companyId: companyId,
      drawId: '48',
      formId: '1',
      clauseCategoryId: clauseCategoryId,
      nos: nos,
      termsNameOrginal: termsNameOrginal,
      termsName: termsName,
      createdBy: localStorage.getItem('userId'),
      updatedBy: localStorage.getItem('userId'),
      isCustom: 'Y'
    };
    console.log("check request", req);

    try {
      const header = new HttpHeaders();
      header.append('Content-Type', 'application/json');
      const headerOptions =
      {
        headers: header
      }
      this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(
        res => {
          this.termsUpdateRes = res;
          console.log("HERE OUT RESPONSE");
          console.log(this.termsUpdateRes);
          if (this.termsUpdateRes.success === true) {
            // console.log("HERE IN RESPONSE");
            console.log(this.termsUpdateRes);
            this._fuseSidebarService.getSidebar('addPanel').toggleOpen();
            this.termsReviewRecords();
          }
        }
      );
    } catch (err) {
    }
  }

  // edit toggle open      
  editToggle(key, id, clauseid): void {
    let cid = id;
    this.parentId = clauseid;
    this.editclauses = [];
    this._fuseSidebarService.getSidebar(key).toggleOpen();

    this._userService.getclusesList()
      .subscribe(res => {
        this.tempedit = res;
        for (let index = 0; index < this.tempedit.data.length; index++) {

          if (this.tempedit.data[index].id == id) {
            this.editclauses.push(this.tempedit.data[index]);
            this.editid = this.tempedit.data[index].id;

            this.editclausetext = this.tempedit.data[index].termsName;
            this.tmpeditclausetext = this.tempedit.data[index].termsName;
          }
        }
        console.log(this.editclausetext);
        console.log(this.editclauses);
      });
  }

  // main terms  edit
  editterms(id) {
    // this._fuseSidebarService.getSidebar('editPanel').toggleOpen();

    // let tempupdate = {
    //   id: id,
    //   termsName: "<strike>" + this.tmpeditclausetext + "</strike>" + " " + this.editclausetext

    // }

    // // this._userService.customeClauseuUpdate(tempupdate)
    // //   .subscribe(res => {
    // //     this._fuseSidebarService.getSidebar('editPanel').toggleOpen();

    // //   });
    // for (let index = 0; index < this.clauses.length; index++) {
    //   if (this.clauses[index].id == id) {
    //     this.clauses[index].termsName = "<strike>" + this.tmpeditclausetext + "</strike>" + " " + this.editclausetext;
    //   }
    // }
    var mainUserId = localStorage.getItem('userId');
    // console.log(mainUserId +" Main User ID");

    var companyId = localStorage.getItem('companyId');
    // console.log(companyId + " Company ID");

    var drawId = localStorage.getItem('drawId');
    // console.log(drawId + " Draw ID");

    var formId = localStorage.getItem('cpFormId');
    // console.log(formId + " CP Form ID");

    var clauseCategoryId = this.parentId;
    // console.log(clauseCategoryId + " Clause Category ID");

    var clauseTermsId = id;
    // console.log(clauseTermsId + " Clause Terms ID");

    var nos = '1';
    // console.log(nos + " Nos");

    var termsNameOrginal = this.tmpeditclausetext;
    // console.log(termsNameOrginal + " Terms Orginal Name");

    var termsName = this.editclausetext;
    // console.log(termsName + " Terms Name");

    const req =
    {
      mainUserId: mainUserId,
      companyId: companyId,
      drawId: '48',
      formId: '1',
      clauseCategoryId: clauseCategoryId,
      clauseTermsId: clauseTermsId,
      nos: nos,
      termsNameOrginal: termsNameOrginal,
      termsName: termsName,
      createdBy: localStorage.getItem('userId'),
      updatedBy: localStorage.getItem('userId'),
      isCustom: 'N'
    };
    console.log("check request", req);

    try {
      const header = new HttpHeaders();
      header.append('Content-Type', 'application/json');
      const headerOptions =
      {
        headers: header
      }
      this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(
        res => {
          this.termsUpdateRes = res;
          console.log("HERE OUT RESPONSE");
          console.log(this.termsUpdateRes);
          if (this.termsUpdateRes.success === true) {
            // console.log("HERE IN RESPONSE");
            console.log(this.termsUpdateRes);
            this._fuseSidebarService.getSidebar('editPanel').toggleOpen();
            this.editclausetext = '';

            this.termsReviewRecords();
          }
        }
      );
    } catch (err) {
    }
    // this.clausesDetail();
  }

  // custom terms edit toggle
  customToggle(key, id, clauseid): void {
    // let cid = id;
    // this._fuseSidebarService.getSidebar(key).toggleOpen();
    // for (let index = 0; index < this.newClause.length; index++) {
    //   if (this.newClause[index].id == id) {
    //     //  this.editclauses.push(this.newClause[index]);
    //     this.ceditid = this.newClause[index].id;
    //     this.editclausetext = this.newClause[index].termsName;
    //     this.tmpceditclausetext = this.newClause[index].termsName;
    //   }
    // }
    // console.log(this.editclausetext);
    // console.log(this.ceditid);
    var filter = JSON.parse(localStorage.getItem('clauseFilterData'));
    var drawId = filter.drawId;
    var formID = filter.formId;
    var companyId = filter.companyId;

    let cid = id;
    this.parentId = clauseid;
    this.editclauses = [];
    this._fuseSidebarService.getSidebar(key).toggleOpen();
    var clauseTermsReviewFilter = {};
    clauseTermsReviewFilter["tu.companyId"] = companyId;
    clauseTermsReviewFilter["tu.drawId"] = drawId;
    clauseTermsReviewFilter["tu.formId"] = formID;
    clauseTermsReviewFilter["tu.clauseCategoryId"] = this.parentId;
    // clauseTermsReviewFilter["tu.clauseTermsId"] = clauseTermsID;

    this._userService.clauseTermsReviewsRecordsServerSide(clauseTermsReviewFilter)
      .subscribe(res => {
        this.tempedit = res;
        for (let index = 0; index < this.tempedit.data.length; index++) {

          if (this.tempedit.data[index].id == id) {
            this.editclauses.push(this.tempedit.data[index]);
            this.editid = this.tempedit.data[index].id;

            this.editclausetext = this.tempedit.data[index].termsName;
            this.tmpeditclausetext = this.tempedit.data[index].termsName;
          }
        }
        console.log(this.editclausetext);
        console.log(this.editclauses);
      });
  }

  // custome terms edit    
  customEdit(id) {
    // let ceid = id;
    // let tempedit = {
    //   id: this.ceditid,
    //   termsName: "<strike>" + this.tmpceditclausetext + "</strike>" + " " + this.editclausetext,
    //   updatedBy: localStorage.getItem('userId')
    // }
    // console.log(tempedit);

    // // this._userService.customeClauseuUpdate(tempedit)
    // //   .subscribe(res => {
    // //     console.log(res);
    // //   });

    // // this.display();
    // for (let index = 0; index < this.newClause.length; index++) {
    //   if (this.newClause[index].id == id) {
    //     this.newClause[index].termsName = "<strike>" + this.tmpceditclausetext + "</strike>" + " " + this.editclausetext;
    //     // this.newClause[index].termsName = this.editclausetext;
    //   }
    // }
    // this._fuseSidebarService.getSidebar('customPanel').toggleOpen();
    // this.editclausetext = '';
    // this.termsReviewRecords();
    // console.log(this.newClause);

    var mainUserId = localStorage.getItem('userId');
    // console.log(mainUserId +" Main User ID");

    var companyId = localStorage.getItem('companyId');
    // console.log(companyId + " Company ID");

    var drawId = localStorage.getItem('drawId');
    // console.log(drawId + " Draw ID");

    var formId = localStorage.getItem('cpFormId');
    // console.log(formId + " CP Form ID");

    var clauseCategoryId = this.parentId;
    // console.log(clauseCategoryId + " Clause Category ID");

    var clauseTermsId = id;
    // console.log(clauseTermsId + " Clause Terms ID");

    var nos = '1';
    // console.log(nos + " Nos");

    var termsNameOrginal = this.tmpeditclausetext;
    // console.log(termsNameOrginal + " Terms Orginal Name");

    var termsName = this.editclausetext;
    // console.log(termsName + " Terms Name");

    const req =
    {
      mainUserId: mainUserId,
      companyId: companyId,
      drawId: '48',
      formId: '1',
      clauseCategoryId: clauseCategoryId,
      clauseTermsId: clauseTermsId,
      nos: nos,
      termsNameOrginal: termsNameOrginal,
      termsName: termsName,
      createdBy: localStorage.getItem('userId'),
      updatedBy: localStorage.getItem('userId'),
      isCustom: 'Y'
    };
    console.log("check request", req);

    try {
      const header = new HttpHeaders();
      header.append('Content-Type', 'application/json');
      const headerOptions =
      {
        headers: header
      }
      this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(
        res => {
          this.termsUpdateRes = res;
          console.log("HERE OUT RESPONSE");
          console.log(this.termsUpdateRes);
          if (this.termsUpdateRes.success === true) {
            // console.log("HERE IN RESPONSE");
            console.log(this.termsUpdateRes);
            this._fuseSidebarService.getSidebar('customPanel').toggleOpen();
            this.editclausetext = '';

            this.termsReviewRecords();
          }
        }
      );
    } catch (err) {
    }
  }
  //   main terms view

  view(key, id, clauseid) {
    let cid = id;
    this.parentId = clauseid;
    this.editclauses = [];
    this._fuseSidebarService.getSidebar(key).toggleOpen();
    this.viewData = [];
    for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
      // console.log(this.termsReviewRecordsData,'test');
      if (this.termsReviewRecordsData[index].id == this.parentId) {
        for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++) {
          if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].id == cid) {
            if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length != 0) {
              for (let thirdindex = 0; thirdindex < this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length; thirdindex++) {
                this.viewData.push(this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate[thirdindex])

              }
            }

          }
        }

      }

    }
    this.dataSource = new MatTableDataSource(this.viewData);
    // setTimeout(() => this.dataSource.paginator = this.paginator, 15000);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.viewData, "view array")
    console.log(this.dataSource, 'viewdata');

  }


  // custome terms view
  viewCustom(key, id, clauseid) {
    let cid = id;
    this.parentId = clauseid;
    this.editclauses = [];
    this._fuseSidebarService.getSidebar(key).toggleOpen();
    this.viewData = [];
    for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
      // console.log(this.termsReviewRecordsData,'test');
      if (this.termsReviewRecordsData[index].id == this.parentId) {
        for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++) {
          if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].id == cid) {
            if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length != 0) {
              for (let thirdindex = 0; thirdindex < this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length; thirdindex++) {
                this.viewCustomData.push(this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate[thirdindex])

              }
            }
          }
        }
      }
    }

    this.dataSourcecustom = new MatTableDataSource(this.viewCustomData);
    // setTimeout(() => this.dataSource.paginator = this.paginator, 15000);
    this.dataSourcecustom.paginator = this.paginator;
    this.dataSourcecustom.sort = this.sort;
    console.log(this.viewData, "view array")
    console.log(this.dataSourcecustom, 'viewdata');
  }


  submit() {

    var fromUserId = localStorage.getItem('userId');
    // console.log(mainUserId +" Main User ID");
    var notification = 'New Draw C/p Available';
    var toUserId = localStorage.getItem('charter_id');
    const req =
    {
      fromUserId: fromUserId,
      toUserId: toUserId,
      notification: notification,
      createdBy: localStorage.getItem('userId'),
      updatedBy: localStorage.getItem('userId'),
      isCustom: 'Y'
    };
    console.log("check request", req);

    try {
      const header = new HttpHeaders();
      header.append('Content-Type', 'application/json');
      const headerOptions =
      {
        headers: header
      }
      this.http.post(`${config.baseUrl}/notificationCreate`, req, headerOptions).subscribe(
        res => {
          this.notifiactionres = res;
          console.log("HERE OUT RESPONSE");
          console.log(this.notifiactionres);
          if (this.notifiactionres.success === true) {
            // console.log("HERE IN RESPONSE");
            console.log(this.notifiactionres);
            // this._fuseSidebarService.getSidebar('addPanel').toggleOpen();
            this.termsReviewRecords();
          }
        }
      );
    } catch (err) {
    }

  }
}