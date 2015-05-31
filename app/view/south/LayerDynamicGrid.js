Ext.define('Sgis.view.south.LayerDynamicGrid', {

	extend : 'Ext.grid.Panel',
	
	requires : [
		'Sgis.store.LayerDynamicStore',
		'Sgis.view.south.LayerDynamicGridController'
	],
	
	xtype : 'layer_dynamic_grid',
	
	layerId : '0',
	
	controller : 'layer_dynamic_grid',

	title : '',
	
	store : Ext.create('Ext.data.Store'),

	flex : 1,
		
	autoScroll : true,
		
	rowLines : true,
		
	columnLines : true,
	
	columns : [ { 
		dataIndex : 'id',
		width : 30,
		text : ''
	} ],
	
	tbar : {
		xtype : 'toolbar',
		items : [/*{
			xtype : 'label',
			text : '연도',
			padding : '0 10 0 10'
		}, {
			itemId : 'btnYear',
			xtype : 'cycle',
			showText : true,
			menu : {
				items : [{
					text : '2010',
					checked : true
				}, {
					text : '2011'
				}, {
					text : '2012'
				}, {
					text : '2013'
				}, {
					text : '2014'
				}]
			}
		}, {
			xtype : 'label',
			text : '분기',
			padding : '0 10 0 30'
		}, {
			itemId : 'btnQuarter',
			xtype : 'cycle',
			showText : true,
			menu : {
				items : [{
					text : '전체',
					checked : true
				}, {
					text : '상반기'
				}, {
					text : '하반기'
				}]
			}
		},'->', {
			itemId : 'lblCountPerPage',
			xtype : 'label',
			text : '페이지 당 데이터 개수',
			padding : '0 10 0 00'
		}, {
			itemId : 'btnCountPerPage',
			xtype : 'cycle',
			showText : true,
			menu : {
				items : [{
					text : '15',
					checked : true
				}, {
					text : '30'
				}, {
					text : '50'
				}]
			}
		}*/]
	},
	
	bbar : {
		xtype : 'pagingtoolbar',
		cls : 'pagingToolbar',
		store : this.store,
		displayInfo: true,
		displayMsg: '{0} - {1} of {2}',
		emptyMsg: '데이터가 없습니다.'
	},
	
	getPageSize : function() {
		var toolbar = this.down(' toolbar');
		var pageSize = toolbar.down('#btnCountPerPage').getText();
		return parseInt(pageSize);
	},
	
	bindPagingToolbar : function(store) {
		var pagingtoolbar = this.down(' pagingtoolbar');
		pagingtoolbar.bindStore(store);
	},
	
	refreshGrid : function(result) {
		this.reconfigureSearchForm(result);
		this.reconfigureGrid(result);
	},
	
	/**
	 * Reconfigure search form
	 */
	reconfigureSearchForm : function(result) {
		
		var filters = result.filter;
		if(!filters || filters.length == 0) {
			return;
		}
		
		// remove previous items
		var toolbar = this.down(' toolbar');
		var isFirst = toolbar.items.length > 0 ? false : true;
		
		// 1. 처음 툴바를 구성하는 것이라면 모든 필터 컴포넌트를 추가 
		if(isFirst) {
			// add new items
			for(var i = 0 ; i < filters.length ; i++) {
				var filter = filters[i];
				var filterName = '';
				var filterValues = [];
			
				for(var prop in filter) {
					filterName = prop;
					filterValues = filter[filterName];
				}
			
				var filterLabel = this.newFilterLabel(filterName);
				var filterItems = [];
				for(var j = 0 ; j < filterValues.length ; j++) {
					filterItems.push({
						text : filterValues[j]
					});
				}
			
				var filterComp = this.newFilterComp(filterName, filterItems);
				toolbar.add(filterLabel);
				toolbar.add(filterComp);
			}
			
			// add separator
			toolbar.add('->');
			
			// add count per page label
			toolbar.add({
				itemId : 'lblCountPerPage',
				xtype : 'label',
				text : '페이지 당 데이터 개수',
				padding : '0 10 0 00'
			});
			
			// add count per page comp
			toolbar.add({
				itemId : 'btnCountPerPage',
				xtype : 'cycle',
				showText : true,
				menu : {
					items : [{
						text : '15',
						checked : true
					}, {
						text : '30'
					}, {
						text : '50'
					}]
				}
			});
			
		// 2. 처음 툴바를 구성하는 것이 아니라면 필터 값만 변경
		} else {
			for(var i = 0 ; i < filters.length ; i++) {
				var filter = filters[i];
				var filterName = '';
				var filterValues = [];
			
				for(var prop in filter) {
					filterName = prop;
					filterValues = filter[filterName];
				}
			
				item = toolbar.child('#' + filterName);
				item.items = [];
				for(var j = 0 ; j < filterValues.length ; j++) {
					item.items.push({
						text : filterValues[j]
					});
				}
			}
		}
	},
	
	newFilterLabel : function(filterName) {
		return {
			xtype : 'label',
			text : filterName,
			padding : '0 10 0 10'
		};
	},
	
	newFilterComp : function(filterName, filterItems) {
		return {
			itemId : filterName,
			xtype : 'cycle',
			showText : true,
			menu : {
				items : filterItems
			}
		};
	},

	/**
	 * Reconfigure grid
	 */	
	reconfigureGrid : function(result) {
		var store = this.getStore();
		
		if(store == null || !store.fields) {
			var data = this.getLayerDataAll(result);
			if(data && data[0] && data[1]) {
				this.reconfigureDynamicGrid(data[0], data[1]);
			}
		} else {
			var data = this.getLayerData(result);
			if(data) {
				store.getProxy().setData(data);
				store.read();
			}
		}
	},
	
	reconfigureDynamicGrid : function(headers, dataList) {
		var columns = [];
		
		for(var i = 0 ; i < headers.length ; i++) {
			columns.push({
				text : headers[i].text,
				dataIndex : headers[i].dataIndex,
				flex : 1
			})
		}
		
		var store = this.createDynamicStore(columns, dataList);
		
		if(columns) {
			this.reconfigure(store, columns);
		} else {
			store.read();
		}
		
		Ext.resumeLayouts(true);
	},
	
	createDynamicStore : function(headers, dataList) {
		var store = this.getStore();
		var pageSize = this.getPageSize();
		
		if(store == null || !store.fields) {
			var fields = [];

			for(var i = 0 ; i < headers.length ; i++) {
				fields.push(headers[i].dataIndex);
			}
		
			store = Ext.create('Sgis.store.LayerDynamicStore', {
				fields: fields,
				data: dataList
			});
		}

		store.setPageSize(pageSize);
		store.getProxy().setData(dataList);
		this.setStore(store);
		this.bindPagingToolbar(store);
		return store;
	},
	
	/**
	 * Get Layer Data - Headers & Data
	 */	
	getLayerDataAll : function(result) {
		if(result) {
			var headers = this.getLayerMetadata(result);
			var dataList = this.getLayerData(result);
			return [headers, dataList];
		} else {
			return null;
		}
	},
	
	/**
	 * Get Layer Columns Information
	 */
	getLayerMetadata : function(result) {
		var fields = result.field;
		if(!fields) {
			return null;
		}
		
		var headers = [];
		
		for(var i = 0 ; i < fields.length ; i++) {
			var header = {
				text: fields[i].fnm,
				dataIndex: fields[i].fid,
				hidden: (fields[i].flag === false) ? true : false
			};
			
			headers.push(header);
		}
		
		return headers;
	},
	
	/**
	 * Get Layer Data
	 */
	getLayerData : function(result) {
		var headers = result.field;
		if(!headers) {
			return null;
		}
		
		var datum = result.datas;
		if(!datum) {
			return null;
		}
		
		var dataList = [];
		
		for(var i = 0 ; i < datum.length ; i++) {
			var data = {};
			
			for(var j = 0 ; j < headers.length ; j++) {
				data[headers[j].fid] = datum[i][headers[j].fid];
			}
			
			dataList.push(data);
		}
		
		return dataList;
	}
});
