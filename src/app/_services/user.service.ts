import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../_models';

import { config } from '../config/config';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class UserService {
    userToken: any;
    constructor(private http: HttpClient, private router: Router) {
        const token = JSON.parse(localStorage.getItem('currentUser'));
       // console.log(token);
        if (token == null) {
            //this.userToken = token.token;
            this.router.navigate(['/pages/auth/login'])
        }
    }


    
    // Notification Create
    notificationCreate(req)
    {
        return this.http.post(`${config.baseUrl}/notificationCreate`,req)
    }

    // Notification Records
    notificationRecords(req)
    {
        return this.http.post(`${config.baseUrl}/notificationRecords`,req)
    }
    clausesCategoryRecords(){
       // console.log('here in clauses Categoory services');
        return this.http.get(`${config.baseUrl}/clusesCategorylist`)
    }
    
    getUserList() {
        return this.http.get(`${config.baseUrl}/userList`);
    }
    getCompanyList() {
        return this.http.get(`${config.baseUrl}/companylist`);
    }
    getUsersCompanyList(req)
    {
        return this.http.post(`${config.baseUrl}/getUsersCompanyList`,req);
    }
    getChartererList() {
        return this.http.get(`${config.baseUrl}/charterlist`);
    }
    getbrokererList() {
        return this.http.get(`${config.baseUrl}/AllBrokerlist`);
    }
    addCompanyList(req) {
        return this.http.post(`${config.baseUrl}/companycreate`, req);
    }
    updateCompanyList(req) {
        return this.http.post(`${config.baseUrl}/companyupdate`, req);
    }
    updateCompanyadminList(req) {
        return this.http.post(`${config.baseUrl}/companyadminupdate`, req);
    }
    updateUserManagement(req) {
        return this.http.post(`${config.baseUrl}/userupdate`, req);
    }
    getCompanyadminList() {
        return this.http.get(`${config.baseUrl}/companyadminlist`);
    }
    updateCharterer(req) {
        return this.http.post(`${config.baseUrl}/charterupdate`, req);
    }
    getChartererDetail(req) {
        return this.http.post(`${config.baseUrl}/charterdetails`, req);
    }
    getbrokererDetail(req) {
        return this.http.post(`${config.baseUrl}/BrokerDetails`, req);
    }
    getvesselDetail(req) {
        return this.http.post(`${config.baseUrl}/vesseldetails`, req);
    }
    VesselList() {
        return this.http.get(`${config.baseUrl}/vessellist`);
    }
    getactivitylist() {
        return this.http.get(`${config.baseUrl}/vesselactivity`);
    }
    AddVessel(req) {

        return this.http.post(`${config.baseUrl}/vesseladd`, req);
    }
    getstateList() {
        return this.http.get(`${config.baseUrl}/vesselbase`);
    }
    getbuilderList() {
        return this.http.get(`${config.baseUrl}/vesselbuilder`);
    }
    getflagList() {
        return this.http.get(`${config.baseUrl}/vesselflag`);
    }
    getstatusList() {
        return this.http.get(`${config.baseUrl}/vesselstatus`);
    }
    getcommmentList() {
        return this.http.get(`${config.baseUrl}/vesselcomment`);
    }
    getenginedesignList() {
        return this.http.get(`${config.baseUrl}/auxenginedesignlist`);
    }
    getenginetypeList() {
        return this.http.get(`${config.baseUrl}/auxenginetypelist`);
    }
    getfueltypeList() {
        return this.http.get(`${config.baseUrl}/fueltypeslist`);
    }
    getnationalityList() {
        return this.http.get(`${config.baseUrl}/nationalitylist`);
    }
    getvesseltypeeList() {
        return this.http.get(`${config.baseUrl}/shiptypelist`);
    }
    getcompanyList() {
        return this.http.get(`${config.baseUrl}/companylist`);
    }
    getregistryList() {
        return this.http.get(`${config.baseUrl}/portregistrylist`);
    }
    addSubAlert(req) {
        return this.http.post(`${config.baseUrl}/subcategoryAdd`, req);
    }
    deleteVessel(req) {
        return this.http.post(`${config.baseUrl}/vesseldelete`, req);
    }
    updateVessel(req) {
        return this.http.post(`${config.baseUrl}/vesselupdate`, req);
    }
    addFile(req) {
        return this.http.post(`${config.baseUrl}/fileupload`, req);
    }
    roleActiveInactive(req) {
        return this.http.post(`${config.baseUrl}/userroleactive`, req);
    }
    selectList(req) {
        return this.http.post(`${config.baseUrl}/selectrolelist`, req);
    }
    moduleAction(req) {
        return this.http.post(`${config.baseUrl}/moduleactioncreate`, req);
    }
    PositionList() {
        return this.http.get(`${config.baseUrl}/vesselpositionlist`)
    }
    roleListshow() {
        return this.http.get(`${config.baseUrl}/roleAccessmoduleView`)
    }



    // charter party type

    getcharterpartytypeList() {
        return this.http.get(`${config.baseUrl}/charterpartylist`)
    }
    getcharterpartytypeadd(req) {
        return this.http.post(`${config.baseUrl}/charterpartytypecreate`, req);
    }
    getcharterpartytypeupdate(req) {
        return this.http.post(`${config.baseUrl}/charterpartypeupdate`, req);
    }
    getcharterpartytypedelete(req) {
        return this.http.post(`${config.baseUrl}/charterpartytypedelete`, req);
    }



    // cluses category detail

    getclusesCategoryList() {
        return this.http.get(`${config.baseUrl}/clusesCategorylist`)
    }
    getclusesCategoryadd(req) {
        return this.http.post(`${config.baseUrl}/clusesCategorycreate`, req);
    }
    getclusesCategoryupdate(req) {
        return this.http.post(`${config.baseUrl}/clusesCategoryupdate`, req);
    }
    getclusesCategorydelete(req) {
        return this.http.post(`${config.baseUrl}/clusesCategorydelete`, req);
    }


    // cluses term detail

    getclusesList() {
        return this.http.get(`${config.baseUrl}/cluseslist`)
    }
    getclusesadd(req) {
        return this.http.post(`${config.baseUrl}/clusescreate`, req);
    }
    getclusesupdate(req) {
        return this.http.post(`${config.baseUrl}/clusesupdate`, req);
    }
    getclusesdelete(req) {
        return this.http.post(`${config.baseUrl}/clusesdelete`, req);
    }


    //Cp Form 

    getFormList() {
        return this.http.get(`${config.baseUrl}/cpFromlist`)
    }

    getFormadd(req) {
        return this.http.post(`${config.baseUrl}/cpFromcreate`, req)
    }

    getFormedit(req) {
        return this.http.post(`${config.baseUrl}/cpFromupdate`,req)
    }

    getFormdelete(req) {
        return this.http.post(`${config.baseUrl}/cpFromdelete`,req)
    }

    // Draw Form Routes
    // Draw Form Records Service
    drawFormRecords()
    {
       // console.log('here in user services');
        return this.http.get(`${config.baseUrl}/drawFormRecords`)
    }
    //  Draw Records Server Side
    drawRecordsServerSide(req)
    {
       // console.log(req);
        return this.http.post(`${config.baseUrl}/drawRecordsServerSide`, req)
    }
    // Draw Form Create Service
    DrawFormCreate(req)
    {
        return this.http.post(`${config.baseUrl}/DrawFormCreate`, req)
    }
    // Draw Form Update Service
    drawFormUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/drawFormUpdate`,req)
    }
    // Draw Form Remove Service
    drawDataRemove(req)
    {
        return this.http.post(`${config.baseUrl}/drawDataRemove`,req)
    }

    // CityForm Routes
    // CityForm Records Service
    CityRecords()
    {
        return this.http.get(`${config.baseUrl}/CityRecords`)
    }
    // CityForm Create Service
    CityCreate(req)
    {
        return this.http.post(`${config.baseUrl}/CityCreate`, req)
    }
    // CityForm Update Service
    CityUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/CityUpdate`,req)
    }
    // CityForm Remove Service
    CityRemove(req)
    {
        return this.http.post(`${config.baseUrl}/CityRemove`,req)
    }

    // Draw Invite Routes
    // Draw Invite Records Server Side
    DrawInviteRecordsServerSide(req)
    {
       // console.log(req);
        return this.http.post(`${config.baseUrl}/DrawInviteRecordsServerSide`, req)
    }
    // Draw Invite Form Create Service
    DrawInviteCreate(req)
    {
        return this.http.post(`${config.baseUrl}/DrawInviteCreate`, req)
    }
    // Draw Invite Form Update Service
    DrawInviteUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/DrawInviteUpdate`,req)
    }
    // Draw Invite Form Remove Service
    DrawInviteRemove(req)
    {
        return this.http.post(`${config.baseUrl}/DrawInviteRemove`,req)
    }



//  ********************   // clause amendment

// clause amendment  add
    customeClauseadd(req)
    {
        return this.http.post(`${config.baseUrl}/clauseamendmentCreate`,req)
    }
    customeClauseuUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/clauseamendmentUpdate`,req)
    }
    customeClauseremove(req)
    {
        return this.http.post(`${config.baseUrl}/clauseamendmentRemove`,req)
    }
    
    customeClauseList()
    {
        return this.http.get(`${config.baseUrl}/clauseamendmentlist`)
    }


    clauseCategoryServerSideRecordsServerSide(req)
    {
        return this.http.post(`${config.baseUrl}/clauseCategoryServerSideRecords`,req)
    }

    // Clause Terms Data Records Server Side

    clauseTermsDetailsRecordsServerSide(req)
    {
        return this.http.post(`${config.baseUrl}/clauseTermsDetailsRecordsServerSide`,req)
    }

    // Clause Reviews Records Server Side
    clauseTermsReviewsRecordsServerSide(req)
    {
        return this.http.post(`${config.baseUrl}/clauseTermsReviewsRecordsServerSide`,req)
    }

    // Clause Reviews Records Server Side Custom
    clauseTermsReviewsRecordsServerSideCustom(req)
    {
        return this.http.post(`${config.baseUrl}/clauseTermsReviewsRecordsServerSideCustom`,req)
    }
    
    clauseTermsUpdate (req)
    {
        return this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`,req)
    }

    clauseCustomeTermsUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/claueseDetailCustomInsertUpdate`,req)
    }

    // Clause Terms Review Insert Update
    claueseDetailInsertUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`,req)
    }

    // Clause Category Records Server Side
    clauseCategoryServerSideRecords(req)
    {
        return this.http.post(`${config.baseUrl}/clauseCategoryServerSideRecords`,req)
    }
}