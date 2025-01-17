import Chart from 'chart.js'

import Highcharts from 'highcharts'

export default {
	props:['type','id','data','mode', 'color'],

	data(){
		return {
			chart:null,
		}
	},
	computed : {
		chartId(){
			if(this.id == undefined || this.id == null || this.id.length == 0)
				return 'chartId';
			return this.id;
		},
		chartType(){
			if (this.type == undefined || this.type == null || this.type.length == 0)
				return 'bar'
			return this.type
		},
		chartData(){
			if (this.data == undefined || this.data == null || this.data.length == 0)
				return []
			return this.data
		},
		chartMode(){
			if (this.mode == undefined || this.mode == null || this.mode.length == 0)
				return null
			return this.mode
		},
	},
	watch:{
		chartData(val){
			this.initialize(this.type, this.id, val, this.color);
		}
	},
	mounted(){
		this.initialize(this.type, this.id, this.data, this.color);
	},
	methods:{
		initialize(type,id,data, color){
			color = color != undefined && color != null ? color : [];
			if(this.type === 'doughnut'){
				if(this.mode === 'transferee'){
					this.chart = Morris.Donut({
				  	element: this.id,
				    data: this.data,
					hoverCallback: function(index, options, content) {
				    },
					formatter: function(t) {
			            return t + "%"
			        },
			        resize: !0,
			        colors: color,
					}).on('click', function (i,row){
						window.open(row.link,'_blank');
					});
				}else{
					this.chart = Morris.Donut({
				  	element: this.id,
				    data: this.data,
					hoverCallback: function(index, options, content) {
				    },
					formatter: function(t) {
			            return t + "%"
			        },
			        resize: !0,
			        colors:["#12afcb", "#a9a9a9"],
					}).on('click', function (i,row){
						window.open(row.link,'_blank');
					});
				}
			}
			else if(this.type === 'bar'){
				let idChart = this.id
				Chart.defaults.global.legend.display = true;
				let labels = this.data.labels
				this.chart = new Chart(idChart,{
					type:this.type,
					data:{
						labels: labels,
						datasets: [
							{
			                    label: "Initiated",
			                    backgroundColor: "rgba(0,123,255,0.5)",
			                    borderColor: "rgba(0,123,255,0.8)",
			                    highlightFill: "rgba(0,123,255,0.75)",
			                    highlightStroke: "rgba(0,123,255,1)",
			                    data: this.data.dataResponse[0].value,
			                    borderWidth: 1
			                },
			                {
			                    label: "Completed",
			                    backgroundColor: "rgba(255,193,7,0.2)",
			                    borderColor: "rgba(255,193,7,1)",
			                    pointColor: "rgba(255,193,7,1)",
			                    pointStrokeColor: "#fff",
			                    pointHighlightFill: "#fff",
			                    pointHighlightStroke: "rgba(18,175,203,1)",
			                    data: this.data.dataResponse[1].value,
			                    borderWidth: 1
			                }
						]
					},
					options:{
				        scaleBeginAtZero : true,
				        scaleShowGridLines : true,
				        scaleGridLineColor : "rgba(0,0,0,.05)",
				        scaleGridLineWidth : 1,
				        scaleShowHorizontalLines: true,
				        scaleShowVerticalLines: true,
				        barShowStroke : true,
				        barStrokeWidth : 2,
				        barDatasetSpacing : 1,
				        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
				        responsive: true,
				        legend: {
				            position: 'right',
				        },
				        title: {
				            display: false,
				            text: 'Initiated & Completed Relocations by Month',
				            position:'top',
				        },
				    }
				})
			}
			else if(this.type === 'doughnutChart'){

				Highcharts.chart(this.id, {
				    chart: {
				        plotBackgroundColor: null,
				        plotBorderWidth: null,
				        plotShadow: false,

				        type: 'pie',
				        backgroundColor: 'transparent',
				    },
				    title: {
					    text: '',
					    floating: true,
					    enabled:false,

					},
					credits:{
						enabled:false,
					},
				    colors: color,
				    tooltip: {
				        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
				    },
				    plotOptions: {
				        pie: {
				            allowPointSelect: true,
				            cursor: 'pointer',
				            dataLabels: {
				                enabled: false,
				                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
				                style: {
				                    color: (Highcharts.theme) || 'black'
				                }
				            }
				        }
				    },
				    series: [{
				        colorByPoint: true,
				      	 point: {
								events: {
									click: function(e) {
										//this.slice();
				            			window.open( e.point.url,'_blank');
										//window.location.href =;
										e.preventDefault();
									}
								}
							},
						data: this.data
				    }]
				});
			}
			this.$emit('input',this.data);
		}
	}
}
