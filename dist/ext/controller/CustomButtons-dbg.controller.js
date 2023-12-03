sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/ListItem",
    "sap/m/ComboBox"
], function (Controller, ListItem, ComboBox) {
    "use strict";
    

    var PageController = Controller.extend("packingapp.ext.controller.ObjectPageExt", {

        onInit: function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("MyChannel", "oResetButtons", this.resetButtons, this);
            oEventBus.subscribe("MyChannel", "oSetPackToOrder", this.setPackToOrder, this);
            //oEventBus.subscribe("MyChannel", "oRefresh", this.setPackToOrder, this);
            // var self = this
            // console.log(this)
            // //console.log(self)
            // this.heartbeatTrigger = new sap.ui.core.IntervalTrigger(10000);   
            // this.heartbeatTrigger.addListener(function(){
            //     self.beat();
            // });
        },

        beat : function(){
            //var self = this;
            // var xmlPrefix = this.getView().getId()
            // console.log(xmlPrefix)
            // //console.log('1');
            // //this.extensionAPI.refresh("packingapp.packingapp::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSCM_C_PACKING_APP--BeforeFacet::ZSCM_C_PACKING_APP::OpenDeliveries::Section")
            // //console.log('2');
            // //this.extensionAPI.refresh("packingapp.packingapp::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSCM_C_PACKING_APP--BeforeFacet::ZSCM_C_PACKING_APP::OpenDeliveries::SubSection-innerGrid")
            // //console.log("3")
            // //this.extensionAPI.refresh("packingapp.packingapp::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSCM_C_PACKING_APP--BeforeFacet::ZSCM_C_PACKING_APP::OpenDeliveries::SubSection")
            // //console.log(xmlPrefix)//.refresh(xmlPrefix)
            // if (sap.ui.getCore().byId(xmlPrefix).getModel() != undefined) {
            //     console.log("here")
            //     sap.ui.getCore().byId(xmlPrefix).getModel().refresh(true);
            // }
        },

        resetButtons : function (oChannel, oEvent, oData) {
            var xmlPrefix = this.getView().getId()
            //var customer = oEvent.getSource().getParent().getParent().getBindingContext().getObject().customerObj
            //var custPI = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingCustomerInstructions;
            var objectLength = Object.keys(oData).length
            console.log(oData)
            if (xmlPrefix != undefined && (oData.customer != undefined && oData.customer != '') 
            && oData.customerPackInst != undefined && oData.customerPackInst != '' ) {
                console.log("custhere")
                if(sap.ui.getCore().byId(xmlPrefix + "--PackToCust") != undefined && sap.ui.getCore().byId(xmlPrefix + "--PackToStock") != undefined) {
                    sap.ui.getCore().byId(xmlPrefix + "--PackToCust").setType("Emphasized");
                    sap.ui.getCore().byId(xmlPrefix + "--PackToStock").setType("Ghost");
                }
            } else if (xmlPrefix != undefined) {
                console.log("stockhere")
                if(sap.ui.getCore().byId(xmlPrefix + "--PackToCust") != undefined && sap.ui.getCore().byId(xmlPrefix + "--PackToStock") != undefined) {
                    sap.ui.getCore().byId(xmlPrefix + "--PackToCust").setType("Ghost");
                    sap.ui.getCore().byId(xmlPrefix + "--PackToStock").setType("Emphasized");
                }
            }
        },

        setPackToOrder : function (oChannel, oEvent, oData) {
            var xmlPrefix = this.getView().getId()
            console.log(oData)
            sap.ui.getCore().byId(xmlPrefix + "--packInstructionID").setValue(oData.PackingInstructionsSO);
            console.log("1")
            sap.ui.getCore().byId(xmlPrefix + "--quantID").setValue(oData.PackingInstQuantSO);
            console.log("2")
            sap.ui.getCore().byId(xmlPrefix + "--packMaterialID").setValue(oData.packagingMaterialSO);
            console.log("3")
            sap.ui.getCore().byId(xmlPrefix + "--packMaterialDescID").setValue(oData.packagingMaterialDescriptionSO);
            console.log("4")
            sap.ui.getCore().byId(xmlPrefix+ "--auxMatID").setValue(oData.auxMaterialSO);
            sap.ui.getCore().byId(xmlPrefix + "--auxMatDescID").setValue(oData.auxMaterialDescSO);
            sap.ui.getCore().byId(xmlPrefix + "--piKeyID").setValue(oData.PackingInstructionsKeySO);
            sap.ui.getCore().byId(xmlPrefix + "--URLID").setValue(oData.packInstURLOpenDel);
           
        },
        

        onPress: function (oEvent) {
            // console.log(oData)
            // if (oData.test != undefined) {
            //     console.log("hiiiii")
            //     return
            // } else {
            var oButton;
            let packtocustval;
            var custbutton;
            if (oEvent != undefined) {
                oButton = oEvent.getSource().getId();
                packtocustval = "PackToCust";
                custbutton = oButton.indexOf(packtocustval);
            }
            else {
                custbutton = 1;
            }
            // if( oEvent.getSource().getId() == "__xmlview1--PackToCust") {

            if (custbutton >= 0) {
                var packInstCustomerNum1 = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingCustomerInstructions;
                console.log(packInstCustomerNum1)
                if (packInstCustomerNum1 == "" || packInstCustomerNum1 == null) {
                    sap.m.MessageBox.error("No Packaging Instructions Associated With This Customer", {
                        title: "Error",                                      // default
                        onClose: null,                                       // default
                        styleClass: "",                                      // default
                        actions: sap.m.MessageBox.Action.CLOSE,              // default
                        emphasizedAction: null,                              // default
                        initialFocus: null,                                  // default
                        textDirection: sap.ui.core.TextDirection.Inherit     // default
                    });
                } else {
                    var packInstCustomerDesc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingCustInstDesc;
                    var custQuant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstCustQuant;
                    var packagingMaterialCustr = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialCustr;
                    var packagingMaterialCustDesc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialCustDesc;
                    var auxPackMaterialCust = oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialCust;
                    var auxPackMaterialCustDesc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialCustDesc;
                    var packInstURL255Cust = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstURL255Cust;
                    //sap.ui.getCore().packURL = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstURL255;

                        var oButtonCust = sap.ui.getCore().byId(oButton);
                        const oSequence = oButton.split("--");
                        let oseqv1 = oSequence[0];
                        let length = oseqv1.length;
                        var oseqno = oseqv1.substring(9, length);
                        let var1 = "__xmlview";
                        let var2 = "--PackToStock";
                        var oButtonStockID = var1.concat(oseqno, var2);
                        var oButtonStock = sap.ui.getCore().byId(oButtonStockID);
                        oButtonCust.setType("Emphasized");
                        oButtonStock.setType("Ghost");
                
                    let tempvar = "--packInstructionID";
                    let vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(packInstCustomerNum1);
                    //if (id == undefined){
                    tempvar = '--packInstructionDescID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(packInstCustomerDesc);

                    tempvar = '--URLID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(packInstURL255Cust);
                    //}
                    // else{
                    //     tempvar = '--packInstructionDescID';
                    //     vartemp = var1.concat(oseqno, tempvar);
                    //     sap.ui.getCore().byId(vartemp).setValue(id);

                    // }
                    tempvar = '--quantID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(custQuant);
                    
                    tempvar = '--packMaterialID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(packagingMaterialCustr);

                    tempvar = '--packMaterialDescID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(packagingMaterialCustDesc);
                    
                    tempvar = '--auxMatID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(auxPackMaterialCust);

                    tempvar = '--auxMatDescID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(auxPackMaterialCustDesc);

                    // sap.ui.getCore().byId("__xmlview1--packInstructionID").setValue(packInstCustomerNum1);
                    // sap.ui.getCore().byId("__xmlview1--packInstructionDescID").setValue(packInstCustomerDesc);
                    // sap.ui.getCore().byId("__xmlview1--quantID").setValue(custQuant);
                    // sap.ui.getCore().byId("__xmlview1--packMaterialID").setValue(packagingMaterialCustr);
                    // sap.ui.getCore().byId("__xmlview1--packMaterialDescID").setValue(packagingMaterialCustDesc);
                    // sap.ui.getCore().byId("__xmlview1--auxMatID").setValue(auxPackMaterialCust);
                    // sap.ui.getCore().byId("__xmlview1--auxMatDescID").setValue(auxPackMaterialCustDesc);
                }
                // var oButtonCust = sap.ui.getCore().byId("__xmlview1--PackToCust");
                // var oButtonStock = sap.ui.getCore().byId("__xmlview1--PackToStock");
            

            }
            // else if (oEvent.getSource().getId() == "__xmlview1--PackToStock") 

            else if (oButton.indexOf("PackToStock") >= 0) {
                {
                    var packInstruMaterial1 = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstru;
                    console.log(packInstruMaterial1)
                    if (packInstruMaterial1 == "" || packInstruMaterial1 == null) {
                        sap.m.MessageBox.error("No Packaging Instructions Associated With This Material", {
                            title: "Error",                                      // default
                            onClose: null,                                       // default
                            styleClass: "",                                      // default
                            actions: sap.m.MessageBox.Action.CLOSE,              // default
                            emphasizedAction: null,                              // default
                            initialFocus: null,                                  // default
                            textDirection: sap.ui.core.TextDirection.Inherit     // default
                        });
                    } else {
                        var packInstruMaterialDesc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstDescription;
                        var packagingMaterial = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterial;
                        var packagingMaterialDescription = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialDescription;
                        var stockQuant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstQuant;
                        var auxPackMaterial = oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterial;
                        var auxPackMaterialDesc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialDesc;
                        var packInstURLS255 = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstURLS255;
                        //sap.ui.getCore().packURL = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstURLS255;


                        
                        var oButtonStock = sap.ui.getCore().byId(oButton);
                        const oSequence = oButton.split("--");
                        let oseqv1 = oSequence[0];
                        let length = oseqv1.length;
                        var oseqno = oseqv1.substring(9, length);
                        let var1 = "__xmlview";;
                        let var2 = "--PackToCust";
                        var oButtonCustID = var1.concat(oseqno, var2);
                        var oButtonCust = sap.ui.getCore().byId(oButtonCustID);
                        oButtonCust.setType("Ghost");
                        oButtonStock.setType("Emphasized");

                        
                    let tempvar = "--packInstructionID";
                    let vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(packInstruMaterial1);

                    tempvar = '--URLID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(packInstURLS255);

                    tempvar = '--packInstructionDescID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(packInstruMaterialDesc);
                    
                    tempvar = '--quantID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(stockQuant);
                    
                    tempvar = '--packMaterialID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(packagingMaterial);

                    tempvar = '--packMaterialDescID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(packagingMaterialDescription);
                    
                    tempvar = '--auxMatID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(auxPackMaterial);

                    tempvar = '--auxMatDescID';
                    vartemp = var1.concat(oseqno, tempvar);
                    sap.ui.getCore().byId(vartemp).setValue(auxPackMaterialDesc);

                        // sap.ui.getCore().byId("__xmlview1--packInstructionID").setValue(packInstruMaterial1);
                        // sap.ui.getCore().byId("__xmlview1--packInstructionDescID").setValue(packInstruMaterialDesc);
                        // sap.ui.getCore().byId("__xmlview1--quantID").setValue(stockQuant);
                        // sap.ui.getCore().byId("__xmlview1--packMaterialID").setValue(packagingMaterial);
                        // sap.ui.getCore().byId("__xmlview1--packMaterialDescID").setValue(packagingMaterialDescription);
                        // sap.ui.getCore().byId("__xmlview1--auxMatID").setValue(auxPackMaterial);
                        // sap.ui.getCore().byId("__xmlview1--auxMatDescID").setValue(auxPackMaterialDesc);
                    }


                    // var oButtonCust = sap.ui.getCore().byId("__xmlview1--PackToCust");
                    // var oButtonStock = sap.ui.getCore().byId("__xmlview1--PackToStock");
                }
            }

            else if (oButton.indexOf("AltPackInst") >= 0) {
                const oSequence = oButton.split("--");
                let oseqv1 = oSequence[0];
                console.log("here1")
                let length = oseqv1.length;
                var oseqno = oseqv1.substring(9, length);
                let var1 = "__xmlview";;
                let var2 = "--PackToCust";
                var oButtonCustID = var1.concat(oseqno, var2);
                var oButtonCust = sap.ui.getCore().byId(oButtonCustID);

                let var3 = "__xmlview";
                let var4 = "--PackToStock";
                var oButtonStockID = var1.concat(oseqno, var2);
                var oButtonStock = sap.ui.getCore().byId(oButtonStockID);

                // oButtonCust.setType("Ghost");
                // oButtonStock.setType("Emphasized");

                

                var oButtonCustType = oButtonCust.getType();
                var oButtonStockType = oButtonStock.getType();
                var URLPath
                var condRecordStock = oEvent.getSource().getParent().getParent().getBindingContext().getObject().condRecordStock;
                var condRecordCust = oEvent.getSource().getParent().getParent().getBindingContext().getObject().condRecordCust;
                var oModel = new sap.ui.model.json.JSONModel();
                var responseData
                var oSelectedItem
                console.log("here2")
                if (oButtonCustType == "Emphasized") {
                    var filtersAltPI= new Array()
                    var filterAltPI = new sap.ui.model.Filter({
                        path: "knumh",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: condRecordCust}
                    );
                    filtersAltPI.push(filterAltPI)
                    URLPath = "/ZSCM_I_PACKTOCUSTALT_L2"
                } else {
                    var filtersAltPI= new Array()
                    var filterAltPI = new sap.ui.model.Filter({
                        path: "knumh",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: condRecordStock}
                    );
                    filtersAltPI.push(filterAltPI)
                    URLPath = "/ZSCM_I_PackToStockAlt_L2"
                }

                var payload = "{\"items\":["
                var oModelAltPI = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSCM_PACKAPP_SRV");
                console.log("here3")
                oModelAltPI.read(URLPath, {
                    filters: filtersAltPI,
                    success: function(oData, oResponse) {
                        responseData = oData
                        for(let i=0; i<(oData.results.length); i++) {
                            var packInstText = oData.results[i].packInstDesc
                            var packInstCode = oData.results[i].packInst
                            payload += "{\"key\":\"" + packInstCode + "\",\"text\":\"" + packInstText + "\"}"
                            if ((i+1)<(oData.results.length)) {
                                payload += ","
                            }
                        }
                        payload += "]}"
                        var oDropDownData = JSON.parse(payload)

                        
                        oModel.setDefaultBindingMode("OneWay");
                        oModel.setData(oDropDownData);

                        var oButton1 = new sap.m.Button("OK", {
                            text: "OK"
                        });
        
                        var oButton2 = new sap.m.Button("Cancel", {
                            text: "Cancel"
                        });
        
                        var oItemTemplate = new ListItem({
                            key: "{key}",
                            text: "{text}",
                            additionalText: "{key}"
                        });
        
                        var oComboBoxTwoColumn = new ComboBox("box_two_column",{
                            showSecondaryValues: true,
                            id: "AltPackagingInstructions",
                            width: "100%",
                            items: {
                                path: "/items",
                                template: oItemTemplate
                            },
                            selectionChange: function(oControlEvent) {
                                oSelectedItem = oControlEvent.getParameter("selectedItem");
                                console.log(oSelectedItem);
                                oSelectedItem = oSelectedItem ? oSelectedItem.getKey() : oSelectedItem;
                                console.log(oSelectedItem);
                            }
                        });
        
                        oComboBoxTwoColumn.setModel(oModel);
        
                        oButton1.attachPress(function (evt) {
                            var newPackInst = oSelectedItem
        
                            for(let i=0; i<responseData.results.length; i++) {
                                if (responseData.results[i].packInst == newPackInst) {
                                    console.log(responseData.results[i].packInst)
                                    console.log(responseData.results[i].packNumKey)
                                    console.log(responseData.results[i].packInstURL255)
                                    let tempvar = "--packInstructionID";
                                    let vartemp = var1.concat(oseqno, tempvar);
                                    sap.ui.getCore().byId(vartemp).setValue(responseData.results[i].packInst);
        
                                    tempvar = "--URLID";
                                    vartemp = var1.concat(oseqno, tempvar);
                                    sap.ui.getCore().byId(vartemp).setValue(responseData.results[i].packInstURL255);
        
                                    tempvar = '--packInstructionDescID';
                                    vartemp = var1.concat(oseqno, tempvar);
                                    sap.ui.getCore().byId(vartemp).setValue(responseData.results[i].packInstDesc);
                                    
                                    tempvar = '--quantID';
                                    vartemp = var1.concat(oseqno, tempvar);
                                    sap.ui.getCore().byId(vartemp).setValue(responseData.results[i].packInstQuant);
                                    
                                    tempvar = '--packMaterialID';
                                    vartemp = var1.concat(oseqno, tempvar);
                                    sap.ui.getCore().byId(vartemp).setValue(responseData.results[i].packInstMat);
        
                                    tempvar = '--packMaterialDescID';
                                    vartemp = var1.concat(oseqno, tempvar);
                                    sap.ui.getCore().byId(vartemp).setValue(responseData.results[i].packInstMatDesc);
                                    
                                    tempvar = '--auxMatID';
                                    vartemp = var1.concat(oseqno, tempvar);
                                    sap.ui.getCore().byId(vartemp).setValue(responseData.results[i].packInstAuxMat);
        
                                    tempvar = '--auxMatDescID';
                                    vartemp = var1.concat(oseqno, tempvar);
                                    sap.ui.getCore().byId(vartemp).setValue(responseData.results[i].packInstAuxMatDesc);
        
                                    tempvar = '--piKeyID';
                                    vartemp = var1.concat(oseqno, tempvar);
                                    sap.ui.getCore().byId(vartemp).setValue(responseData.results[i].packNumKey);
        
                                    break;
                                }
                            }
                            sap.ui.getCore().byId("Dialog1").close();
                            sap.ui.getCore().byId("Dialog1").destroy();
                        });
        
                        oButton2.attachPress(function (evt) {
                            sap.ui.getCore().byId("Dialog1").close();
                            sap.ui.getCore().byId("Dialog1").destroy();
                        });
        
                        
                        var oDialog = new sap.m.Dialog("Dialog1",{
                            title:"Select Alternate Packaging Instructions",
                            contentWidth:"35%",
                            closeOnNavigation: true,
                            buttons: [oButton1, oButton2],
                            content:[
                                new sap.m.Label({text:"Alternate Packaging Instructions"}),
                                //new sap.m.ComboBox({id: "AltPackagingInstructions", width: "100%"})
                                oComboBoxTwoColumn
                            ]
                        });
                        oDialog.addStyleClass("sapUiContentPadding");
                        oDialog.open()

                    },
                    error: function(oError) {
                        console.log(oError)
                        sap.m.MessageBox.error(oError);
                    }, 
                })


            }

            else if (oButton.indexOf("refreshButton") >= 0) {
                var xmlPrefix = this.getView().getId()
                console.log("refresh")
                if (sap.ui.getCore().byId(xmlPrefix).getModel() != undefined) {
                    console.log("here")
                    sap.ui.getCore().byId(xmlPrefix).getModel().refresh(true);
                }
            }

        },
        
    });

    return PageController;

});


// sap.ui.getCore().byId("backBtn").attachPress(function() {
//     sap.ui.getCore().byId("__xmlview1--PackToCust").setType("Ghost");
//     sap.ui.getCore().byId("__xmlview1--PackToStock").setType("Emphasized");
// })


// function getPackInstDetails(packInst, newPackInst) {
//     return packInst == newPackInst;
// }

// sap.ui.getCore().byId("backBtn").attachPress(function() {
//     console.log("BACK")
//     sap.ui.getCore().byId("__xmlview1--PackToCust").setType("Ghost");
//     sap.ui.getCore().byId("__xmlview1--PackToStock").setType("Emphasized");
// })