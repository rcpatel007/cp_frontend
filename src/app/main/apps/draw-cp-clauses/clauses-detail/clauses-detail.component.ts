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
import { AngularEditorConfig } from '@kolkov/angular-editor';




@Component({
  selector: 'app-clauses-detail',
  templateUrl: './clauses-detail.component.html',
  styleUrls: ['./clauses-detail.component.scss']
})
export class ClausesDetailComponent implements OnInit {
  customClause: String;
  editclause: String;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '50%',
    minHeight: '50%',
    maxHeight: '50%',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Please Enter New Clause.',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
  };

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
  add = [];
  newClause = [];
  previusClause: any;
  nextClause: any;
  customCl = false;
  tempid = 1;
  tempedit: any;
  editclauses = [];
  editclausetext: String;
  tmpeditclausetext: String;
  editid: String;
  ceditid: String;
  tmpceditclausetext: String;
  parentId: String;
  nextStatus = false;



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
    this.display();
  }
  addModal() {
    this.showModalStatus = true;

  }

  clausesDetail() {
    this.clauses = [];
    this.clauseCategory = JSON.parse(localStorage.getItem('clausesId'));
    this.firstClase = this.clauseCategory[0];
    let clusename: String;
    console.log(this.clauseCategory);
    // this._userService.clausesCategoryRecords().
    // subscribe(res => {
    // this.drawManagementRes = res;
    // for (let index = 0; index < this.clauseCategory.length; index++) {
    // if (this.clauseCategory[index].id == this.firstClase.cid) {
    this.clusename = this.clauseCategory[0].name;
    this.parentId = this.clauseCategory[0].cid;
    let pindex = 0;
    let nindex = 1;

    this.previusClause = this.clauseCategory[pindex].cid;
    this.nextClause = this.clauseCategory[nindex].cid;
    // }
    // }

    console.log('data', this.clusename);
    console.log('previus', this.previusClause);
    console.log('next', this.nextClause);
    // });

    this._userService.getclusesList()
      .subscribe(res => {
        console.log(res);
        this.tempData = res;

        for (let index = 0; index < this.tempData.data.length; index++) {

          if (this.tempData.data[index].parentId == this.clauseCategory[0].cid) {
            this.clauses.push(this.tempData.data[index]);
          }
        }

        console.log(this.tempData.data);
        console.log(this.clauses);

      });
  }

  Previous(pid) {
    this.clauses = [];
    let pc = this.previusClause;
    this.clusename = '';
    this.clauseCategory = JSON.parse(localStorage.getItem('clausesId'));

    // this.firstClase = this.clauseCategory[0];
    // let clusename: String;
    // console.log(this.clauseCategory);
    // this._userService.clausesCategoryRecords().
    // subscribe(res => {
    // this.drawManagementRes = res;
    // });

    this._userService.getclusesList()
      .subscribe(res => {
        console.log(res);
        this.tempData = res;

        for (let index = 0; index < this.tempData.data.length; index++) {
          if (this.tempData.data[index].parentId == pid) {
            this.clauses.push(this.tempData.data[index]);
            this.parentId = this.clauseCategory[index].cid;

          }
        }
        console.log(this.tempData.data);
        console.log(this.clauses);
      });


    for (let index = 0; index < this.clauseCategory.length; index++) {
      if (this.clauseCategory[index].cid == pid) {
        this.clusename = this.clauseCategory[index].name;
        let nindex = index + 1;
        let pindex = index - 1;
        if (this.clauseCategory[index] == 0) {
          this.router.navigate(['/apps/drawCp-Clauses-management']);
        }
        else {
          this.previusClause = this.clauseCategory[pindex].cid;

        }

        this.nextStatus = false;
        this.nextClause = this.clauseCategory[nindex].cid;
      }
    }
    this.display();

    // console.log('data', this.clusename);
    // console.log('previus', this.previusClause);
    // console.log('next', this.nextClause);

  }

  next(nextClause) {
    this.clauses = [];
    this.clusename = '';
    let nc = this.nextClause;
    // this.clauseCategory = JSON.parse(localStorage.getItem('clausesId'));
    // this.firstClase = this.clauseCategory[0];
    // let clusename: String;
    // console.log(this.clauseCategory);
    // this._userService.clausesCategoryRecords().
    // subscribe(res => {
    // this.previusClause = null;
    // this.nextClause = null;
    // this.drawManagementRes = res;
    // });
    this._userService.getclusesList()
      .subscribe(res => {
        console.log(res);
        this.tempData = res;
        for (let index = 0; index < this.tempData.data.length; index++) {
          if (this.tempData.data[index].parentId == nextClause) {
            this.clauses.push(this.tempData.data[index]);
          }
        }

        console.log(this.tempData.data);
        console.log(this.clauses);

      });

    for (let index = 0; index < this.clauseCategory.length; index++) {
      if (this.clauseCategory[index].cid === nextClause) {
        this.clusename = this.clauseCategory[index].name;
        this.parentId = this.clauseCategory[index].cid;
        let pindex = index - 1;
        if (nextClause == this.clauseCategory[this.clauseCategory.length - 1].cid) {
          this.nextStatus = true;
        }
        else {
          let nindex = index + 1;
          this.nextClause = this.clauseCategory[nindex].cid;
          this.nextStatus = false;
        }
        this.previusClause = this.clauseCategory[pindex].cid;
      }
    }
    this.display();
    // console.log('data', this.clauseCategory);
    // console.log('data', this.clusename);
    // console.log('previus', this.previusClause);
    // console.log('next', this.nextClause);
  }

  /**
 * Toggle sidebar open
 *
 * @param key
 */
  toggleOpen(key): void {
    this._fuseSidebarService.getSidebar(key).toggleOpen();
  }
  editToggle(key, id): void {
    let cid = id;
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
        console.log(this.editclause);
      });
  }

  editterms(id) {
    let eid = id;
    for (let index = 0; index < this.clauses.length; index++) {
      if (this.clauses[index].id == eid) {
        this.clauses[index].termsName = "<strike>" + this.tmpeditclausetext + "</strike>" + " " + this.editclausetext;
      }
    }
    this._fuseSidebarService.getSidebar('editPanel').toggleOpen();

    this.editclausetext = '';
    // this.clausesDetail();
  }


  customToggle(key, id): void {
    let cid = id;
    this._fuseSidebarService.getSidebar(key).toggleOpen();
    for (let index = 0; index < this.newClause.length; index++) {
      if (this.newClause[index].id == id) {
        //  this.editclauses.push(this.newClause[index]);
        this.ceditid = this.newClause[index].id;
        this.editclausetext = this.newClause[index].termsName;
        this.tmpceditclausetext = this.newClause[index].termsName;
      }
    }
    console.log(this.editclausetext);
    console.log(this.editclauses);
  }


  customEdit(id) {
    let ceid = id;
    for (let index = 0; index < this.newClause.length; index++) {
      if (this.newClause[index].id == id) {
        this.newClause[index].termsName = "<strike>" + this.tmpceditclausetext + "</strike>" + " " + this.editclausetext;
        // this.newClause[index].termsName = this.editclausetext;
      }

    }
    this._fuseSidebarService.getSidebar('customPanel').toggleOpen();

    this.editclausetext = '';
    // this.display();
    console.log(this.newClause);

  }


  display() {
    let tempCaluse = JSON.parse(localStorage.getItem('newClause'));
    // if (this.newClause.length) {
    for (let index = 0; index < tempCaluse.length; index++) {

      if (tempCaluse[index].parentId == this.parentId) {
        this.newClause.push(tempCaluse[index]);
      }
    }
    this.customCl = true;
    // }
    console.log(this.newClause);
  }


  addClause() {
    // let add = new Array; 
    let temp = {
      id: this.tempid,
      parentId: this.parentId,
      termsName: this.customClause
    }
    this._fuseSidebarService.getSidebar('addPanel').toggleOpen();

    // this._fuseSidebarService.getSidebar('addpanel').toggleClose();

    this.add.push(temp);
    localStorage.setItem('newClause', JSON.stringify(this.add));
    console.log(localStorage.getItem('newClause'));
    this.display();
    this.tempid = this.tempid + 1;
  }
}
