/*global React: false*/
"use strict";
var UIComponents;
(function (UIComponents) {
    UIComponents.Draggable = {
        handleDragStart: function (e) {
            //e.dataTransfer.setData("text/plain", "stupid firefox");
            this.props.offset = {
                x: e.layerX,
                y: e.layerY
            };
            this.props.DOMNode.style.zIndex = this.props.incrementZIndex();
        },
        handleDrag: function (e) {
            //e.dataTransfer.setData("text/plain", "stupid firefox");
            if (e.clientX === 0 && e.clientY === 0)
                return;

            this.props.DOMNode.style.left = (e.clientX - this.props.offset.x) + "px";
            this.props.DOMNode.style.top = (e.clientY - this.props.offset.y) + "px";
        },
        handleDragEnd: function (e) {
            //e.dataTransfer.setData("text/plain", "stupid firefox");
        },
        componentDidMount: function () {
            var DOMNode = this.props.DOMNode = this.getDOMNode();

            DOMNode.addEventListener("dragstart", this.handleDragStart, false);
            DOMNode.addEventListener("drag", this.handleDrag, false);
            DOMNode.addEventListener("dragend", this.handleDragEnd, false);

            DOMNode.draggable = true;
        },
        componentWillUnmount: function () {
            this.props.DOMNode.removeEventListener("dragstart", this.handleDragStart);
            this.props.DOMNode.removeEventListener("drag", this.handleDrag);
            this.props.DOMNode.removeEventListener("dragend", this.handleDragEnd);
        }
    };
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=draggable.js.map
