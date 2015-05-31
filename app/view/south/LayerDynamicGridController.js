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
		SGIS.msg.alert('Layer : ' + this.getView().layerId + ', Object Id : ' + record.get('OBJECTID') + ', Event : dataGridSelect');
		Sgis.getApplication().fireEvent('dataGridSelect', grid.layerId, record);
	}
});
