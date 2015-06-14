Ext.define('Sgis.view.south.popup.MeasureResult', {
    extend: 'Ext.container.Container',
    xtype: 'sourth_branch_measureResult',
    alias: 'widget.sourth_branch_measureResult',
    requires : [
                'Sgis.view.south.popup.MeasureResultViewModel',
                'Sgis.view.south.popup.MeasureResultController'	
	],
    
	viewModel: 'sourth_branch_measureResult',
	controller: 'sourth_branch_measureResult',
	
	listeners: {
    	afterrender: 'afterrenderHandler'
    },

	padding:'4, 4, 4, 4',
	
	params:null,
	
	layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'center'
    },
    
    items: [{
    	id:'measureGrid',
		xtype : 'grid',
		flex:0.5,
		autoScroll : true,
		rowLines : true,
		columnLines : true,
		bind:{store:'{grid}'}
	},{
		xtype: 'cartesian',
		flex:0.5,
        animate: true,
        shadow: false,
        style: 'background: #ccc;'
	}],
	
	makeGrid:function(){
		var me = this;
		var columns = [];
		var grid = me.down('#measureGrid');
		var fields = Sgis.app.coreMap.getLayerChartFiledInfo()[me.params.layerId];
		for(var i=0; i<fields.length; i++){
			columns.push({
				text : fields[i].fnm,
				dataIndex : fields[i].fid,
				flex : 1
			})
		}
		grid.reconfigure([], columns);
	}
});