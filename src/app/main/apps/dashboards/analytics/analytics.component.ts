import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { AnalyticsDashboardService } from 'app/main/apps/dashboards/analytics/analytics.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
@Component({
    selector: 'analytics-dashboard',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AnalyticsDashboardComponent implements OnInit {
    widgets: any;
    widget1SelectedYear = '2016';
    widget5SelectedDay = 'today';
    name: string;
    position: number;
    date: string;
    schar: string;
    symbol: string;
    charterer: string;
    // MatPaginator Output
    displayedColumns: string[] = ['position', 'date', 'charterer', 'name', 'schar', 'symbol'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    /**
     * Constructor
     *
     * @param {AnalyticsDashboardService} _analyticsDashboardService
     */
    constructor(
        private _analyticsDashboardService: AnalyticsDashboardService,
        private router: Router,
    ) {
        // Register the custom chart.js plugin
        // this._registerCustomChartJSPlugin();
        console.log('Application loaded. Initializing data.');

        let userToken = localStorage.getItem('userToken')
        if(userToken==undefined){
            this.router.navigate(['/']);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {
        // Get the widgets from the service
        this.widgets = this._analyticsDashboardService.widgets;
        this.dataSource.paginator = this.paginator;

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register a custom plugin
     */
    // private _registerCustomChartJSPlugin(): void {
    //     (window as any).Chart.plugins.register({
    //         afterDatasetsDraw: function (chart, easing): any {
    //             // Only activate the plugin if it's made available
    //             // in the options
    //             if (
    //                 !chart.options.plugins.xLabelsOnTop ||
    //                 (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
    //             ) {
    //                 return;
    //             }

    //             // To only draw at the end of animation, check for easing === 1
    //             const ctx = chart.ctx;

    //             chart.data.datasets.forEach(function (dataset, i): any {
    //                 const meta = chart.getDatasetMeta(i);
    //                 if (!meta.hidden) {
    //                     meta.data.forEach(function (element, index): any {

    //                         // Draw the text in black, with the specified font
    //                         ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    //                         const fontSize = 13;
    //                         const fontStyle = 'normal';
    //                         const fontFamily = 'Roboto, Helvetica Neue, Arial';
    //                         ctx.font = (window as any).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

    //                         // Just naively convert to string for now
    //                         const dataString = dataset.data[index].toString() + 'k';

    //                         // Make sure alignment settings are correct
    //                         ctx.textAlign = 'center';
    //                         ctx.textBaseline = 'middle';
    //                         const padding = 15;
    //                         const startY = 24;
    //                         const position = element.tooltipPosition();
    //                         ctx.fillText(dataString, position.x, startY);

    //                         ctx.save();

    //                         ctx.beginPath();
    //                         ctx.setLineDash([5, 3]);
    //                         ctx.moveTo(position.x, startY + padding);
    //                         ctx.lineTo(position.x, position.y - padding);
    //                         ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    //                         ctx.stroke();

    //                         ctx.restore();
    //                     });
    //                 }
    //             });
    //         }
    //     });
    // }
}

export interface PeriodicElement {
    name: string;
    date: string;
    position: number;
    schar: string;
    symbol: string;
    charterer: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, date: '12 Oct 2017', name: 'NORD MANZANILLO', charterer: 'Cargill Internation SA', schar: '08 NOV 2017', symbol: 'Atlantic trader' },
    { position: 2, date: '12 Oct 2017', name: 'STANA PLANINA', charterer: 'Thorko Bulk a/s', schar: '08 NOV 2017', symbol: 'KM London' },
    { position: 3, date: '12 Oct 2017', name: 'Clipper Breeze or Sub in OO', charterer: 'Cargill Internation SA', schar: '08 NOV 2017', symbol: 'OLIMPIA.GR' },
    { position: 4, date: '12 Oct 2017', name: 'KARVUNA', charterer: 'Thorko Bulk a/s', schar: '08 NOV 2017', symbol: 'IRIS OLDENDORFF' },
    { position: 5, date: '12 Oct 2017', name: 'IRMA', charterer: 'Cargill Internation SA', schar: '08 NOV 2017', symbol: 'CHANG HANG HUI HAI' },
    { position: 6, date: '12 Oct 2017', name: 'PERELIK', charterer: 'Thorko Bulk a/s', schar: '08 NOV 2017', symbol: 'TOMINY DYNASTY' },
    { position: 7, date: '12 Oct 2017', name: 'NORD MANZANILLO', charterer: 'Cargill Internation SA', schar: '08 NOV 2017', symbol: 'Atlantic trader' },
    { position: 8, date: '12 Oct 2017', name: 'STANA PLANINA', charterer: 'Thorko Bulk a/s', schar: '08 NOV 2017', symbol: 'KM London' },
    { position: 9, date: '12 Oct 2017', name: 'Clipper Breeze or Sub in OO', charterer: 'Cargill Internation SA', schar: '08 NOV 2017', symbol: 'OLIMPIA.GR' },
    { position: 10, date: '12 Oct 2017', name: 'KARVUNA', charterer: 'Thorko Bulk a/s', schar: '08 NOV 2017', symbol: 'IRIS OLDENDORFF' },
    { position: 11, date: '12 Oct 2017', name: 'IRMA', charterer: 'Cargill Internation SA', schar: '08 NOV 2017', symbol: 'CHANG HANG HUI HAI' },
    { position: 12, date: '12 Oct 2017', name: 'PERELIK', charterer: 'Thorko Bulk a/s', schar: '08 NOV 2017', symbol: 'TOMINY DYNASTY' },
    { position: 13, date: '12 Oct 2017', name: 'NORD MANZANILLO', charterer: 'Cargill Internation SA', schar: '08 NOV 2017', symbol: 'Atlantic trader' },
    { position: 14, date: '12 Oct 2017', name: 'STANA PLANINA', charterer: 'Thorko Bulk a/s', schar: '08 NOV 2017', symbol: 'KM London' },
    { position: 15, date: '12 Oct 2017', name: 'Clipper Breeze or Sub in OO', charterer: 'Cargill Internation SA', schar: '08 NOV 2017', symbol: 'OLIMPIA.GR' },
    { position: 16, date: '12 Oct 2017', name: 'KARVUNA', charterer: 'Thorko Bulk a/s', schar: '08 NOV 2017', symbol: 'IRIS OLDENDORFF' },
    { position: 17, date: '12 Oct 2017', name: 'IRMA', charterer: 'Cargill Internation SA', schar: '08 NOV 2017', symbol: 'CHANG HANG HUI HAI' },
    { position: 18, date: '12 Oct 2017', name: 'PERELIK', charterer: 'Thorko Bulk a/s', schar: '08 NOV 2017', symbol: 'TOMINY DYNASTY' },
    { position: 19, date: '12 Oct 2017', name: 'NORD MANZANILLO', charterer: 'Cargill Internation SA', schar: 'Lorem', symbol: 'Atlantic trader' },
    { position: 20, date: '12 Oct 2017', name: 'STANA PLANINA', charterer: 'Thorko Bulk a/s', schar: 'Lorem', symbol: 'KM London' },

];