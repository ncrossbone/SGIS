/**
* LayerDynamicGridController
*/
Ext.define('Sgis.view.south.LayerDynamicGridController', {
	
	extend: 'Ext.app.ViewController',
	
	alias: 'controller.layer_dynamic_grid',
	
	control: {
		'layer_dynamic_grid' : {
			itemclick: 'dataGridSelect'
		},
		'toolbar cycle': {
			change: 'reloadGrid'
		}
	},
	
	constructor: function() {
		this.callParent();
		Sgis.getApplication().addListener('searchParamChangeCallback', this.searchParamChangeCallbackeHandler, this);
	},
	
	reloadGrid: function(btn) {
		if(btn.itemId == 'btnCountPerPage') {
			var pageSize = btn.getText();
			pageSize = parseInt(pageSize);
			this.getView().getStore().setPageSize(pageSize);
			this.getView().getStore().load();
			
		} else {
			var toolbar = this.getView().down(' toolbar');
			var items = toolbar.items.items;
			var params = {};

			Ext.Array.each(items, function(item) {
				if(item.xtype == 'cycle' && item.itemId != 'btnCountPerPage') {
					params[item.itemId] = item.text;
				}
			});
		
//			var store = this.getView().getStore();
//			var filters = [];
//			for(var key in params){
//				if(params[key]!='ALL'){
//					filters.push({property:key, value:params[key]});
//				}
//			}
//			store.setFilters(filters);
//			if(filters.length==0){
//				store.clearFilter();
//			}
			
			var layerId = this.getView().layerId;
			Sgis.getApplication().fireEvent('searchParamChange', layerId, params);
		}
	},
	
	dataGridSelect: function(grid, record, item, index, e, eOpts) {
		Sgis.getApplication().fireEvent('dataGridSelect', this.getView().layerId, record);
	},
	
	exportExcel: function(button, event, eOpts) {
		var layerId = this.getView().layerId;
		SGIS.msg.alert('export layer : ' + layerId);
	},
	
	onBranchDetail: function(button, event, eOpts) {
		var record = button.getWidgetRecord();
		//SGIS.msg.alert('지점상세보기 : OBJECTID : ' + record.get('OBJECTID'));
		SGIS.popup('Sgis.view.south.popup.BranchInfoPopup', {layerId:this.getView().layerId, layerName:this.getView().title, record:record});
	},
	
	onWellDetail: function(button, event, eOpts) {
		var record = button.getWidgetRecord();
		SGIS.msg.alert('관정보기 : OBJECTID : ' + record.get('OBJECTID'));
	},
	
	searchParamChangeCallbackeHandler:function(reData){
		this.getView().createDynamicStore(null, reData);
	}
});
