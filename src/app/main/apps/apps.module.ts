import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { DrawComponent } from './draw/draw.component';
// import { MatRadioModule } from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import { CptpManagementComponent } from './cptp-management/cptp-management.component';
import { DrawCpClausesComponent } from './draw-cp-clauses/draw-cp-clauses.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationComponent } from './notification/notification.component';
import { DrawcpComponent } from './drawcp/drawcp.component';
// import { StdbidManagementComponent } from './stdbid-management/stdbid-management.component';
// import { CountryPickerModule } from 'angular2-countrypicker';
// import { DrawFirstCounterManagementComponent } from './draw-first-counter-management/draw-first-counter-management.component';
// import { DrawCpCounterComponent } from './draw-cp-counter/draw-cp-counter.component';


// import{ClauseTermsComponent} from './clause-terms/clause-terms.component';
const routes = [
    {
        path: 'dashboards/analytics',
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule',
    },
    // {
    //     path: 'bid-management',
    //     loadChildren: './stdbid-management/stdbid-management.module#StdbidManagementModule',
    // },
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
        path: 'owner-management',
        loadChildren: './owner-management/owner-management.module#OwnerManagementModule',
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
        path: 'drawcp-management',
        loadChildren: './drawcp/drawcp.module#DrawCPManagementModule',
    },
    {
        path: 'cptp-management',
        loadChildren: './cptp-management/cptp-management.module#CPTPManagementModule',
    },
    {
        path: 'drawCp-Clauses-management',
        loadChildren: './draw-cp-clauses/draw-cp-clauses.module#DrawCpClausesManagementModule',
    },
    // {
    //     path: 'clauses-terms-management',
    //     loadChildren: './clause-terms/cluses-terms.module#ClauseTermsModule',
    // }
    {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsManagementModule',
    },
    {
        path: 'dfcm',
        loadChildren: './draw-first-counter-management/draw-first-counter-management.module#DFCManagementModule',
    },
    {
        path: 'notification',
        loadChildren: './notification/notification.module#NotificationManagementModule',
    },
    {
        path: 'trading-platform-management',
        loadChildren: './trading-platform-management/trading-platform-management.module#TradingManagementModule',
    },
    {
        path: 'recap-management',
        loadChildren: './recap/recap.module#RecapManagementModule',
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes), FuseSharedModule
     ],
    declarations: [],
})
export class AppsModule {}
