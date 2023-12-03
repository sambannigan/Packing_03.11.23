sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/ListItem","sap/m/ComboBox"],function(e,t,a){"use strict";var s=e.extend("packingapp.ext.controller.ObjectPageExt",{onInit:function(){var e=sap.ui.getCore().getEventBus();e.subscribe("MyChannel","oResetButtons",this.resetButtons,this);e.subscribe("MyChannel","oSetPackToOrder",this.setPackToOrder,this)},beat:function(){},resetButtons:function(e,t,a){var s=this.getView().getId();var n=Object.keys(a).length;console.log(a);if(s!=undefined&&(a.customer!=undefined&&a.customer!="")&&a.customerPackInst!=undefined&&a.customerPackInst!=""){console.log("custhere");if(sap.ui.getCore().byId(s+"--PackToCust")!=undefined&&sap.ui.getCore().byId(s+"--PackToStock")!=undefined){sap.ui.getCore().byId(s+"--PackToCust").setType("Emphasized");sap.ui.getCore().byId(s+"--PackToStock").setType("Ghost")}}else if(s!=undefined){console.log("stockhere");if(sap.ui.getCore().byId(s+"--PackToCust")!=undefined&&sap.ui.getCore().byId(s+"--PackToStock")!=undefined){sap.ui.getCore().byId(s+"--PackToCust").setType("Ghost");sap.ui.getCore().byId(s+"--PackToStock").setType("Emphasized")}}},setPackToOrder:function(e,t,a){var s=this.getView().getId();console.log(a);sap.ui.getCore().byId(s+"--packInstructionID").setValue(a.PackingInstructionsSO);console.log("1");sap.ui.getCore().byId(s+"--quantID").setValue(a.PackingInstQuantSO);console.log("2");sap.ui.getCore().byId(s+"--packMaterialID").setValue(a.packagingMaterialSO);console.log("3");sap.ui.getCore().byId(s+"--packMaterialDescID").setValue(a.packagingMaterialDescriptionSO);console.log("4");sap.ui.getCore().byId(s+"--auxMatID").setValue(a.auxMaterialSO);sap.ui.getCore().byId(s+"--auxMatDescID").setValue(a.auxMaterialDescSO);sap.ui.getCore().byId(s+"--piKeyID").setValue(a.PackingInstructionsKeySO);sap.ui.getCore().byId(s+"--URLID").setValue(a.packInstURLOpenDel)},onPress:function(e){var s;let n;var o;if(e!=undefined){s=e.getSource().getId();n="PackToCust";o=s.indexOf(n)}else{o=1}if(o>=0){var r=e.getSource().getParent().getParent().getBindingContext().getObject().PackingCustomerInstructions;console.log(r);if(r==""||r==null){sap.m.MessageBox.error("No Packaging Instructions Associated With This Customer",{title:"Error",onClose:null,styleClass:"",actions:sap.m.MessageBox.Action.CLOSE,emphasizedAction:null,initialFocus:null,textDirection:sap.ui.core.TextDirection.Inherit})}else{var c=e.getSource().getParent().getParent().getBindingContext().getObject().PackingCustInstDesc;var i=e.getSource().getParent().getParent().getBindingContext().getObject().PackingInstCustQuant;var u=e.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialCustr;var g=e.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialCustDesc;var l=e.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialCust;var p=e.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialCustDesc;var d=e.getSource().getParent().getParent().getBindingContext().getObject().packInstURL255Cust;var I=sap.ui.getCore().byId(s);const t=s.split("--");let a=t[0];let n=a.length;var C=a.substring(9,n);let o="__xmlview";let y="--PackToStock";var k=o.concat(C,y);var b=sap.ui.getCore().byId(k);I.setType("Emphasized");b.setType("Ghost");let P="--packInstructionID";let v=o.concat(C,P);sap.ui.getCore().byId(v).setValue(r);P="--packInstructionDescID";v=o.concat(C,P);sap.ui.getCore().byId(v).setValue(c);P="--URLID";v=o.concat(C,P);sap.ui.getCore().byId(v).setValue(d);P="--quantID";v=o.concat(C,P);sap.ui.getCore().byId(v).setValue(i);P="--packMaterialID";v=o.concat(C,P);sap.ui.getCore().byId(v).setValue(u);P="--packMaterialDescID";v=o.concat(C,P);sap.ui.getCore().byId(v).setValue(g);P="--auxMatID";v=o.concat(C,P);sap.ui.getCore().byId(v).setValue(l);P="--auxMatDescID";v=o.concat(C,P);sap.ui.getCore().byId(v).setValue(p)}}else if(s.indexOf("PackToStock")>=0){{var y=e.getSource().getParent().getParent().getBindingContext().getObject().packInstru;console.log(y);if(y==""||y==null){sap.m.MessageBox.error("No Packaging Instructions Associated With This Material",{title:"Error",onClose:null,styleClass:"",actions:sap.m.MessageBox.Action.CLOSE,emphasizedAction:null,initialFocus:null,textDirection:sap.ui.core.TextDirection.Inherit})}else{var P=e.getSource().getParent().getParent().getBindingContext().getObject().packInstDescription;var v=e.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterial;var D=e.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialDescription;var x=e.getSource().getParent().getParent().getBindingContext().getObject().PackingInstQuant;var h=e.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterial;var M=e.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialDesc;var S=e.getSource().getParent().getParent().getBindingContext().getObject().packInstURLS255;var b=sap.ui.getCore().byId(s);const t=s.split("--");let a=t[0];let n=a.length;var C=a.substring(9,n);let o="__xmlview";let r="--PackToCust";var f=o.concat(C,r);var I=sap.ui.getCore().byId(f);I.setType("Ghost");b.setType("Emphasized");let c="--packInstructionID";let i=o.concat(C,c);sap.ui.getCore().byId(i).setValue(y);c="--URLID";i=o.concat(C,c);sap.ui.getCore().byId(i).setValue(S);c="--packInstructionDescID";i=o.concat(C,c);sap.ui.getCore().byId(i).setValue(P);c="--quantID";i=o.concat(C,c);sap.ui.getCore().byId(i).setValue(x);c="--packMaterialID";i=o.concat(C,c);sap.ui.getCore().byId(i).setValue(v);c="--packMaterialDescID";i=o.concat(C,c);sap.ui.getCore().byId(i).setValue(D);c="--auxMatID";i=o.concat(C,c);sap.ui.getCore().byId(i).setValue(h);c="--auxMatDescID";i=o.concat(C,c);sap.ui.getCore().byId(i).setValue(M)}}}else if(s.indexOf("AltPackInst")>=0){const n=s.split("--");let o=n[0];console.log("here1");let r=o.length;var C=o.substring(9,r);let c="__xmlview";let i="--PackToCust";var f=c.concat(C,i);var I=sap.ui.getCore().byId(f);let u="__xmlview";let g="--PackToStock";var k=c.concat(C,i);var b=sap.ui.getCore().byId(k);var m=I.getType();var O=b.getType();var V;var T=e.getSource().getParent().getParent().getBindingContext().getObject().condRecordStock;var B=e.getSource().getParent().getParent().getBindingContext().getObject().condRecordCust;var w=new sap.ui.model.json.JSONModel;var j;var A;console.log("here2");if(m=="Emphasized"){var _=new Array;var L=new sap.ui.model.Filter({path:"knumh",operator:sap.ui.model.FilterOperator.EQ,value1:B});_.push(L);V="/ZSCM_I_PACKTOCUSTALT_L2"}else{var _=new Array;var L=new sap.ui.model.Filter({path:"knumh",operator:sap.ui.model.FilterOperator.EQ,value1:T});_.push(L);V="/ZSCM_I_PackToStockAlt_L2"}var E='{"items":[';var R=new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSCM_PACKAPP_SRV");console.log("here3");R.read(V,{filters:_,success:function(e,s){j=e;for(let t=0;t<e.results.length;t++){var n=e.results[t].packInstDesc;var o=e.results[t].packInst;E+='{"key":"'+o+'","text":"'+n+'"}';if(t+1<e.results.length){E+=","}}E+="]}";var r=JSON.parse(E);w.setDefaultBindingMode("OneWay");w.setData(r);var i=new sap.m.Button("OK",{text:"OK"});var u=new sap.m.Button("Cancel",{text:"Cancel"});var g=new t({key:"{key}",text:"{text}",additionalText:"{key}"});var l=new a("box_two_column",{showSecondaryValues:true,id:"AltPackagingInstructions",width:"100%",items:{path:"/items",template:g},selectionChange:function(e){A=e.getParameter("selectedItem");console.log(A);A=A?A.getKey():A;console.log(A)}});l.setModel(w);i.attachPress(function(e){var t=A;for(let e=0;e<j.results.length;e++){if(j.results[e].packInst==t){console.log(j.results[e].packInst);console.log(j.results[e].packNumKey);console.log(j.results[e].packInstURL255);let t="--packInstructionID";let a=c.concat(C,t);sap.ui.getCore().byId(a).setValue(j.results[e].packInst);t="--URLID";a=c.concat(C,t);sap.ui.getCore().byId(a).setValue(j.results[e].packInstURL255);t="--packInstructionDescID";a=c.concat(C,t);sap.ui.getCore().byId(a).setValue(j.results[e].packInstDesc);t="--quantID";a=c.concat(C,t);sap.ui.getCore().byId(a).setValue(j.results[e].packInstQuant);t="--packMaterialID";a=c.concat(C,t);sap.ui.getCore().byId(a).setValue(j.results[e].packInstMat);t="--packMaterialDescID";a=c.concat(C,t);sap.ui.getCore().byId(a).setValue(j.results[e].packInstMatDesc);t="--auxMatID";a=c.concat(C,t);sap.ui.getCore().byId(a).setValue(j.results[e].packInstAuxMat);t="--auxMatDescID";a=c.concat(C,t);sap.ui.getCore().byId(a).setValue(j.results[e].packInstAuxMatDesc);t="--piKeyID";a=c.concat(C,t);sap.ui.getCore().byId(a).setValue(j.results[e].packNumKey);break}}sap.ui.getCore().byId("Dialog1").close();sap.ui.getCore().byId("Dialog1").destroy()});u.attachPress(function(e){sap.ui.getCore().byId("Dialog1").close();sap.ui.getCore().byId("Dialog1").destroy()});var p=new sap.m.Dialog("Dialog1",{title:"Select Alternate Packaging Instructions",contentWidth:"35%",closeOnNavigation:true,buttons:[i,u],content:[new sap.m.Label({text:"Alternate Packaging Instructions"}),l]});p.addStyleClass("sapUiContentPadding");p.open()},error:function(e){console.log(e);sap.m.MessageBox.error(e)}})}else if(s.indexOf("refreshButton")>=0){var U=this.getView().getId();console.log("refresh");if(sap.ui.getCore().byId(U).getModel()!=undefined){console.log("here");sap.ui.getCore().byId(U).getModel().refresh(true)}}}});return s});
//# sourceMappingURL=CustomButtons.controller.js.map