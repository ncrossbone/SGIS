Ext.define('Sgis.view.south.popup.MeasureResultController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sourth_branch_measureResult',
    
    control: {	
		'#measureGrid menuitem': {
			chartAdd: 'chartAddHandler',
			chartRemove: 'chartRemoveHandler'
		}
	},
	
    afterrenderHandler:function(){
    	var params = this.getView().params;
    	this.getView().makeGrid(); 
    	this.getView().getViewModel().arcSearch(params);
    },
    
    tryeventHandler:function(colIndex){
    	alert(colIndex)
    },
    
    chartAddHandler:function(conIndex){
    	alert("Add : " + conIndex)
    },
    
    chartRemoveHandler:function(conIndex){
    	alert("Remove : " + conIndex)
    }
});