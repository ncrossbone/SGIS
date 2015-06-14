Ext.define('Sgis.view.south.LayerDynamicGrid', {

	extend : 'Ext.grid.Panel',
	
	requires : [
		'Ext.grid.column.Action',
		'Sgis.store.LayerDynamicStore',
		'Sgis.view.south.LayerDynamicGridController',
		'Sgis.view.south.popup.BranchInfoPopup'
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
		items : []
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
		var pageCountComp = toolbar.down('#btnCountPerPage');
		return parseInt(pageCountComp ? pageCountComp.getText() : '15');
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

		// remove previous items
		var toolbar = this.down(' toolbar');
		var isFirst = toolbar.items.length > 0 ? false : true;
		var filters = result.filter;
		
		if(!filters || filters.length == 0) {
			if(isFirst) {
				this.addDefaultToolbarItem(toolbar);
			}
			return;
		}
		
		// 1. 처음 툴바를 구성하는 것이라면 모든 필터 컴포넌트를 추가 
		if(isFirst) {
			// add new items
			for(var i = 0 ; i < filters.length ; i++) {
				var filter = filters[i];
				var filterName = '';
			
				for(var prop in filter) {
					filterName = prop;
				}
				
				// 필터값을 데이터로 부터 추출한다.
				var filterValues = this.extractFilterValues(filterName, result.datas);
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
			
			this.addDefaultToolbarItem(toolbar);
			
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
	
	addDefaultToolbarItem : function(toolbar) {
		// add separator
		toolbar.add('->');	
		
		// excel export 버튼 
		toolbar.add({
			itemId : 'export',
			xtype : 'button',
			text : '내려 받기',
			handler : 'exportExcel'
		});
		
		// add count per page label
		toolbar.add({
			itemId : 'lblCountPerPage',
			xtype : 'label',
			text : '페이지 당 데이터 개수',
			padding : '0 10 0 10'
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
		var headerConut = headers.length;
		
		for(var i = 0 ; i < headerConut ; i++) {
			
			// 첫 컬럼에 row numberer 추가 
			if(i == 0) {
				columns.push({
					xtype : 'rownumberer',
					text : '#',
					dataIndex : 'no',
					width : 50
				})
			}
			
			columns.push({
				text : headers[i].text,
				dataIndex : headers[i].dataIndex,
				hidden : headers[i].hidden,
				flex : 1
			})
			
			// 마지막 컬럼에 버튼 두 개 추가
			if(i == headerConut - 1) {
				columns.push({
					text: '',
					align: 'center',
					xtype: 'widgetcolumn',
					dataIndex: '',
					width: 90,
					widget: {
						xtype: 'button',
						text: '지점상세',
						handler: 'onBranchDetail'
					}
				});
				
//				columns.push({
//					text: '',
//					align: 'center',
//					xtype: 'widgetcolumn',
//					dataIndex: '',
//					width: 60,
//					widget: {
//						xtype: 'button',
//						text: '관정',
//						handler: 'onWellDetail'
//					}
//				});
			}
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
			var hidden = fields[i].hasOwnProperty('flag');
			var header = {
				text: fields[i].fnm,
				dataIndex: fields[i].fid,
				hidden: hidden
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
	},
	
	extractFilterValues : function(filterField, dataList) {
		var filterValues = [];
		for(var i = 0 ; i < dataList.length ; i++) {
			var data = dataList[i];
			var filterData = data[filterField];
			if(filterData && !Ext.Array.contains(filterValues, filterData)) {
				filterValues.push(filterData);
			}
		}
		
		Ext.Array.sort(filterValues);
		return filterValues;
	}
});
