
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, UserService } from '../../../../_services';
// import { FuseConfigService } from '@fuse/services/config.service';
// import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { HttpClient } from '@angular/common/http';
// import { config } from '../../../../config/config';

@Component({
  selector: 'app-edit-cp-form',
  templateUrl: './edit-cp-form.component.html',
  styleUrls: ['./edit-cp-form.component.scss']
})
export class EditCpFormComponent implements OnInit {

  cpManagementForm: FormGroup;
  typeData: any;
  loading = false;
  submitted = false;
  cpformName: String;
  returnUrl: String;
  showLoaderImg = false;
  // Private
  submitRes: any;
  // private _unsubscribeAll: Subject<any>;
  /**
       * Constructor
       *
       
       * @param {FuseSidebarService} _fuseSidebarService
       
       */
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _userService: UserService,
    // private _fuseSidebarService: FuseSidebarService,
    private http: HttpClient,
    private alertService: AlertService) {
    // Configure the layout
    this.showLoaderImg = false;
    // this.enableSubmitStatus = true;
    // this.roleListData = [];
    // this.companyListData = [];

    // let userToken = localStorage.getItem('userToken')
    // if(userToken==undefined){
    //     this.router.navigate(['/']);
    // }
  }

  ngOnInit() {
    this.typeData = JSON.parse(localStorage.getItem('cpformdata'));

    this.cpManagementForm = this._formBuilder.group({
      cpformName: [this.typeData.cpformName, Validators.required],

    });
    console.log(this.cpManagementForm);
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/cp-form-management';
  }
  get f() { return this.cpManagementForm.controls; }


  onSubmit() {
    console.log("fsf");
    this.showLoaderImg = true;
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.cpManagementForm.invalid) {
      console.log("if");
      // this.clicked = true;
      // this.enableSubmitStatus = true;
      return;
    } else {
      console.log("add");
      const reqData = {
        "id": this.typeData.id,
        "cpformName": this.f.cpformName.value,

      }
      console.log(reqData);
      this.loading = true;
      this._userService.getFormedit(reqData)
        .pipe(first())
        .subscribe(
          data => {
            this.showLoaderImg = false;
            this.submitRes = data;
            if (this.submitRes.success === true) {
              this.alertService.success(this.submitRes.message, 'Success');
              this.router.navigate([this.returnUrl]);
              // this.enableSubmitStatus = false;
              // this.clicked = false;
            } else {
              this.alertService.error(this.submitRes.message, 'Error');
            }
            console.log(data);
          },
          error => {
            console.log(error.message);
            this.alertService.error(error.message, 'Error');
            this.loading = false;
          });
    }


  }

}
