sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onListNavigationExtension: function(oEvent) {
            //console.log(sap.ui.getCore().getEventBus())
            var customer = oEvent.getSource().getBindingContext().getObject().customer
            var customerPackInst = oEvent.getSource().getBindingContext().getObject().PackingCustomerInstructions
            console.log(customerPackInst)
            var oData = {
                customer: customer,
                customerPackInst: customerPackInst
            }
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("MyChannel", "oResetButtons", oData);
            // console.log("aaaaaaa")
            //oEvent.getSource().getId();
            // if(sap.ui.getCore().byId("backBtn") != undefined) {
            //     console.log("BACKLR")
            //     sap.ui.getCore().byId("backBtn").attachPress(function() {
            //         console.log("BACKLR")
            //         sap.ui.getCore().byId("__xmlview1--PackToCust").setType("Ghost");
            //         sap.ui.getCore().byId("__xmlview1--PackToStock").setType("Emphasized");
            //     })
            // }
        }
    };
});