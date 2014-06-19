/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.SideMenuMapmode = React.createClass({
        handleMapmodeChange: function (event) {
            var target = event.target;

            eventManager.dispatchEvent({ type: "changeMapmode", content: target.value });
        },
        render: function () {
            var options = [];

            ["terrain", "landValue", "underground"].forEach(function (type) {
                var props = {
                    key: type,
                    value: type
                };

                var title = type === "landValue" ? "land value" : type;
                options.push(React.DOM.option(props, title));
            });

            return (React.DOM.select({
                id: "side-menu-mapmode-select",
                className: "grid-row",
                defaultValue: "landValue",
                title: "Map mode",
                onChange: this.handleMapmodeChange
            }, options));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=sidemenumapmode.js.map
