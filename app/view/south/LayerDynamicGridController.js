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
		
			var layerId = this.getView().layerId;
			SGIS.msg.alert('Event : searchParamChange, Layer ID : ' + layerId);
			console.log(params);
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
		SGIS.popup('Sgis.view.south.popup.BranchInfoPopup', {layerId:this.getView().layerId, record:record});
	},
	
	onWellDetail: function(button, event, eOpts) {
		var record = button.getWidgetRecord();
		SGIS.msg.alert('관정보기 : OBJECTID : ' + record.get('OBJECTID'));
	}
});
