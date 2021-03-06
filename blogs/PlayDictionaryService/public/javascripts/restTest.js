Ext.onReady(function(){
	var servletUrl = '';
	
	var app = new Ext.Viewport({
	    layout: 'border',
	    autoScroll: true,
	    items: [{
	        region: 'north',
	        height: 100,
	        margins: '5',
	        padding: '5',
	        items: [{
		  xtype: 'displayfield',
		  html: '<img src="images/OrangeMan_Logo_Small.jpg" width="80" height="80" />',
		  style: {
		    float: 'left'
		  }
		},{
	        	xtype: 'displayfield',
	        	style: {
	        		fontWeight: 'bold',
	        		fontSize: '24pt',
				color: '#000000'
	        	},
	        	value: 'BTI\'s REST Test'
	        }]
	    },{
	    	xtype: 'form',
	        region: 'center',
	        autoScroll: true,
	        margins: '5',
	        padding: '5',
	        labelWidth: 150,
	        defaults: {
	    		width: 500
	    	},
	        items: [{
	        	layout: 'column',
	        	border: false,
	        	autoWidth: true,
	        	defaults: {
	        		border: false
	        	},
	        	items: [{
	        		layout: 'form',
	        		items: [{
	    	        	xtype: 'textfield',
	    	        	width: 500,
	    	        	name: 'uri',
	    	        	fieldLabel: 'Resource URI'
	    	        }]
	        	},{
	        		layout: 'form',
	        		items: [{
	    	        	xtype: 'button',
	    	        	text: 'GO',
	    	        	width: 75,
	    	        	handler: function() {    	   
	    	        		var form = app.findByType('form')[0];
	    	        		var url = form.getForm().findField('uri').getValue();
	    	        		if(url == null || url == '') {
	    	        			Ext.MessageBox.alert('Error', 'The URI field must be populated.');
	    	        			return;
	    	        		}
	        			var mask = new Ext.LoadMask(app.getEl(), {msg: 'Loading...', removeMask: true});
	        			mask.show();
	    	        		form.getForm().findField('status').reset();
	    				form.getForm().findField('headers').reset();
	    				form.getForm().findField('rawview').reset();
	    	        		var method = form.getForm().findField('method').getValue();
	    	        		var mimetype = form.getForm().findField('mimetype').getValue();
	    	        		var content = form.getForm().findField('content').getValue();
	    	        		var params = {
	    	        			url: servletUrl + url,
		    	        		headers: {
		    	        			'Accept': mimetype,
		    	        			'Content-Type': mimetype
		    	        		},
		    	        		method: method,
		    	        		callback: function(opts, success, response) {
		    	        			mask.hide();
		            				form.getForm().findField('status').setValue(response.status + ' ' + response.statusText);
		            				form.getForm().findField('headers').setValue(response.getAllResponseHeaders());
		    	        			form.getForm().findField('rawview').setValue(response.responseText);
		    	        		}	
	    	        		};
	    	        		if(method == 'POST' || method == 'PUT') {
	    	        			if(mimetype == 'application/json') {
	    	        				params['jsonData'] = content;
	    	        			} else if (mimetype == 'application/xml') {
	    	        				params['xmlData'] = content;
	    	        			}
	        				}
	    	        		Ext.Ajax.request(params);
	    	        	}
	    	        }]
	        	}]
	        },{
	        	xtype: 'combo',
	        	name: 'method',
	        	mode: 'local',
	        	triggerAction: 'all',
	        	fieldLabel: 'Choose Method To test',
	        	displayField: 'name',
	        	value: 'GET',
	        	listeners: {
	        		'select' : function(combo, record, index){
	        			var content = combo.findParentByType('form').getForm().findField('content');
	        			if(record.data.name == 'GET' || record.data.name == 'DELETE') {
	        				content.disable();
	        			} else {
	        				content.enable();
	        			}
	        		}
	        	},
	        	store: new Ext.data.ArrayStore({
	        	    autoDestroy: true,
	        	    fields: [
	        	       'name'
	        	    ],
	        	    data: [['GET'], ['POST'], ['PUT'], ['DELETE']]
	        	})
	        },{
	        	xtype: 'combo',
	        	mode: 'local',
	        	name: 'mimetype',
	        	triggerAction: 'all',
	        	fieldLabel: 'Choose Mime Type',
	        	displayField: 'name',
	        	value: 'application/json',
	        	store: new Ext.data.ArrayStore({
	        	    autoDestroy: true,
	        	    fields: [
	        	       'name'
	        	    ],
	        	    data: [['application/json'], ['application/xml']]
	        	})
	        },{
	        	xtype: 'textarea',
	        	name: 'content',
	        	fieldLabel: 'Content',
	        	disabled: true
	        },{
	        	xtype: 'displayfield',
	        	name: 'status',
	        	fieldLabel: 'Status'
	        },{
	        	xtype: 'tabpanel',
	        	width: 500,
	        	fieldLabel: 'Response',
	        	activeItem: 0,
	        	height: 200,
	        	items: [{
	        		xtype: 'textarea',
	        		name: 'rawview',
	        		title: 'Raw View'
	        	},{
	        		xtype: 'textarea',
	        		name: 'headers',
	        		title: 'Headers'
	        	}],
	        	bbar: [{
	        		text: 'View Response as HTML',
	        		handler: function() {
	        			var content = app.findByType('form')[0].getForm().findField('rawview').getValue();
	        			var win = new Ext.Window({
	        				title: 'Http Response',
	        				width: 400,
	        				height: 300,
	        				autoScroll: true,
	        				closable: true,
	        				plain: true,
	        				html: content
	        			});
	        			win.show();
	        		}
	        	}]
	        }]
	    }]
	});
});
