/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
///
/// <reference path="js/list.d.ts" />
var UIComponents;
(function (UIComponents) {
    UIComponents.ModifierPopup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        handleClose: function () {
            this.props.onClose.call();
        },
        handleOk: function () {
            var selected = this.refs.modifierList.state.selected;

            if (!selected)
                return false;

            this.props.player.addModifier(selected.data.modifier);
            eventManager.dispatchEvent({ type: "updateReact", content: "" });
        },
        applyRowStyle: function (item, rowProps) {
            if (item.data.modifier.cost > this.props.player.money) {
                rowProps.className = "inactive";
                rowProps.onClick = rowProps.onTouchStart = null;
            }
            return rowProps;
        },
        render: function () {
            var stopBubble = function (e) {
                e.stopPropagation();
            };

            var okBtn = React.DOM.button({
                ref: "okBtn",
                onClick: this.handleOk,
                onTouchStart: this.handleOk,
                draggable: true,
                onDrag: stopBubble
            }, this.props.okBtnText || "Buy");

            var closeBtn = React.DOM.button({
                onClick: this.handleClose,
                onTouchStart: this.handleClose,
                draggable: true,
                onDrag: stopBubble
            }, this.props.closeBtnText || "Close");

            var rows = [];
            for (var i = 0; i < this.props.player.unlockedModifiers.length; i++) {
                var modifier = this.props.player.unlockedModifiers[i];
                rows.push({
                    key: modifier.type,
                    data: {
                        title: modifier.title,
                        cost: modifier.cost,
                        costString: beautify(modifier.cost) + "$",
                        description: modifier.description,
                        modifier: modifier
                    }
                });
            }
            var columns = [
                {
                    label: "Title",
                    key: "title"
                },
                {
                    label: "Cost",
                    key: "costString",
                    defaultOrder: "asc",
                    propToSortBy: "cost"
                },
                {
                    label: "Description",
                    key: "description",
                    notSortable: true
                }
            ];

            return (React.DOM.div({
                className: "popup",
                style: this.props.initialStyle,
                draggable: true,
                onDragStart: this.handleDragStart,
                onDrag: this.handleDrag,
                onDragEnd: this.handleDragEnd,
                onTouchStart: this.handleDragStart
            }, React.DOM.div({ className: "popup-content", draggable: true, onDrag: stopBubble }, UIComponents.List({
                // TODO fix declaration file and remove
                // typescript qq without these
                selected: null,
                columns: null,
                sortBy: null,
                initialColumn: columns[1],
                ref: "modifierList",
                rowStylingFN: this.applyRowStyle,
                listItems: rows,
                initialColumns: columns
            })), React.DOM.div({ className: "popup-buttons" }, okBtn, closeBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=modifierpopup.js.map
