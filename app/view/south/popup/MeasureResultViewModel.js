Ext.define('Sgis.view.south.popup.MeasureResultViewModel', {
    extend: 'Ext.app.ViewModel', 
    alias: 'viewmodel.sourth_branch_measureResult', 
    
    stores: {
        grid: {
        	fields: [],
        	autoLoad: false,
        	remoteFilter: false,
        	remoteSort: false,
        	proxy: {
        		type: 'memory',
        		enablePaging: true,
        		reader: {
        			type: 'json'
        		}
        	}
        }
    },
    
    fieldsStr:'',
    
    arcSearch:function(params){
    	var me = this;
    	me.makeStore(params);
    	var chartDatas = [];
    	var queryTask = new esri.tasks.QueryTask(Sgis.app.coreMap.layerInfo.layer1Url + "/" + params.layerId);
		var query = new esri.tasks.Query();
		query.returnGeometry = true;
		query.outSpatialReference = {"wkid":102100};
		query.where = "OBJECTID=" + params.record.data.OBJECTID;
		query.outFields = ['OBJECTID'];
		queryTask.execute(query,  function(results){
			me.chartSearch(params, results.features[0].geometry);
		});
		dojo.connect(queryTask, "onError", function(err) {
			SGIS.msg.alert(err);
		});
    },
    
    makeStore:function(params){
    	var me = this;
    	me.getStore('grid').fields = [];
    	var fields = Sgis.app.coreMap.getLayerChartFiledInfo()[params.layerId];
    	for(var i=0; i<fields.length; i++){
			if(i==0){
				me.fieldsStr += fields[i].fid
			}else{
				me.fieldsStr += "," + fields[i].fid 
			}
			me.getStore('grid').fields.push({name: fields[i].fid, type: 'string'})
		}
    },
    
    chartSearch:function(params, geometry){
    	var me = this;
    	var chartDatas = [];
    	var queryTask = new esri.tasks.QueryTask(Sgis.app.coreMap.layerInfo.layer1Url + "/" + params.layerId);
		var query = new esri.tasks.Query();
		query.returnGeometry = false;
		query.outSpatialReference = {"wkid":102100};
		query.geometry = geometry;
		query.outFields = [me.fieldsStr];
		queryTask.execute(query,  function(results){
			Ext.each(results.features, function(obj, index) {
				chartDatas.push(obj.attributes);
				if(results.features.length==index+1){
					me.getStore('grid').loadData(chartDatas);
				}
			});
		});
		dojo.connect(queryTask, "onError", function(err) {
			SGIS.msg.alert(err);
		});
    }
});