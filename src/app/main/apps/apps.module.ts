import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AddCharterPartyTypeComponent } from './charter-party-type/add-charter-party-type/add-charter-party-type.component';
import { CharterPartyTypeComponent } from './charter-party-type/charter-party-type.component';
import { EditCharterPartyTypeComponent } from './charter-party-type/edit-charter-party-type/edit-charter-party-type.component';
import { CpFormComponent } from './cp-form/cp-form.component';
import { AddCpFormComponent } from './cp-form/add-cp-form/add-cp-form.component';
import { EditCpFormComponent } from './cp-form/edit-cp-form/edit-cp-form.component';
import { ClauseCategoryTermsComponent } from './clause-category-terms/clause-category-terms.component';

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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), FuseSharedModule],
    declarations: [
ClauseCategoryTermsComponent],
   
})
export class AppsModule {}
