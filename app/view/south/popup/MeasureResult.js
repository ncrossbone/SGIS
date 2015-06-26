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
    
    chartAddInfo:{},
    
    items: [{
    	id:'measureGrid',
		xtype : 'grid',
		flex:0.5,
		autoScroll : true,
		rowLines : true,
		columnLines : true,
		bind:{store:'{grid}'},
		listeners: {
            afterrender: function(c) {                                        
                var menu = c.headerCt.getMenu();
                var menuItem = menu.add({
                    text: '차트추가',
                    handler: function(col) {
                        //alert(col.text + " " + menu.activeHeader.dataIndex);
                    	this.up().up().up().up().chartAddInfo['col_'+menu.activeHeader.dataIndex] = menu.activeHeader.dataIndex;
                    	this.fireEvent('tryevent', menu.activeHeader.dataIndex);
                    }
                });
                
                var menu2 = c.headerCt.getMenu();
                var menuItem2 = menu2.add({
                    text: '차트삭제',
                    handler: function(col) {
                    	delete this.up().up().up().up().chartAddInfo['col_'+menu.activeHeader.dataIndex];
                    	this.fireEvent('tryevent', menu.activeHeader.dataIndex);
                    }
                });
                
                menu.on('beforeshow', function() {
                   var currentDataIndex = menu.activeHeader.dataIndex; 
//                    if (currentDataIndex === 'IC_00002') {
//                        menuItem.show();
//                    	//menuItem.setText("xx")
//                    } else {
//                        menuItem.hide();
//                    }
                   if(this.up().up().up().up().chartAddInfo[currentDataIndex]){
                	   menuItem.hide();
                	   menuItem2.show();
                   }else{
                	   menuItem.show();
                	   menuItem2.hide();
                   }
                });
            }
        }
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
				width:80,
				text : fields[i].fnm,
				dataIndex : fields[i].fid
				//flex : 1
			})
		}
		grid.reconfigure([], columns);
	}
});