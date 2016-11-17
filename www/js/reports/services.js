/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

services.factory('ReportsService', ['ReportsGCService'
                                    , '$q'
                                    , function (ReportsGCService
                                                , $q
                                    ) {
    /*
     * This service checks out all the report relevant and sends a list
     */
    var tooltip = nv.models.tooltip();
    tooltip.duration(0);
    
    var services = {
        setChartOptions: function (chartObject) {
            switch(chartObject.type  || "null") {
                case 'pieChart':
                    chartOptions = {  
                        chart: {
                            type: 'pieChart',
                            height: 500,
                            x: function(d){return d.key;},
                            y: function(d){return d.y;},
                            showLabels: true,
                            duration: chartObject.duration || 500,
                            labelThreshold: 0.01,
                            labelSunbeamLayout: true,
                            legend: {
                                margin: {
                                    top: 5,
                                    right: 35,
                                    bottom: 5,
                                    left: 0
                                }
                            },
                            labelType: chartObject.labelType  || null
                        }
                    };
                    break;
                case 'doughnut':
                    chartOptions = {
                        chart: {
                            type: 'pieChart',
                            height: 500,
                            x: function(d){return d.key;},
                            y: function(d){return d.y;},
                            showLabels: false,
                            duration: chartObject.duration || 500,
                            labelThreshold: 0.01,
                            labelSunbeamLayout: true,
                            width: 320,
                            title: null,
                            donut: true,
                            tooltips: false,
                            legend: {
                                margin: {
                                    top: 5,
                                    right: 0,
                                    bottom: 5,
                                    left: 0
                                }
                            },
                            labelType: chartObject.labelType  || null
                        }
                    };
                    break;
                case 'discreteBarChart':
                    chartOptions = {
                        chart: {
                            type: 'discreteBarChart',
                            height: 450,
                            x: function(d){return d.label;},
                            y: function(d){return d.value;},                          
                            margin: {
                                top: 20,
                                right: 20,
                                bottom: 50,
                                left: 55
                            },
                            showValues: chartObject.showValues || values,
                            duration: chartObject.duration || 500,
                            xAxis: {
                                axisLabel: chartObject.xLabel || null
                            },
                            yAxis: {
                                axisLabel: chartObject.yLabel  || null,
                                axisLabelDistance: -10
                            }
                        }
                    };
                    break;
                case 'multiBarHorizontalChart':
                    chartOptions = {
                        chart: {
                            type: 'multiBarHorizontalChart',
                            height: 450,
                            x: function(d){return d.label;},
                            y: function(d){return d.value;},
                            showControls: chartObject.showControls || false,
                            showValues: chartObject.showValues || false,
                            showXAxis: chartObject.showXAxis || true,
                            showYAxis: ! chartObject.showValues,
                            showLegend: chartObject.showLegend || false,
                            duration: chartObject.duration || 2000,
                            stacked: chartObject.stacked || false,
                            xAxis: {
                                axisLabel: chartObject.xLabel || null,
                                showMaxMin: chartObject.showMaxMin || false
                            },
                            yAxis: {
                                axisLabel: chartObject.yLabel || null,
                                tickFormat: function(d) {
                                    return d3.format(',f')(d);
                                }
                            }
                        }
                    };
                    break;
            }
            return chartOptions;
        }
    };
    return services;
}]);