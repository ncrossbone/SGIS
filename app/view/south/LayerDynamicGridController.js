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
			// TODO Local Filter
			var toolbar = this.getView().down(' toolbar');
			var year = toolbar.down('#btnYear').getText();
			var quarter = toolbar.down('#btnQuarter').getText();
		
			var params = {
				year : year,
				quarter : quarter
			};
		
			console.log(params);
			Sgis.getApplication().fireEvent('searchParamChange', this.getView().layerId, params);
		}
	},
	
	dataGridSelect: function(grid, record, item, index, e, eOpts) {
		SGIS.msg.alert('Layer : ' + this.getView().layerId + ', Object Id : ' + record.get('OBJECTID') + ', Event : dataGridSelect');
		Sgis.getApplication().fireEvent('dataGridSelect', grid.layerId, record);
	}
});
