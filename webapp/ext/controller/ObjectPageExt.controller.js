sap.ui.define([
    "sap/m/MessageToast",
    'sap/ui/comp/library',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/SearchField',
	'sap/m/Token',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/table/Column',
	'sap/m/Column',
	'sap/m/Text'
], function(MessageToast, compLibrary, Controller, TypeString, ColumnListItem, Label, SearchField, Token, Filter, FilterOperator, ODataModel, UIColumn, MColumn, Text) {
    'use strict';
    
    return {

        onInit: function () {

            //initiate model for container value help 
            var oJson = new sap.ui.model.json.JSONModel({
                "items": []
            });
    
            var oitems = [];
            var oItem = {
                "materialText": "",
                "serialNumber": "",
                "materialNumber": "",
                "dayOwned": "",
                "lastRecievedDate": "",
                "userStatustext": ""
            };

            oitems.push(JSON.parse(JSON.stringify(oItem)));
    
            this.getOwnerComponent().setModel(oJson, "item");
            this.getOwnerComponent().getModel("item").setProperty("/items", oitems);

            //initiate model for operation value help
            var oJson1 = new sap.ui.model.json.JSONModel({
                "items1": []
            });
    
            var oitems1 = [];
            var oItem1 = {
                "operation": "",
                "operationtext": ""
            };

            oitems1.push(JSON.parse(JSON.stringify(oItem1)));
    
            this.getOwnerComponent().setModel(oJson1, "item1");
            this.getOwnerComponent().getModel("item1").setProperty("/items1", oitems1);
            var packURL = sap.ui.getCore().packURL;

        },

        CreateG: function (oEvent) {
            //get value delected by user
            var manOrder = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            manOrder = manOrder.substr(manOrder.length - 12);
            var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");

            // trigger navigation to goods reciept app
            var hash = oCrossAppNav.hrefForExternal({
                target: { semanticObject: "HandlingUnit", action: "enterGoodsReceiptForProductionOrder" },
                params: { "CAUFVD-AUFNR": manOrder }
            });

            var url = window.location.href.split('#')[0] + hash;

            sap.m.URLHelper.redirect(url, true);  
        },

        createHU: function(oEvent) {
            //Open busy dialog
            var busy = new sap.m.BusyDialog();
            //busy.open();
            const Event = oEvent;
            console.log(oEvent)
            console.log(sap.ui.getCore().byId("packingapp.packingapp::sap.suite.ui.generic.template.ObjectPage.view.Details::ZSCM_C_PACKING_APP--action::createHUButton").getMetadata())
            //Get Values Selected by User
            var salesOrderType = oEvent.getSource().getParent().getParent().getBindingContext().getObject().salesOrderType;
            var salesOrder = oEvent.getSource().getParent().getParent().getBindingContext().getObject().salesOrder;
            var customer = oEvent.getSource().getParent().getParent().getBindingContext().getObject().customer;
            var packCustomerType = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packCustomerType;
            var packStockType = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packStockType;
            var packInst = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstObj;
            var packMaterialCust = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialCustr;
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().plant;
            var batch = oEvent.getSource().getParent().getParent().getBindingContext().getObject().batch;
            var StorLoc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().StorLoc;
            var cancel = 0;
            var oObjectevent = oEvent.getSource().getParent().getParent().getBindingContext().getObject();
            var packInstructionsKey
            var oData = oEvent
            var packMaterial = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialObj;           
            var packInstQuant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstQuantObj;

            //determine selected packaging instructions
            if (packInst == oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstru) {
                packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstructionsKey;
            } else if(packInst == oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingCustomerInstructions) {
                packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstructionsCustKey;
            } else {
                packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().altPIKey; 
            }
             
            
            //add leading zeroes
            var product = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().product;
            product = product.substr(product.length-18);
            var auxMat = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialObj;
            auxMat = auxMat.substr(auxMat.length-18);
            var manOrder = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            var carrier = oEvent.getSource().getParent().getParent().getBindingContext().getObject().carrier;
            manOrder = manOrder.substr(manOrder.length-12);
            var matType;

            //determine selected packaging material
            if (packMaterialCust == oObjectevent.packagingMaterialObj)             
            {
                matType = packCustomerType
            } 
            else if (packMaterial == oObjectevent.packagingMaterialObj) 
            {
                matType = packStockType
            }

            //add leading zeroes
            packMaterial =  "000000000000000000" + packMaterial;
            packMaterial = packMaterial.substr(packMaterial.length-18);
            var storeThis = this;

            //If packaging material is a container
            // if (matType == '0004' || matType == '0005') { New changes
            if (matType == '0004') {
                //Check RFP validation field and carrier
                var event = oEvent
                //get sales order on sales order and ZZ1_RFPRequired_SDH eq true"
                var oModelSO = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/API_SALES_ORDER_SRV");
                var filtersRFPCheck = new Array()
                var filterRFPCheck = new sap.ui.model.Filter({
                    path: "SalesOrder",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: salesOrder}
                );
                filtersRFPCheck.push(filterRFPCheck)
                var filterRFPCheck = new sap.ui.model.Filter(
                    {path: "ZZ1_RFPRequired_SDH",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: true}
                );
                filtersRFPCheck.push(filterRFPCheck)

                oModelSO.read("/A_SalesOrder", {
                    filters: filtersRFPCheck,
                    success: function(oData, oResponse) {
                        console.log(oData.results)
                        var RFPvalidation= 0
                        var RFPStat = ''
                                                    
                        if ((oData.results.length) > 0) {
                            if (oData.results[0].ZZ1_RFPStatus_SDH != undefined) {
                                if ((oData.results[0].ZZ1_RFPStatus_SDH) == 103 || (oData.results[0].ZZ1_RFPStatus_SDH) == 104) {
                                    RFPvalidation = 1 
                                } else {
                                    sap.m.MessageBox.error('RFP status is not Initial or Final, HU creation is not possible');
                                    busy.close();
                                }
                            }
                            else {
                                sap.m.MessageBox.error('RFP status is not Initial or Final, HU creation is not possible');
                                busy.close();
                            }
                        } 
                        else {
                            RFPvalidation = 1  
                        }

                        var payload = "{\"items\":["
                        //if passed RFP validation and there is a carrier build up container VH with reference to carrier
                        if (RFPvalidation == 1 && carrier != null && carrier != "" && carrier != 0 ) {
                            var oObjecty = this.getView().getParent().getBindingContext().getObject();
                            var stat6 = oObjecty.stat6;
                            var stat7 = oObjecty.stat7;
                            var stat8 = oObjecty.stat8;
                            var stat9 = oObjecty.stat9;
                            var serialNumberList = []
                            var carrierPayload = "\'and manufacturer eq \'" + carrier + "\'"
                            var oModelAltCarr = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSCM_PACKAPP_SRV");
                            var filtersAltCarrier= new Array()
                            var filterAltCarrier = new sap.ui.model.Filter({
                                path: "carrier",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: carrier}
                            );
                            filtersAltCarrier.push(filterAltCarrier)

                            oModelAltCarr.read("/ZSCM_I_AltCarriers", {
                                filters: filtersAltCarrier,
                                success: function(oData, oResponse) {  
                                    var multipleFilters = new Array()
                                    var ManuFilter = new Array()
                                    var filterMultCarr = new sap.ui.model.Filter(
                                        {path: "manufacturer",
                                        operator: sap.ui.model.FilterOperator.EQ,
                                        value1: carrier},
                                    );
                                    multipleFilters.push(filterMultCarr)
                                    if (oData.results.length > 0) {
                                        for (let i=0; i<(oData.results.length); i++) {
                                            var filterMultCarr = new sap.ui.model.Filter(
                                                {path: "manufacturer",
                                                operator: sap.ui.model.FilterOperator.EQ,
                                                value1: oData.results[i].idnumber},
                                            );
                                            multipleFilters.push(filterMultCarr)   
                                        }
                                    }
                                    var ManuFilter = new sap.ui.model.Filter(multipleFilters, false)
                                    var oModelCarrCont = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSCM_CONTAINER_EMPTY_SRV");
                                    var filtersCarrCont= new Array()
                                    var filterCarrCont = new sap.ui.model.Filter({
                                        path: "materialNumber",
                                        operator: sap.ui.model.FilterOperator.EQ,
                                        value1: packMaterial}
                                    );
                                    filtersCarrCont.push(filterCarrCont)
                                    var filterCarrCont = new sap.ui.model.Filter(
                                        {path: "plant",
                                        operator: sap.ui.model.FilterOperator.EQ,
                                        value1: plant}
                                    );
                                    filtersCarrCont.push(filterCarrCont)
                                    var filterCarrCont = new sap.ui.model.Filter(
                                        {path: "manufacturer",
                                        operator: sap.ui.model.FilterOperator.EQ,
                                        value1: carrier},
                                    );
                                    filtersCarrCont.push(ManuFilter)
                                    oModelCarrCont.read("/ZSCM_CONTAINER_L4", {
                                        filters: filtersCarrCont,
                                        urlParameters:{
                                            "$top":"2000"
                                        },
                                        success: function(oData, oResponse) {  
                                            console.log("I am here")
                                            console.log(oData.results.length)
                                            for(let i=0; i<(oData.results.length); i++) {
                                                var serial = oData.results[i].serialNumber;
                                                if (serialNumberList.includes(serial) == false) {
                                                    serialNumberList.push(serial)
                                                }
                                                // removing array elements when not required
                                                else {
                                                    if ((serial == oData.results[i].serialNumber && oData.results[i].checkstatus == 'Y')) {
                                                        oData.results.splice( i, 1);
                                                        i -=1;
                                                    }
                                                    else if ((serial == oData.results[i-1].serialNumber && oData.results[i-1].checkstatus == 'Y')) {
                                                        oData.results.splice( i-1, 1); 
                                                        if( i > 1)  {
                                                            i -=2;        
                                                        } else if( i == 1) {
                                                            i = 0;
                                                        }
                                                    } 
                                                    else if (i+1 < oData.results.length ) {
                                                        if ((serial == oData.results[i+1].serialNumber && oData.results[i+1].checkstatus == 'Y')) {
                                                            oData.results.splice( i+1, 1);
                                                        }
                                                    }
                                                }
                                            }
                                            //   Process the order for specific statuses 
                                            // for(let i=0; i<serialNumberList.length; i++) {
                                            // var validate =  serialNumberList[i]
                                            // for (let j=0; j<(oData.results.length); j++) {
                                            //     if ((serial == oData.results[j].serialNumber && oData.results[j].userStatustext != undefined))
                                            //     {
                                            //         if ( oData.results[j].status == 'E0003' || oData.results[j].status == 'E0006'  )
                                            //         {
                                            //             // remove the item from results table

                                            //         }

                                            //     }
                                            // }
                                            // }    

                                            var count = 0
                                            console.log(serialNumberList.length)
                                            for(let i=0; i<serialNumberList.length; i++) {
                                                var addToList = 0
                                                var statComp = 0
                                                var unuFlag = 0
                                                var gpFlag = 0
                                                var materialText = oData.results[i].materialText
                                                var serialNumber = oData.results[i].serialNumber
                                                var materialNumber = oData.results[i].materialNumber
                                                var dayOwned = oData.results[i].dayOwned
                                                //const timestamp = 1616608200000; // example timestamp
                                                var date = new Date(oData.results[i].lastRecievedDate);
                                                var options = { year: 'numeric', month: 'long', day: 'numeric' };
                                                var formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
                                                console.log(formattedDate); // prints "March 24, 2021"
                                                var lastRecievedDate = formattedDate //oData.results[i].lastRecievedDate
                                                var userStatustext = oData.results[i].userStatustext
                                                var totalUserStat = ""
                                                //check status of container matches customer status
                                                if (stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                    statComp += 1
                                                } else if (stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                    statComp += 1
                                                } else if (stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                    statComp += 1
                                                } else if (stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                    statComp += 1
                                                }
                                                // Addition as nodevalue remains empty if (userStatustext.nodeValue != undefined) {
                                                if (userStatustext != undefined) {
                                                    if (userStatustext.nodeValue != undefined) {
                                                        userStatustext = userStatustext.nodeValue
                                                    }
                                                } else {
                                                    userStatustext = ""
                                                }

                                                serial = serialNumberList[i]
                                                for(let j=0; j<(oData.results.length); j++){
                                                    if ((serial == oData.results[j].serialNumber && oData.results[j].userStatustext != undefined)) {
                                                        totalUserStat += oData.results[j].userStatustext + " " 
                                                        // totalUserStat += oData.results[j].userStatustext + " " Incorrect array index addressing
                                                    }
                                                }
                                                for (let j=0; j<4; j++) {
                                                    for(let k=0; k<(oData.results.length); k++){
                                                        if (serial == oData.results[k].serialNumber) {
                                                            var userStat = oData.results[k].userStatCode
                                                            console.log("userStat:" + userStat)
                                                            console.log("serial:" + serial)
                                                            if (userStat != undefined) {
                                                                if (userStat.nodeValue != undefined) {
                                                                    userStat = userStat.nodeValue
                                                                }
                                                            } else {
                                                                userStat = ''
                                                            }
                                                            if(userStat == 'UNU') {
                                                                unuFlag = 1
                                                            }
                                                            console.log("herreee:")
                                                            console.log(userStat)
                                                            // if (stat6 == 'GP' || stat7 == 'GP' || stat8 == 'GP' || stat9 == 'GP') {
                                                            //     if (userStat != '' && userStat != 'GP' && userStat != undefined && userStat != 'FUM') {
                                                            //         gpFlag = 1
                                                            //     }
                                                            // }

                                                            //check status of container matches customer statu DPI
                                                            if(userStat == 'DPI') {
                                                                if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                                    if (stat6 == userStat || stat6 == 'FQ') {
                                                                        addToList += 1
                                                                    }
                                                                } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                                    if (stat7 == userStat || stat7 == 'FQ') {
                                                                        addToList += 1
                                                                    }
                                                                } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                                    if (stat8 == userStat || stat8 == 'FQ') {
                                                                        addToList += 1
                                                                    }
                                                                } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                                    if (stat9 == userStat || stat9 == 'FQ') {
                                                                        addToList += 1
                                                                    }
                                                                }
                                                            } else if (userStat == 'FQ') {
                                                                if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                                    if (stat6 == userStat) {
                                                                        addToList += 1
                                                                    }
                                                                } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                                    if (stat7 == userStat) {
                                                                        addToList += 1
                                                                    }
                                                                } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                                    if (stat8 == userStat) {
                                                                        addToList += 1
                                                                    }
                                                                } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                                    console.log(stat9)
                                                                    if (stat9 == userStat) {
                                                                        addToList += 1
                                                                    }
                                                                }
                                                            } else if (userStat == 'GP') {
                                                                if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                                    if (stat6 == userStat) {
                                                                        addToList += 1
                                                                    }
                                                                } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                                    if (stat7 == userStat) {
                                                                        addToList += 1
                                                                    }
                                                                } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                                    if (stat8 == userStat || stat8 == 'FUM') {
                                                                        addToList += 1
                                                                    }
                                                                } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                                    console.log(stat9)
                                                                    if (stat9 == userStat || stat9 == 'FUM') {
                                                                        addToList += 1
                                                                    }
                                                                }
                                                            } else if (userStat == 'FUM') {
                                                                if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                                    if (stat6 == 'GP') {
                                                                        addToList += 1
                                                                    }
                                                                } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                                    if (stat7 == 'GP') {
                                                                        addToList += 1
                                                                    }
                                                                } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                                    if (stat8 == 'GP') {
                                                                        addToList += 1
                                                                    }
                                                                } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                                    console.log(stat9)
                                                                    if (stat9 == 'GP') {
                                                                        addToList += 1
                                                                    }
                                                                }
                                                            }
                                                            //}
                                                            // } else if (userStat == '') {
                                                            //     if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                            //         if ((stat6 == userStat || userStat == '') && statComp == 0) {
                                                            //             addToList += 1
                                                            //         }
                                                            //     } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                            //         if ((stat7 == userStat || userStat == '') && statComp == 0) {
                                                            //             addToList += 1
                                                            //         }
                                                            //     } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                            //         if ((stat8 == userStat || userStat == '') && statComp == 0) {
                                                            //             addToList += 1
                                                            //         }
                                                            //     } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                            //         console.log(stat9)
                                                            //         if ((stat9 == userStat || userStat == '') && statComp == 0) {
                                                            //             addToList += 1
                                                            //         }
                                                            //     }
                                                            // }
                                                        // } else if (statComp == 0) {
                                                        //     addToList = 1
                                                        // }
                                                        }
                                                        
                                                    }
                                                }
                                                if (stat6 == '' && stat7 == '' && stat8 == '' && stat9 == '') {
                                                    addToList = 1
                                                    statComp = 1
                                                }
                                                console.log("addToList:" + addToList)
                                                console.log("gpFlag" + gpFlag)
                                                if (addToList > 0 && unuFlag != 1) {
                                                    if (count >= 1 ) {
                                                        payload += ","
                                                    }
                                                    payload += "{\"materialText\":\"" + materialText + "\",\"serialNumber\":\"" + serial + "\",\"materialNumber\":\"" + materialNumber + 
                                                    "\",\"dayOwned\":\"" + dayOwned + "\",\"lastRecievedDate\":\"" + lastRecievedDate + "\",\"userStatustext\":\"" + 
                                                    totalUserStat + "\"}"
                                                    count += 1
                                                    console.log(payload)
                                                }
                                            }
                                            payload += "]}"
                                            if ( RFPvalidation == 1 && payload.length > 10 ) { 
                                                console.log("here")
                                                //var oModelDialog = new sap.ui.model.json.JSONModel();
                                                //oModelDialog.setData(oDialogData);
                                        
                                                // create the data to be shown in the table
                                                var oVHData = JSON.parse(payload)
                                                console.log(oVHData)

                                                // create the model to hold the data
                                                var oModel1 = new sap.ui.model.json.JSONModel();
                                                oModel1.setDefaultBindingMode("OneWay");
                                                oModel1.setData(oVHData);
                                        
                                                // create the template for the items binding
                                                console.log(storeThis.getOwnerComponent().getModel("item"))
                                                storeThis.getOwnerComponent().getModel("item").setData(oVHData)
                                                console.log(storeThis.getOwnerComponent().getModel("item"))
                                                storeThis._DialogGenerate = sap.ui.xmlfragment("packingapp.packingapp.ext.fragment.CreateHUDialog", storeThis);
                                                storeThis.getView().addDependent(storeThis._DialogGenerate);
                                                storeThis._DialogGenerate.open();
                                                
                                            }
                                        }, 
                                        error: function(oError){
                                            console.log(oError)
                                        }
                                    })
                                }
                            })

                        //if RFP validation passed and no carrier on order, build up container VH without the filter on carrier
                        } else if ( RFPvalidation == 1 && (carrier == 0 || carrier == "" || carrier == null) ) {
                            var oObjecty = this.getView().getParent().getBindingContext().getObject();
                            var stat6 = oObjecty.stat6;
                            var stat7 = oObjecty.stat7;
                            var stat8 = oObjecty.stat8;
                            var stat9 = oObjecty.stat9;
                            var serialNumberList = []
                            var oModelNoCarrCont = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSCM_CONTAINER_EMPTY_SRV");
                            var filtersNoCarrCont= new Array()
                            var filterNoCarrCont = new sap.ui.model.Filter({
                                path: "materialNumber",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: packMaterial}
                            );
                            filtersNoCarrCont.push(filterNoCarrCont)
                            var filterNoCarrCont = new sap.ui.model.Filter(
                                {path: "plant",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: plant}
                            );
                            filtersNoCarrCont.push(filterNoCarrCont)

                            oModelNoCarrCont.read("/ZSCM_CONTAINER_L4", {
                                filters: filtersNoCarrCont,
                                urlParameters:{
                                    "$top":"2000"
                                },
                                success: function(oData, oResponse) {
                                    var serialNumberList = []
                                    console.log("hereee")
                                    console.log(oData)    
                                    console.log(oData.results.length)  
                                    for(let i=0; i<(oData.results.length); i++) {
                                        var serial = oData.results[i].serialNumber;
                                        if (serialNumberList.includes(serial) == false) {
                                            serialNumberList.push(serial)
                                        }
                                        // removing array elements when not required
                                        else {
                                            if ((serial == oData.results[i].serialNumber && oData.results[i].checkstatus == 'Y')) {
                                                oData.results.splice( i, 1);
                                                i -=1;
                                            }
                                            else if ((serial == oData.results[i-1].serialNumber && oData.results[i-1].checkstatus == 'Y')) {
                                                oData.results.splice( i-1, 1); 
                                                if( i > 1)  {
                                                    i -=2;        
                                                } else if( i == 1) {
                                                    i = 0;
                                                }
                                            } 
                                            else if (i+1 < oData.results.length ) {
                                                if ((serial == oData.results[i+1].serialNumber && oData.results[i+1].checkstatus == 'Y')) {
                                                    oData.results.splice( i+1, 1);
                                                }
                                            }
                                        }
                                    }
                                    //   Process the order for specific statuses 
                                    // for(let i=0; i<serialNumberList.length; i++) {
                                    //   var validate =  serialNumberList[i]
                                    //   for (let j=0; j<(oData.results.length); j++) {
                                    //     if ((serial == oData.results[j].serialNumber && oData.results[j].userStatustext != undefined))
                                    //     {
                                    //         if ( oData.results[j].status == 'E0003' || oData.results[j].status == 'E0006'  )
                                    //         {
                                    //             // remove the item from results table

                                    //         }

                                    //     }
                                    //   }
                                    // }    
                                    console.log(serialNumberList)
                                    console.log(serialNumberList.length)
                                    var count = 0
                                    for(let i=0; i<serialNumberList.length; i++) {
                                        var addToList = 0
                                        var statComp = 0
                                        var unuFlag = 0
                                        var materialText = oData.results[i].materialText
                                        var serialNumber = oData.results[i].serialNumber
                                        var materialNumber = oData.results[i].materialNumber
                                        var dayOwned = oData.results[i].dayOwned
                                        var date = new Date(oData.results[i].lastRecievedDate);
                                        var options = { year: 'numeric', month: 'long', day: 'numeric' };
                                        var formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
                                        var lastRecievedDate = formattedDate //oData.results[i].lastRecievedDate
                                        var userStatustext = oData.results[i].userStatustext
                                        var totalUserStat = ""
                                        //check status of container matches customer status
                                        if (stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                            statComp += 1
                                        } else if (stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                            statComp += 1
                                        } else if (stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                            statComp += 1
                                        } else if (stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                            statComp += 1
                                        }
                                        // Addition as nodevalue remains empty if (userStatustext.nodeValue != undefined) {
                                        if (userStatustext != undefined) {
                                            if (userStatustext.nodeValue != undefined) {
                                                userStatustext = userStatustext.nodeValue
                                            }
                                        } else {
                                            userStatustext = ""
                                        }

                                        serial = serialNumberList[i]
                                        for(let j=0; j<(oData.results.length); j++){
                                            if ((serial == oData.results[j].serialNumber && oData.results[j].userStatustext != undefined)) {
                                                totalUserStat += oData.results[j].userStatustext + " " 
                                                // totalUserStat += oData.results[j].userStatustext + " " Incorrect array index addressing
                                            }
                                        }
                                        for (let j=0; j<4; j++) {
                                            for(let k=0; k<(oData.results.length); k++){
                                                if (serial == oData.results[k].serialNumber) {
                                                    var userStat = oData.results[k].userStatCode
                                                    if (userStat != undefined) {
                                                        if (userStat.nodeValue != undefined) {
                                                            userStat = userStat.nodeValue
                                                        }
                                                    } else {
                                                        userStat = ''
                                                    }
                                                    if(userStat == 'UNU') {
                                                        unuFlag = 1
                                                    }

                                                    if(userStat == 'DPI') {
                                                        if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                            if (stat6 == userStat || stat6 == 'FQ') {
                                                                addToList += 1
                                                            }
                                                        } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                            if (stat7 == userStat || stat7 == 'FQ') {
                                                                addToList += 1
                                                            }
                                                        } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                            if (stat8 == userStat || stat8 == 'FQ') {
                                                                addToList += 1
                                                            }
                                                        } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                            if (stat9 == userStat || stat9 == 'FQ') {
                                                                addToList += 1
                                                            }
                                                        }
                                                    } else if (userStat == 'FQ') {
                                                        if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                            if (stat6 == userStat) {
                                                                addToList += 1
                                                            }
                                                        } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                            if (stat7 == userStat) {
                                                                addToList += 1
                                                            }
                                                        } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                            if (stat8 == userStat) {
                                                                addToList += 1
                                                            }
                                                        } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                            console.log(stat9)
                                                            if (stat9 == userStat) {
                                                                addToList += 1
                                                            }
                                                        }
                                                    } else if (userStat == 'GP') {
                                                        if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                            if (stat6 == userStat) {
                                                                addToList += 1
                                                            }
                                                        } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                            if (stat7 == userStat) {
                                                                addToList += 1
                                                            }
                                                        } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                            if (stat8 == userStat || stat8 == 'FUM') {
                                                                addToList += 1
                                                            }
                                                        } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                            console.log(stat9)
                                                            if (stat9 == userStat || stat9 == 'FUM') {
                                                                addToList += 1
                                                            }
                                                        }
                                                    } else if (userStat == 'FUM') {
                                                        if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                            if (stat6 == 'GP') {
                                                                addToList += 1
                                                            }
                                                        } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                            if (stat7 == 'GP') {
                                                                addToList += 1
                                                            }
                                                        } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                            if (stat8 == 'GP') {
                                                                addToList += 1
                                                            }
                                                        } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                            console.log(stat9)
                                                            if (stat9 == 'GP') {
                                                                addToList += 1
                                                            }
                                                        }
                                                    }

                                                    //check status of container matches customer statu DPI
                                                    // if(userStat == 'DPI') {
                                                    //     if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                    //         if (stat6 == userStat) {
                                                    //             addToList += 1
                                                    //         }
                                                    //     } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                    //         if (stat7 == userStat) {
                                                    //             addToList += 1
                                                    //         }
                                                    //     } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                    //         if (stat8 == userStat) {
                                                    //             addToList += 1
                                                    //         }
                                                    //     } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                    //         console.log(stat9)
                                                    //         if (stat9 == userStat) {
                                                    //             addToList += 1
                                                    //         }
                                                    //     }
                                                    // } else if (userStat == 'FQ') {
                                                    //     if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                    //         if (stat6 == userStat || stat6 == 'DPI') {
                                                    //             addToList += 1
                                                    //         }
                                                    //     } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                    //         if (stat7 == userStat || stat7 == 'DPI') {
                                                    //             addToList += 1
                                                    //         }
                                                    //     } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                    //         if (stat8 == userStat || stat8 == 'DPI') {
                                                    //             addToList += 1
                                                    //         }
                                                    //     } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                    //         console.log(stat9)
                                                    //         if (stat9 == userStat || stat9 == 'DPI') {
                                                    //             addToList += 1
                                                    //         }
                                                    //     }
                                                    // } else if (userStat == 'GP') {
                                                    //     if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                    //         if (stat6 == userStat) {
                                                    //             addToList += 1
                                                    //         }
                                                    //     } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                    //         if (stat7 == userStat) {
                                                    //             addToList += 1
                                                    //         }
                                                    //     } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                    //         if (stat8 == userStat) {
                                                    //             addToList += 1
                                                    //         }
                                                    //     } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                    //         console.log(stat9)
                                                    //         if (stat9 == userStat) {
                                                    //             addToList += 1
                                                    //         }
                                                    //     }
                                                    // }
                                                }
                                            }
                                        }
                                        if (stat6 == '' && stat7 == '' && stat8 == '' && stat9 == '') {
                                            addToList = 1
                                            statComp = 1
                                        }
                                        if (addToList > 0 && unuFlag != 1) {
                                            if (count >= 1 ) {
                                                payload += ","
                                            }
                                            payload += "{\"materialText\":\"" + materialText + "\",\"serialNumber\":\"" + serial + "\",\"materialNumber\":\"" + materialNumber + 
                                            "\",\"dayOwned\":\"" + dayOwned + "\",\"lastRecievedDate\":\"" + lastRecievedDate + "\",\"userStatustext\":\"" + 
                                            totalUserStat + "\"}"
                                            count += 1
                                        }
                                    }
                                    payload += "]}"

                                    if ( RFPvalidation == 1 && payload.length > 10 ) { 
                                        console.log("here")
                                        //var oModelDialog = new sap.ui.model.json.JSONModel();
                                        //oModelDialog.setData(oDialogData);
                                
                                        // create the data to be shown in the table
                                        var oVHData = JSON.parse(payload)
                                        console.log(oVHData)

                                        // create the model to hold the data
                                        var oModel1 = new sap.ui.model.json.JSONModel();
                                        oModel1.setDefaultBindingMode("OneWay");
                                        oModel1.setData(oVHData);
                                
                                        // create the template for the items binding
                                        console.log(storeThis.getOwnerComponent().getModel("item"))
                                        storeThis.getOwnerComponent().getModel("item").setData(oVHData)
                                        console.log(storeThis.getOwnerComponent().getModel("item"))
                                        storeThis._DialogGenerate = sap.ui.xmlfragment("packingapp.packingapp.ext.fragment.CreateHUDialog", storeThis);
                                        storeThis.getView().addDependent(storeThis._DialogGenerate);
                                        storeThis._DialogGenerate.open();
                                        
                                    }
                                },
                                error: function(oError){
                                    console.log(oError)
                                    sap.m.MessageBox.error(oError);
                                }
                            })        
                        }
                        
                    }.bind(this), 
                    error: function(oError){
                        sap.m.MessageBox.error(oError);
                    }

                })
                console.log(this.getOwnerComponent().getModel());

            } 
            
            //If packaging material is a container
            else if  (matType == '0005') {


                if (sap.ui.getCore().byId("OK") === undefined) {
                    var oButton1 = new sap.m.Button("OK", {
                        text: "OK"
                    });
                }
                else if (sap.ui.getCore().byId("OK") != undefined) {
                    var oButton1 = sap.ui.getCore().byId("OK");
                }

            if (sap.ui.getCore().byId("Cancel") === undefined) {
                var oButton2 = new sap.m.Button("Cancel", {
                    text: "Cancel"
                });
            }
            else if (sap.ui.getCore().byId("Cancel") != undefined) {
                var oButton2 = sap.ui.getCore().byId("Cancel");
            }

            oButton2.attachPress(function (evt) {
                if (sap.ui.getCore().byId("Dialog1") != undefined) {
                    sap.ui.getCore().byId("Dialog1").close();
                    sap.ui.getCore().byId("Dialog1").destroy();
                }
            });

          var oDialog = new sap.m.Dialog("Dialog1", {
                title: "Select Seal Number",
                contentWidth: "20%",
                closeOnNavigation: true,
                buttons: [oButton1, oButton2],
                content: [
                    new sap.m.Label({ text: "Seal Number:", required: true }),
                    new sap.m.Input({ maxLength: 8, id: "SealNumber" })
                ]
            });

            oDialog.addStyleClass("sapUiContentPadding");
            oDialog.open()

            oButton1.attachPress(function (evt) {
                var sealn = sap.ui.getCore().byId("SealNumber").getValue()
                if (sap.ui.getCore().byId("Dialog1") != undefined) {
                    sap.ui.getCore().byId("Dialog1").close();
                    sap.ui.getCore().byId("Dialog1").destroy();
                }

                //call create HU function import to create a HU
                var oModelCreate = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");
                console.log(packInstructionsKey);
                oModelCreate.callFunction("/CreateHU", {
                    method: "POST",
                    urlParameters: {                    
                        manOrder: manOrder,
                        batch: batch,
                        packMaterial: packMaterial, 
                        plant: plant,
                        packInst: packInstructionsKey,
                        product: product, 
                        sealNumber: sealn,
                        serialNumber: '',
                        storLocItem: StorLoc,
                        auxMaterial: auxMat,
                        customer: customer,
                        packInstQuant: packInstQuant
                    },
                    success: function(oData, oResponse) {
                        console.log(oData)
                        var message = oData.Message
                        var messageType = oData.Type
                        if (messageType == 'S') {
                            sap.m.MessageToast.show(message);
                        } else {
                            sap.m.MessageBox.error(message);
                        }
                        
                    }.bind(this),
                    error: function(oError) {
                        console.log(oError)
                        sap.m.MessageBox.error(oError);

                    }, 
                })

            });
            
            }
            else {

                var oModelCreateHU = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");
                console.log(packInstructionsKey);
                oModelCreateHU.callFunction("/CreateHU", {
                    method: "POST",
                    urlParameters: {                    
                        manOrder: manOrder,
                        batch: batch,
                        packMaterial: packMaterial, 
                        plant: plant,
                        // packInst: encodeURI(packInstructionsKey), 
                        // commenting as only curly braces will be used in the field as per latest discussion if any new special charater pops-up 
                        // then addition changes required in future
                        packInst: packInstructionsKey,
                        product: product, 
                        sealNumber: '',
                        serialNumber: '',
                        storLocItem: StorLoc,
                        auxMaterial: auxMat,
                        customer: customer,
                        packInstQuant: packInstQuant
                    },
                    success: function(oData, oResponse) {
                        var message = oData.Message
                        var messageType = oData.Type
                        if (messageType == 'S') {
                            console.log(message)
                            sap.m.MessageToast.show(message);
                        } else {
                            sap.m.MessageBox.error(message);
                        }
                        
                    },
                    error: function(oError) {
                        console.log(oError)
                        sap.m.MessageBox.error(oError);

                    }, 
                })
            }

        },

        createSample: function(oEvent) {
            //get data selected by user and add leading zeroes where necessary 
            var manOrder = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            manOrder = manOrder.substr(manOrder.length-12);
            var material = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().product;
            material = material.substr(material.length-18);
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().plant;
            var operationvhURL = "/packingapplication/sap/opu/odata/sap/ZSCM_PACKAPP_SRV/ZSCM_I_SampleOperationVH_L1?$filter=prodorder eq \'" + manOrder + "\'" ;
            var payload = "{\"items\":["
            var operation
            var shortText
            var storeThis = this;

            var oModelSO = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSCM_PACKAPP_SRV");
            var filtersSO= new Array()
            var filterSO = new sap.ui.model.Filter({
                path: "prodorder",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: manOrder}
            );
            filtersSO.push(filterSO)
            //get data for operation VH
            oModelSO.read("/ZSCM_I_SampleOperationVH_L1", {
                filters: filtersSO,
                success: function(oData, oResponse) {
                    console.log(oData)
                    for(let i=0; i<(oData.results.length); i++) {
                        operation = oData.results[i].activity
                        shortText = oData.results[i].shortText
                        payload += "{\"operation\":\"" + operation + "\",\"operationText\":\"" + shortText + "\"}"
                        if ((i+1)<(oData.results.length)) {
                            payload += ","
                        }
                    }
                    payload += "]}"
                    console.log(payload)
                    // create the data to be shown in the table
                    var oVHData = JSON.parse(payload)
                    console.log(oVHData)

                    // create the model to hold the data
                    var oModel1 = new sap.ui.model.json.JSONModel();
                    oModel1.setDefaultBindingMode("OneWay");
                    oModel1.setData(oVHData);
            
                    // create the template for the items binding
                    console.log(storeThis.getOwnerComponent().getModel("item1"))
                    storeThis.getOwnerComponent().getModel("item1").setData(oVHData)
                    console.log(storeThis.getOwnerComponent().getModel("item1"))
                    storeThis._DialogGenerate = sap.ui.xmlfragment("packingapp.packingapp.ext.fragment.CreateSampleDialog", storeThis);
                    storeThis.getView().addDependent(storeThis._DialogGenerate);
                    storeThis._DialogGenerate.open();
                },
                error: function(oError) {
                    console.log(oError)
                    sap.m.MessageBox.error(oError);
                }, 
            })
  
        },

        sendToCoLos: function(oEvent) {
            //get data selected by user and add leading zeroes where necessary 
            var product = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().product;
            product = product.substr(product.length-18);
            var manOrder = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            manOrder = manOrder.substr(manOrder.length-12);
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().plant;
            var batch = oEvent.getSource().getParent().getParent().getBindingContext().getObject().batch;

            //call updateMnuDate function import to update manu date and container counter
            var oModelSendToCoLos = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");

            oModelSendToCoLos.callFunction("/updateManuDate", {
                method: "POST",
                urlParameters: {                    
                    manOrder: manOrder,
                    batch: batch,
                    plant: plant,
                    product: product
                },
                success: function(oData, oResponse) {
                    console.log(oData)
                    var message = oData.Message
                    var messageType = oData.Type
                    if (messageType == 'S') {
                        console.log(message)
                        sap.m.MessageToast.show(message);
                    } else {
                        sap.m.MessageBox.error(message);
                    }
                    
                },
                error: function(oError) {
                    console.log(oError)
                    sap.m.MessageBox.error(oError);
                }, 
            })
        },

        addToExisting: function(oEvent) {
            //generate dialog from fragment, logic is handled in onActionOKAddToExisting
            this._DialogGenerate = sap.ui.xmlfragment("packingapp.packingapp.ext.fragment.AddToExistingDialog", this);
            this.getView().addDependent(this._DialogGenerate);
            this._DialogGenerate.open();

        },

        displyPackInst: function(oEvent) {
            //open window pointing at pack inst url details in airtable
            var packInstURL = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstURL255;
            if ( packInstURL != "" ) {
            console.log(packInstURL);
            window.open(packInstURL);  
            }
            if ( packInstURL == "" ) {
                sap.m.MessageToast.show('There is no link for this packing instruction');
            }
        },

        packToOrder: function(oEvent) {
            
            //get details from selected row in open delivery table
            var PackingInstructionsSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().PackingInstructionsSO;
            var PackingInstDescSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().PackingInstDescSO;
            var PackingInstQuantSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().PackingInstQuantSO;
            var packagingMaterialSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().packagingMaterialSO;
            var packagingMaterialDescriptionSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().packagingMaterialDescriptionSO;
            var auxMaterialSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().auxMaterialSO;
            var auxMaterialDescSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().auxMaterialDescSO;
            var StackingPatternSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().StackingPatternSO;
            var HeightSettingSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().HeightSettingSO;
            var AlternateSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().AlternateSO;
            var PackingInstructionsKeySO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().PackingInstructionKeySO
            var packInstURLOpenDel = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().packInstURLOpenDel

            //check if there are any PI associated with the selected order
            if (PackingInstructionsSO == "" || PackingInstructionsSO == null) {
                sap.m.MessageBox.error("No Packaging Instructions Associated With This Order", {
                        title: "Error",                                      // default
                        onClose: null,                                       // default
                        styleClass: "",                                      // default
                        actions: sap.m.MessageBox.Action.CLOSE,              // default
                        emphasizedAction: null,                              // default
                        initialFocus: null,                                  // default
                        textDirection: sap.ui.core.TextDirection.Inherit     // default
                });
            } else {
                //publish event bus from custombuttons.controller to update pack inst details
                var oEventBus = sap.ui.getCore().getEventBus();
                var oData = {"PackingInstructionsSO": PackingInstructionsSO,
                             "PackingInstQuantSO": PackingInstQuantSO,
                             "packagingMaterialSO": packagingMaterialSO,
                             "packagingMaterialDescriptionSO": packagingMaterialDescriptionSO,
                             "auxMaterialSO": auxMaterialSO,
                             "auxMaterialDescSO": auxMaterialDescSO,
                             "PackingInstructionsKeySO" : PackingInstructionsKeySO,
                             "packInstURLOpenDel": packInstURLOpenDel
                            }
                oEventBus.publish("MyChannel", "oSetPackToOrder", oData);

            }
        },

        onActionCancel: function () {
            //when cancel is pressed in dialog close and destroy dialog
            this._DialogGenerate.close();
            this._DialogGenerate.destroy();
            this.getView().removeDependent(this._DialogGenerate);
            this._DialogGenerate = null;
        },

        onActionOKCreateHU: function (oEvent) { 
            //get user selected data
            var customer = oEvent.getSource().getParent().getParent().getBindingContext().getObject().customer;
            var packCustomerType = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packCustomerType;
            var packStockType = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packStockType;
            var packInst = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstObj;
            var packMaterialCust = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialCustr;
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().plant;
            var batch = oEvent.getSource().getParent().getParent().getBindingContext().getObject().batch;
            var StorLoc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().StorLoc;

            //determine selected packaging instructions
            if (packInst == oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstru) {
                var packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstructionsKey;
            } else if(packInst == oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingCustomerInstructions) {
                var packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstructionsCustKey;
            } else {
                var packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().altPIKey; 
            }
            
            
            //add leading zeroes 
            var packMaterial = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialObj;
            packMaterial = packMaterial.substr(packMaterial.length-18);
            var packInstQuant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstQuantObj;
            var product = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().product;
            product = product.substr(product.length-18);
            var auxMat = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialObj;
            auxMat = auxMat.substr(auxMat.length-18);
            var manOrder = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            manOrder = manOrder.substr(manOrder.length-12);
            console.log(sap.ui.getCore())
            var container = sap.ui.getCore().byId("containerInput").getValue();
            var seal = sap.ui.getCore().byId("sealNumberInput").getValue();

            if (container == "" && plant == "2310") {
                sap.ui.getCore().byId("containerInput").setValueState(sap.ui.core.ValueState.Error);
            } else {

                var oModelCreateHU = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");
                //call createHU function import to create a HU
                oModelCreateHU.callFunction("/CreateHU", {
                    method: "POST",
                    urlParameters: {                    
                        manOrder: manOrder,
                        batch: batch,
                        packMaterial: packMaterial, 
                        plant: plant,
                        // packInst: encodeURI(packInstructionsKey), 
                        // commenting as only curly braces will be used in the field as per latest discussion if any new special charater pops-up 
                        // then addition changes required in future
                        packInst: packInstructionsKey,
                        product: product, 
                        sealNumber: seal,
                        serialNumber: container,
                        storLocItem: StorLoc,
                        auxMaterial: auxMat,
                        customer: customer,
                        packInstQuant: packInstQuant
                    },
                    success: function(oData, oResponse) {
                        console.log(oData)
                        var message = oData.Message
                        var messageType = oData.Type
                        if (messageType == 'S') {
                            console.log(message)
                            sap.m.MessageToast.show(message);
                        } else {
                            sap.m.MessageBox.error(message);
                        }
                        
                    },
                    error: function(oError) {
                        console.log(oError)
                        sap.m.MessageBox.error(oError);
                    }, 
                })
                //destroy dialog after creation
                this._DialogGenerate.close();
                this._DialogGenerate.destroy();
                this.getView().removeDependent(this._DialogGenerate);
                this._DialogGenerate = null;
            }
        },

        onActionOKCreateSample: function (oEvent) {
            //get user selected data and add leading zeroes where relevant
            var manOrder = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            manOrder = manOrder.substr(manOrder.length-12);
            var material = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().product;
            material = material.substr(material.length-18);
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().plant;
            var operation = sap.ui.getCore().byId("opNumInput").getValue();
            var container = sap.ui.getCore().byId("palletInput").getValue();

            var oModelCreateSample = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");
            //create sample using function import createSample
            oModelCreateSample.callFunction("/createSample", {
                method: "POST",
                urlParameters: {                    
                    container: container,
                    material: material,
                    operationNumber: operation,
                    plant: plant,
                    palletID: '',
                    order: manOrder
                },
                success: function(oData, oResponse) {
                    console.log(oData)
                    var message = oData.Message
                    var messageType = oData.Type
                    if (messageType == 'S') {
                        console.log(message)
                        sap.m.MessageToast.show(message);
                    } else {
                        sap.m.MessageBox.error(message);
                    }
                    
                },
                error: function(oError) {
                    console.log(oError)
                    sap.m.MessageBox.error(oError);
                }, 
            })
            this._DialogGenerate.close();
            this._DialogGenerate.destroy();
            this.getView().removeDependent(this._DialogGenerate);
            this._DialogGenerate = null;

        },

        onActionOKAddToExisting: function (oEvent) {
            //get user selected data and add leading zeroes where relevant
            var packInst = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstObj;
            if (packInst == oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstru) {
                var packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstructionsKey;
            } else {
                var packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstructionsCustKey;
            }
            var packMaterialCust = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialCustr;
            var s3 = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialObj;
            var packMaterial = s3.substr(s3.length-18);
            var packInstQuant = parseFloat(oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstQuantObj);
            var s1 = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialObj;
            var packMaterial = s1.substr(s1.length-18);
            var s2 = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().product;
            var product = s2.substr(s2.length-18);
            var manOrder = oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            var manOrder1 = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            var manOrder2 = manOrder1.substr(manOrder1.length-12);
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().plant;
            var customer = oEvent.getSource().getParent().getParent().getBindingContext().getObject().customer;
            var batch = oEvent.getSource().getParent().getParent().getBindingContext().getObject().batch;
            var StorLoc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().StorLoc;
            var auxMat = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialObj
            auxMat = auxMat.substr(auxMat.length-18);

            //get data from dialog
            var serialNumber = sap.ui.getCore().byId("containerInput").getValue()
            var sealNumber = sap.ui.getCore().byId("sealInput").getValue()

            var oModelCreateHU = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");
            //call add to existing HU fucniton import
            oModelCreateHU.callFunction("/addToExistingHU", {
                method: "POST",
                urlParameters: {                    
                    manOrder: manOrder2,
                    batch: batch,
                    packMaterial: packMaterial, 
                    plant: plant,
                    // packInst: encodeURI(packInstructionsKey), 
                    // commenting as only curly braces will be used in the field as per latest discussion if any new special charater pops-up 
                    // then addition changes required in future
                    packInst: packInstructionsKey,
                    product: product, 
                    serialNumber: serialNumber,
                    storLocItem: StorLoc,
                    packInstQuant: packInstQuant,
                    sealNumber: sealNumber,
                    customer: customer
                },
                success: function(oData, oResponse) {
                    console.log(oData)
                    var message = oData.Message
                    var messageType = oData.Type
                    if (messageType == 'S') {
                        console.log(message)
                        sap.m.MessageToast.show(message);
                    } else {
                        sap.m.MessageBox.error(message);
                    }
                    
                },
                error: function(oError) {
                    console.log(oError)
                    sap.m.MessageBox.error(oError);
                }, 
            })

            this._DialogGenerate.close();
            this._DialogGenerate.destroy();
            this.getView().removeDependent(this._DialogGenerate);
            this._DialogGenerate = null;

        },

        onValueHelpRequestedHUCont: function() {
            //define model for container VH
            var oModel1 = new sap.ui.model.json.JSONModel();
            oModel1.setDefaultBindingMode("OneWay");
            oModel1.setData(this.getOwnerComponent().getModel("item").getData());
            console.log(oModel1)
            console.log(this.getOwnerComponent().getModel("item").getData())

            this._oValueHelpDialog = sap.ui.xmlfragment("packingapp.packingapp.ext.fragment.ContValueHelpDialog", this);
            this.getView().addDependent(this._oValueHelpDialog);
            this._oBasicSearchField = new SearchField();
            var oFilterBar = this._oValueHelpDialog.getFilterBar();
            oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);

            this._oValueHelpDialog.setRangeKeyFields([{
                label: "Serial Number",
                key: "serialNumber",
                type: "string",
                typeInstance: new TypeString({}, {
                    maxLength: 10
                })
            }]);

            // Trigger filter bar search when the basic search is fired
            this._oBasicSearchField.attachSearch(function() {
                oFilterBar.search();
            });

            //console.log(model)
            this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                console.log("here")
                oTable.setModel(oModel1);
                if (oTable.bindRows) {
                    // Bind rows to the ODataModel and add columns
                    oTable.bindAggregation("rows", {
                        path: "/items",
                        events: {
                            dataReceived: function() {
                                oDialog.update();
                            }
                        }
                    });
                    oTable.addColumn(new UIColumn({label: "Serial Number", template: "serialNumber"}));
                    oTable.addColumn(new UIColumn({label: "Material Number", template: "materialNumber"}));
                    oTable.addColumn(new UIColumn({label: "Material Text", template: "materialText"}));
                    oTable.addColumn(new UIColumn({label: "User Status", template: "userStatustext"}));
                    oTable.addColumn(new UIColumn({label: "Last Recieved Date", template: "lastRecievedDate"}));
                    oTable.addColumn(new UIColumn({label: "Days Owned", template: "dayOwned"}));


                    
                }

                // For Mobile the default table is sap.m.Table
                if (oTable.bindItems) {
                    // Bind items to the ODataModel and add columns
                    oTable.bindAggregation("items", {
                        path: "/items",
                        template: new sap.m.ColumnListItem({
                            type : "Active",
                            unread : false,
                            cells : [
                                new sap.m.Label({
                                    text : "{materialNumber}",
                                    wrapping: true
                                }), new sap.m.Label({
                                    text: "{materialText}",
                                    wrapping: true
                                }), new sap.m.Label({
                                    text: "{serialNumber}",
                                    wrapping: true
                                }), new sap.m.Label({
                                    text: "{userStatustext}",
                                    wrapping: true
                                }), new sap.m.Label({
                                    text: "{lastRecievedDate}",
                                    wrapping: true
                                }), new sap.m.Label({
                                    text: "{dayOwned}",
                                    wrapping: true
                                })
                            ]
                        }),
                        events: {
                            dataReceived: function() {
                                oDialog.update();
                            }
                        }
                    });
                    oTable.addColumn(new MColumn({header: new Label({text: "Serial Number"})}));
                    oTable.addColumn(new MColumn({header: new Label({text: "Material Number"})}));
                    oTable.addColumn(new MColumn({header: new Label({text: "Material Text"})}));
                    oTable.addColumn(new MColumn({header: new Label({text: "User Status"})}));
                    oTable.addColumn(new MColumn({header: new Label({text: "Last Recieved Date"})}));
                    oTable.addColumn(new MColumn({header: new Label({text: "Days Owned"})}));
                }
            });
            this._oValueHelpDialog.open();
        },

        // onFilter: function(oEvent) {
        //     var oModel = new sap.ui.model.json.JSONModel();
        //     oModel.setDefaultBindingMode("OneWay");
        //     oModel.setData(this.getOwnerComponent().getModel("item").getData());
		// 	// build filter array
		// 	var aFilter = [];
			
		// 	var sQuery = sap.ui.getCore().byId("serialNumberSerach")//.getValue();
        //     console.log(sQuery)
		// 	if (sQuery) {
		// 		aFilter.push(new Filter("serialNumber", FilterOperator.Contains,sQuery));
		// 	}

		// 	// filter binding
        //     console.log(this.getView().getModel())
		// 	//var oList = this.getView().byId("oModel");
        //     //console.log(this.getView().byId("oModel"))
		// 	var oBinding = oList.getBinding("items");
		// 	oBinding.filter(aFilter);
		// },

        onValueHelpRequestedSample: function() {
            //define model for operation VH
            var oModel2 = new sap.ui.model.json.JSONModel();
            oModel2.setDefaultBindingMode("OneWay");
            oModel2.setData(this.getOwnerComponent().getModel("item1").getData());
            console.log(oModel2)
            console.log(this.getOwnerComponent().getModel("item1").getData())

            this._oValueHelpDialog = sap.ui.xmlfragment("packingapp.packingapp.ext.fragment.OperationValueHelpDialog", this);
            this.getView().addDependent(this._oValueHelpDialog);
            this._oBasicSearchField = new SearchField();
            var oFilterBar = this._oValueHelpDialog.getFilterBar();
            oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);

            this._oValueHelpDialog.setRangeKeyFields([{
                label: "Operation Number",
                key: "operation",
                type: "string",
                typeInstance: new TypeString({}, {
                    maxLength: 10
                })
            }]);

            // Trigger filter bar search when the basic search is fired
            this._oBasicSearchField.attachSearch(function() {
                oFilterBar.search();
            });

            //console.log(model)
            this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                console.log("here")
                oTable.setModel(oModel2);
                if (oTable.bindRows) {
                    // Bind rows to the ODataModel and add columns
                    oTable.bindAggregation("rows", {
                        path: "/items",
                        events: {
                            dataReceived: function() {
                                oDialog.update();
                            }
                        }
                    });
                    oTable.addColumn(new UIColumn({label: "Activity", template: "operation"}));
                    oTable.addColumn(new UIColumn({label: "Operation Short Text", template: "operationText"}));
                }

                // For Mobile the default table is sap.m.Table
                if (oTable.bindItems) {
                    // Bind items to the ODataModel and add columns
                    oTable.bindAggregation("items", {
                        path: "/items",
                        template: new sap.m.ColumnListItem({
                            type : "Active",
                            unread : false,
                            cells : [
                                new sap.m.Label({
                                    text : "{operation}",
                                    wrapping: true
                                }), new sap.m.Label({
                                    text: "{operationText}",
                                    wrapping: true
                                })
                            ]

                        }),
                        events: {
                            dataReceived: function() {
                                oDialog.update();
                            }
                        }
                    });
                    oTable.addColumn(new MColumn({header: new Label({text: "Activity"})}));
                    oTable.addColumn(new MColumn({header: new Label({text: "Operation Short Text"})}));

                }
            });
            this._oValueHelpDialog.open();
        },

        onValueHelpOkPress: function (oEvent) {
            var input = sap.ui.getCore().byId("containerInput");
            var container = oEvent.getParameter("tokens")[0].getKey()
            input.setValue(container)
            this._oValueHelpDialog.close();
            this._oValueHelpDialog.destroy();
        },

        onValueHelpCancelPress: function () {
            this._oValueHelpDialog.close();
            this._oValueHelpDialog.destroy();
        },

        onValueHelpSampleOkPress: function (oEvent) {
            var input = sap.ui.getCore().byId("opNumInput");
            var operation = oEvent.getParameter("tokens")[0].getKey()
            input.setValue(operation)
            this._oValueHelpDialog.close();
            this._oValueHelpDialog.destroy();
        },

        onFilterBarSearch: function (oEvent) {
            //hanlde search in VH
            var aSelectionSet = oEvent.getParameter("selectionSet");
            var sSearchQuery = this._oBasicSearchField.getValue();
            var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                if (oControl.getValue()) {
                    aResult.push(new Filter({
                        path: oControl.getName(),
                        operator: FilterOperator.Contains,
                        value1: oControl.getValue()
                    }));
                }

                return aResult;
            }, []);

            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "serialNumber", operator: FilterOperator.Contains, value1: sSearchQuery }),
                ],
                and: false
            }));

            this._filterTable(new Filter({
                filters: aFilters,
                and: true
            }));
        },  
        
        onFilterBarSearchSample: function (oEvent) {
            //handle search in VH
            var aSelectionSet = oEvent.getParameter("selectionSet");
            var sSearchQuery = this._oBasicSearchField.getValue();
            console.log(aSelectionSet)
            var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                if (oControl.getValue()) {
                    aResult.push(new Filter({
                        path: oControl.getName(),
                        operator: FilterOperator.Contains,
                        value1: oControl.getValue()
                    }));
                }

                return aResult;
            }, []);

            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "operation", operator: FilterOperator.Contains, value1: sSearchQuery }),
                ],
                and: false
            }));

            this._filterTable(new Filter({
                filters: aFilters,
                and: true
            }));
        }, 

        _filterTable: function (oFilter) {
            var oValueHelpDialog = this._oValueHelpDialog;

            oValueHelpDialog.getTableAsync().then(function (oTable) {
                if (oTable.bindRows) {
                    oTable.getBinding("rows").filter(oFilter);
                }

                if (oTable.bindItems) {
                    oTable.getBinding("items").filter(oFilter);
                }

                oValueHelpDialog.update();
            });
        },   

    };
});