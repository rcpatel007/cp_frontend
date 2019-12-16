import { FuseNavigation } from '@fuse/types';


var childrenArray = [];
if (JSON.parse(localStorage.getItem('userRoleId')) != '7'){
var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'dashboard';
    childrenArrayInfo["title"] = 'Dashboard';
    childrenArrayInfo["translate"] = 'NAV.DASHBOARDS';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'dashboard';
    childrenArrayInfo["url"] = '/apps/dashboards/analytics';

    childrenArray.push(childrenArrayInfo);

console.log(JSON.parse(localStorage.getItem('userRoleId')));

if (JSON.parse(localStorage.getItem('userRoleId')) == '5')
{
    // var childrenArrayInfo = {};
    //     childrenArrayInfo["id"] = 'owner';
    //     childrenArrayInfo["title"] = 'Owner Management';
    //     childrenArrayInfo["type"] = 'item';
    //     childrenArrayInfo["icon"] = 'work';
    //     childrenArrayInfo["url"] = '/apps/owner-management';

    //     childrenArray.push(childrenArrayInfo);
    
    // var childrenArrayInfo = {};
    //     childrenArrayInfo["id"] = 'broker';
    //     childrenArrayInfo["title"] = 'Broker Management';
    //     childrenArrayInfo["translate"] = 'NAV.BROKERMANAGEMENT';
    //     childrenArrayInfo["type"] = 'item';
    //     childrenArrayInfo["icon"] = 'supervisor_account';
    //     childrenArrayInfo["url"] = '/apps/broker-management';

    //     childrenArray.push(childrenArrayInfo);

    // var childrenArrayInfo = {};
    //     childrenArrayInfo["id"] = 'charter';
    //     childrenArrayInfo["title"] = 'charter Management';
    //     childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
    //     childrenArrayInfo["type"] = 'item';
    //     childrenArrayInfo["icon"] = 'supervised_user_circle';
    //     childrenArrayInfo["url"] = '/apps/charterer-management';

    var childrenArrayInfo = {};
        childrenArrayInfo["id"] = 'user';
        childrenArrayInfo["title"] = 'User Management';
        childrenArrayInfo["translate"] = 'NAV.USERMANAGEMENT';
        childrenArrayInfo["type"] = 'item';
        childrenArrayInfo["icon"] = 'supervised_user_circle';
        childrenArrayInfo["url"] = '/apps/user-management';

        childrenArray.push(childrenArrayInfo);

    var childrenArrayInfo = {};
        childrenArrayInfo["id"] = 'CP Form';
        childrenArrayInfo["title"] = 'CP Form Management';
        childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
        childrenArrayInfo["type"] = 'item';
        childrenArrayInfo["icon"] = 'format_align_center';
        childrenArrayInfo["url"] = '/apps/cp-form-management';

        childrenArray.push(childrenArrayInfo);

    var childrenArrayInfo = {};
        childrenArrayInfo["id"] = 'Clause Catgegory';
        childrenArrayInfo["title"] = 'Clause Catgegory Management';
        childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
        childrenArrayInfo["type"] = 'item';
        childrenArrayInfo["icon"] = 'format_align_justify';
        childrenArrayInfo["url"] = '/apps/clause-category-management';

        childrenArray.push(childrenArrayInfo);

    var childrenArrayInfo = {};
        childrenArrayInfo["id"] = 'Clause Terms';
        childrenArrayInfo["title"] = 'Clause Terms Management';
        childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
        childrenArrayInfo["type"] = 'item';
        childrenArrayInfo["icon"] = 'format_list_numbered';
        childrenArrayInfo["url"] = '/apps/clause-terms-management';

        childrenArray.push(childrenArrayInfo);
}

if (JSON.parse(localStorage.getItem('userRoleId')) == '3')
{
    // var childrenArrayInfo = {};
    //     childrenArrayInfo["id"] = 'charter';
    //     childrenArrayInfo["title"] = 'charter Management';
    //     childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
    //     childrenArrayInfo["type"] = 'item';
    //     childrenArrayInfo["icon"] = 'list_alt';
    //     childrenArrayInfo["url"] = '/apps/charterer-management';

    //     childrenArray.push(childrenArrayInfo);
}

var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Draw C/P';
    childrenArrayInfo["title"] = 'Draw C/P';
    childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'color_lens';
    childrenArrayInfo["url"] = '/apps/draw-management';

    childrenArray.push(childrenArrayInfo);

var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Trading Platform';
    childrenArrayInfo["title"] = 'Trading Platform';
    childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'sync';
    childrenArrayInfo["url"] = '/apps/trading-platform-management';

    childrenArray.push(childrenArrayInfo);

var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Notification';
    childrenArrayInfo["title"] = 'Notification';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'notifications_active';
    childrenArrayInfo["url"] = '/apps/notification';

    childrenArray.push(childrenArrayInfo);

    console.log(childrenArray);
}

var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Draw C/P';
    childrenArrayInfo["title"] = 'Draw C/P';
    childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'color_lens';
    childrenArrayInfo["url"] = '/apps/draw-management';

    childrenArray.push(childrenArrayInfo);

export const navigation: FuseNavigation[] =
[
    
    {
        id: '',
        title: '',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        icon: 'apps',
        children: childrenArray
    }
];
