/**
* South Controller
*/
Ext.define('Sgis.view.south.SouthController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.app-south',

	constructor: function() {
		this.callParent();
		Sgis.getApplication().addListener('searchComplete', this.searchGrid, this);
	},
	
	searchGrid: function(results) {
		if(!results || results.length == 0) {
			return;
		}
		
		for(var i = 0 ; i < results.length ; i++) {
			var result = results[i];
			var grid = SGIS.showSearchGrid(result.layerId, result.title);
			
			// grid 인스턴스 마다 자기 레이어 데이터만 처리함 
			if(grid.layerId == result.layerId) {
				var store = grid.getStore();
				if(store == null || !store.fields) {
					var data = grid.getLayerDataAll(result);
					if(data && data[0] && data[1]) {
						grid.reconfigureDynamicGrid(data[0], data[1]);
					} else {
						console.log('Result is invalid : ');
						console.log(result);
					}
				} else {
					var data = this.getLayerData(result);
					if(data) {
						store.getProxy().setData(data);
						store.read();
					}
				}
			}
		}
	}
});
