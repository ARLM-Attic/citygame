/// <reference path="../../lib/react.d.ts" />
///
/// <reference path="../js/eventlistener.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
///
/// <reference path="js/list.d.ts" />
var UIComponents;
(function (UIComponents) {
    /**
    * props:
    *   games:
    *   [
    *     {
    *       name: string;
    *       date: date;
    *     }
    *   ]
    */
    UIComponents.LoadPopup = React.createClass({
        mixins: [UIComponents.Draggable, UIComponents.SplitMultilineText],
        handleOk: function (e) {
            var selected = this.refs.savedGameList.state.selected;
            if (!selected) {
                eventManager.dispatchEvent({
                    type: "makeInfoPopup", content: { text: "No saved game selected" }
                });
                return false;
            }

            var callbackSuccessful = this.props.onOk.call(null, selected.data.name);
            if (callbackSuccessful !== false) {
                this.handleClose();
            }
        },
        handleClose: function () {
            this.props.onClose.call();
        },
        render: function () {
            var savedGames = [];

            for (var savedGame in localStorage) {
                var parsed = JSON.parse(localStorage[savedGame]);
                var date = new Date(parsed.date);
                var prettyDate = [
                    [
                        date.toLocaleDateString()
                    ],
                    [
                        date.getHours(),
                        date.getMinutes()
                    ].join(":")
                ].join(" ");
                savedGames.push({
                    key: savedGame,
                    data: {
                        name: savedGame,
                        date: prettyDate,
                        del: React.DOM.a({
                            href: "#",
                            onClick: function (name) {
                                eventManager.dispatchEvent({
                                    type: "makeConfirmPopup",
                                    content: {
                                        text: "Are you sure you want to delete this save?",
                                        onOk: function () {
                                            localStorage.removeItem(name);
                                        }
                                    }
                                });
                            }.bind(null, savedGame)
                        }, "X")
                    }
                });
            }
            ;

            var columns = [
                {
                    label: "Name",
                    key: "name"
                },
                {
                    label: "Date",
                    key: "date",
                    defaultOrder: "asc",
                    sortingFunCtion: function (a, b) {
                        return new Date(a).getTime() - new Date(b).getTime();
                    }
                },
                {
                    label: "Delete",
                    key: "del",
                    notSortable: true
                }
            ];

            var stopBubble = function (e) {
                e.stopPropagation();
            };

            var okBtn = React.DOM.button({
                ref: "okBtn",
                onClick: this.handleOk,
                onTouchStart: this.handleOk,
                draggable: true,
                onDrag: stopBubble
            }, this.props.okBtnText || "Load");

            var closeBtn = React.DOM.button({
                onClick: this.handleClose,
                onTouchStart: this.handleClose,
                draggable: true,
                onDrag: stopBubble
            }, this.props.closeBtnText || "Cancel");

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
                ref: "savedGameList",
                listItems: savedGames,
                initialColumns: columns
            })), React.DOM.div({ className: "popup-buttons" }, okBtn, closeBtn)));
        }
    });
})(UIComponents || (UIComponents = {}));
//# sourceMappingURL=loadpopup.js.map
