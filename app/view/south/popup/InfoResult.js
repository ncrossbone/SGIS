Ext.define('Sgis.view.south.popup.InfoResult', {
    extend: 'Ext.view.View',
    xtype: 'sourth_branch_infoResult',
    alias: 'widget.sourth_branch_infoResult',
    requires : [
                'Sgis.view.south.popup.InfoResultViewModel'	
	],
    
	viewModel: 'sourth_branch_infoResult',
	
	bind: {
        data: {
        	title: '{title}'
        }
    },
    
    tpl: new Ext.Template(
    		'<div class="main_dashboard">',
            '<div class="tab_bg">',
            '<ul class="dashboard_tab_menu">',
            '<li><a href="#" class="on">ss:{title}</a></li>',
            '<li><a href="#" class="">탭2번</a></li>',
            '<li><a href="#" class="">탭3번</a></li>',
            '<li><a href="#" class="">탭4번</a></li>',
            '</div>',
            '</div>'
    )
});