Ext.define('Sgis.view.south.popup.InfoResult', {
    extend: 'Ext.container.Container',
    xtype: 'sourth_branch_infoResult',
    alias: 'widget.sourth_branch_infoResult',
    requires : [
                'Sgis.view.south.popup.InfoResultViewModel',
                'Sgis.view.south.popup.InfoResultController'	
	],
    
	viewModel: 'sourth_branch_infoResult',
	controller: 'sourth_branch_infoResult',
	
	listeners: {
    	afterrender: 'afterrenderHandler'
    },
    
    params:null,
	
	padding:'4, 4, 4, 4',
	layout: {
        type: 'table',
        columns: 2,
        tableAttrs: {
            style: {
                width: '100%',
            }
        }
    },
    
    addItem:function(){
    	this.add({
            xtype: 'displayfield',
            fieldLabel: 'Home',
            name: 'home_score',
            style: 'margin-bottom: -1px; border: 1px solid #CCCCCC', 
            labelStyle:'padding-left:4px; background-color: #eeeeee',
            labelWidth:80,
            fieldStyle:'padding-left:4px',
            width:420, height:30,
            bind:{value:'{title}'},
        });
    }
});