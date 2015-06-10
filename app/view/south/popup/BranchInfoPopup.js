Ext.define('Sgis.view.south.popup.BranchInfoPopup', {
	extend: 'Cmm.view.Popup',
	xtype: 'sourth_branch_info',
	
	controller : 'sourth_branch_info',
	
	requires : [
	            'Sgis.view.south.popup.InfoResult',
	    		'Ext.chart.*'
	    		],
	title: '지점정보',
	
	height: 700,
	width: 850,
	
	items:[{
		xtype : 'tabpanel',
		items: [{
			title: '지점정보',
			xtype:'sourth_branch_infoResult'
			
		},{
			title: '측정결과',
			layout: {
		        type: 'vbox',
		        align: 'stretch',
		        pack: 'center'
		        //padding: '4 4 4 4'
		    },
		    items: [{
				xtype : 'grid',
				flex:0.5,
				store : Ext.create('Ext.data.Store', {
			        model: Ext.create('Ext.data.Model', {fields: [
		                  {name: 'projectId', type: 'int'},
		                  {name: 'project', type: 'string'},
		                  {name: 'taskId', type: 'int'},
		                  {name: 'description', type: 'string'},
		                  {name: 'estimate', type: 'float'},
		                  {name: 'rate', type: 'float'},
		                  {name: 'cost', type: 'float'},
		                  {name: 'due', type: 'date', dateFormat:'m/d/Y'}
		              ]}),
			        sorters: {property: 'due', direction: 'ASC'},
			        groupField: 'project'
			    }),
				
				autoScroll : true,
				
				rowLines : true,
				
				columnLines : true,
				
				features: [{
		            id: 'group',
		            ftype: 'groupingsummary',
		            groupHeaderTpl: '{name}',
		            hideGroupedHeader: true,
		            enableGroupingMenu: false
		        }],

				columns: [{
		            text: 'Task',
		            flex: 1,
		            tdCls: 'task',
		            sortable: true,
		            dataIndex: 'description',
		            hideable: false,
		            summaryType: 'count',
		            summaryRenderer: function(value, summaryData, dataIndex) {
		                return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
		            }
		        }, {
		            header: 'Project',
		            width: 180,
		            sortable: true,
		            dataIndex: 'project'
		        }, {
		            header: 'Due Date',
		            width: 136,
		            sortable: true,
		            dataIndex: 'due',
		            summaryType: 'max',
		            renderer: Ext.util.Format.dateRenderer('m/d/Y'),
		            summaryRenderer: Ext.util.Format.dateRenderer('m/d/Y'),
		            field: {
		                xtype: 'datefield'
		            }
		        }, {
		            header: 'Estimate',
		            width: 100,
		            sortable: true,
		            dataIndex: 'estimate',
		            summaryType: 'sum',
		            renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
		                return value + ' hours';
		            },
		            summaryRenderer: function(value, summaryData, dataIndex) {
		                return value + ' hours';
		            },
		            field: {
		                xtype: 'numberfield'
		            }
		        }, {
		            header: 'Rate',
		            width: 120,
		            sortable: true,
		            renderer: Ext.util.Format.usMoney,
		            summaryRenderer: Ext.util.Format.usMoney,
		            dataIndex: 'rate',
		            summaryType: 'average',
		            field: {
		                xtype: 'numberfield'
		            }
		        }, {
		            id: 'cost',
		            header: 'Cost',
		            width: 100,
		            sortable: false,
		            groupable: false,
		            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
		                return Ext.util.Format.usMoney(record.get('estimate') * record.get('rate'));
		            },
		            dataIndex: 'cost',
		            summaryType: function(records, values) {
		                var i = 0,
		                    length = records.length,
		                    total = 0,
		                    record;

		                for (; i < length; ++i) {
		                    record = records[i];
		                    total += record.get('estimate') * record.get('rate');
		                }
		                return total;
		            },
		            summaryRenderer: Ext.util.Format.usMoney
		        }]
			},{
				xtype: 'cartesian',
				flex:0.5,
		        //padding: '10 0 0 0',
		        animate: true,
		        shadow: false,
		        style: 'background: #ccc;'
			}]
		}]
	}]
});
