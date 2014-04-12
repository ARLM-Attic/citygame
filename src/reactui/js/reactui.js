/// <reference path="../../lib/react.d.ts" />
/// <reference path="../../lib/pixi.d.ts" />
///
/// <reference path="../js/player.d.ts" />
///
/// <reference path="js/employeelist.d.ts" />
/// <reference path="js/employee.d.ts" />
/// <reference path="js/cellinfo.d.ts" />
/// <reference path="js/popup.d.ts" />
/// <reference path="js/stage.d.ts" />
var ReactUI = (function () {
    function ReactUI(player, listener) {
        this.idGenerator = 0;
        this.popups = [];
        this.topZIndex = 15;
        this.eventListener = listener;
        this.player = player;
        this.init();
    }
    ReactUI.prototype.init = function () {
        this.addEventListeners();
        this.updateReact();
    };
    ReactUI.prototype.addEventListeners = function () {
        var self = this;
        var listener = this.eventListener;
        listener.addEventListener("makeInfoPopup", function (event) {
            self.makeInfoPopup(event.content.infoText);
        });
    };

    ReactUI.prototype.makeInfoPopup = function (infoText) {
        var self = this;
        var key = this.idGenerator++;

        var boundDestroyPopup = this.destroyPopup.bind(this, key, null);
        var boundIncrementZIndex = this.incrementZIndex.bind(this);

        var closeBtn = React.DOM.button({
            onClick: boundDestroyPopup,
            key: "close"
        }, "close");

        var popup = UIComponents.Popup({
            popupText: infoText,
            content: null,
            buttons: [closeBtn],
            key: key,
            incrementZIndex: boundIncrementZIndex
        });

        this.popups.push(popup);
        this.updateReact();
    };
    ReactUI.prototype.makeConfirmPopup = function (text, onOk, onCancel) {
        var self = this;
        var key = this.idGenerator++;

        var boundDestroyPopup = this.destroyPopup.bind(this, key, null);
        var boundIncrementZIndex = this.incrementZIndex.bind(this);

        var okAndDestroy = function () {
            onOk.call();
            boundDestroyPopup();
        };
        var okBtn = React.DOM.button({
            onClick: okAndDestroy,
            key: "confirm"
        }, "confirm");

        var cancelAndDestroy = function () {
            onCancel.call();
            boundDestroyPopup();
        };
        var closeBtn = React.DOM.button({
            onClick: cancelAndDestroy,
            key: "cancel"
        }, "cancel");

        var popup = UIComponents.Popup({
            popupText: text,
            content: null,
            buttons: [okBtn, closeBtn],
            key: key,
            incrementZIndex: boundIncrementZIndex
        });

        this.popups.push(popup);
        this.updateReact();
    };

    ReactUI.prototype.makeCellBuyPopup = function (player, cell) {
        var self = this;

        var activeEmployees = player.getActiveEmployees();

        if (activeEmployees.length < 1) {
            self.makeInfoPopup("Recruit some employees first");
            return;
        }

        var key = this.idGenerator++;

        var el = UIComponents.EmployeeList({
            employees: activeEmployees,
            relevantSkills: ["negotiation"],
            selected: null
        });

        var content = React.DOM.div({ className: "popup-content" }, el, UIComponents.CellInfo({ cell: cell }));

        var boundDestroyPopup = this.destroyPopup.bind(this, key, null);
        var boundIncrementZIndex = this.incrementZIndex.bind(this);

        var boundBuySelected = function () {
            if (!self.player.employees[this.state.selected]) {
                self.makeInfoPopup("No employee selected");
                return;
            }
            self.player.buyCell(cell, self.player.employees[this.state.selected]);
            boundDestroyPopup();
        }.bind(el);

        var onOk = boundBuySelected;

        var okBtn = React.DOM.button({
            onClick: onOk,
            key: "ok"
        }, "buy");

        var closeBtn = React.DOM.button({
            onClick: boundDestroyPopup,
            key: "close"
        }, "close");

        var popup = UIComponents.Popup({
            popupText: "hello",
            content: content,
            buttons: [okBtn, closeBtn],
            key: key,
            incrementZIndex: boundIncrementZIndex
        });

        this.popups.push(popup);
        this.updateReact();
    };
    ReactUI.prototype.incrementZIndex = function () {
        return this.topZIndex++;
    };

    ReactUI.prototype.destroyPopup = function (key, callback) {
        this.popups = this.popups.filter(function (popup) {
            return popup.props.key !== key;
        });

        if (callback)
            callback.call();

        this.updateReact();
    };

    ReactUI.prototype.updateReact = function () {
        React.renderComponent(UIComponents.Stage({ popups: this.popups }), document.getElementById("react-container"));
    };
    return ReactUI;
})();
//# sourceMappingURL=reactui.js.map
