sap.ui.define(["sap/m/MessageToast"],function(t){"use strict";return{onListNavigationExtension:function(t){var e=t.getSource().getBindingContext().getObject().customer;var n=t.getSource().getBindingContext().getObject().PackingCustomerInstructions;console.log(n);var s={customer:e,customerPackInst:n};var o=sap.ui.getCore().getEventBus();o.publish("MyChannel","oResetButtons",s)}}});
//# sourceMappingURL=ListReportExt.controller.js.map