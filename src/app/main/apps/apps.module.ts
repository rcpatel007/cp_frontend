import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { DrawComponent } from './draw/draw.component';
// import { MatRadioModule } from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import { CptpManagementComponent } from './cptp-management/cptp-management.component';


// import{ClauseTermsComponent} from './clause-terms/clause-terms.component';
const routes = [
    {
        path: 'dashboards/analytics',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule',
    },
    // {
    //     path        : 'dashboards/project',
    //     loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
    // },
    {
        path: 'role-management',
        loadChildren: './role-management/role-management.module#RoleManagementModule',
       
    },
    {
        path: 'change-password',
        loadChildren:
            './change-password/change-password.module#ChangePasswordModule',
       
    },
    {
        path: 'user-management',
        loadChildren: './user-management/user-management.module#UserManagementModule',
        
    },
    {
        path: 'role-access-management',
        loadChildren: './role-access-management/role-access-management.module#RoleAccessManagementModule',
      
    },
    {
        path: 'broker-management',
        loadChildren: './broker-management/broker-management.module#BrokerManagementModule',
       
    },

    {
        path: 'master/company-management',
        loadChildren: './company-management/company-management.module#CompanyManagementModule',
       
    },
    {
        path: 'charterer-management',
        loadChildren: './charterer-management/charterer-management.module#ChartererManagementModule',
      
    },
   
    {
        path: 'master/company-admin',
        loadChildren: './company-admin/company-admin.module#CompanyAdminModule',
      
    },
    {
        path: 'alert-management',
        loadChildren: './alert-management/alert-management.module#AlertManagementModule',
      
    },
    {
        path: 'vessel-management',
        loadChildren: './vessel-management/vessel-management.module#VesselManagementModule',
      
    },
    {
        path: 'charter-type-management',
        loadChildren: './charter-party-type/charter-party-type.module#CharterPartyTypeModule',
    },
    {
        path: 'clause-category-management',
        loadChildren: './clause-category/clause-category.module#ClauseCategoryModule',
    },
    {
        path: 'cp-form-management',
        loadChildren: './cp-form/cp-form.module#CPFormModule',
    },
    {
        path: 'clause-terms-management',
        loadChildren: './clause-terms/clauseterms.module#clusesTermsModule',
    },
    {
        path: 'draw-management',
        loadChildren: './draw/draw.module#DrawManagementModule',
    },
    {
        path: 'cptp-management',
        loadChildren: './cptp-management/cptp-management.module#CPTPManagementModule',
    },
    // {
    //     path: 'clauses-terms-management',
    //     loadChildren: './clause-terms/cluses-terms.module#ClauseTermsModule',
    // }

];

@NgModule({
    imports: [RouterModule.forChild(routes), FuseSharedModule],
    declarations: [],
})
export class AppsModule {}
