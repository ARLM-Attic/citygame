/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.Popup = React.createClass({
        mixins: [UIComponents.Draggable],
        render: function () {
            var text;
            if (Array.isArray(this.props.text)) {
                text = [];
                for (var i = 0; i < this.props.text.length; i++) {
                    text.push(this.props.text[i]);
                    text.push(React.DOM.br(null));
                }
            } else {
                text = this.props.text;
            }
            return (React.DOM.div({ className: "popup" }, React.DOM.p({ className: "popup-text" }, text), this.props.content, React.DOM.div({ className: "popup-buttons" }, this.props.buttons)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=popup.js.map
