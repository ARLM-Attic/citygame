// Using state for setting position = horrible performance
// manipulating style directly works much better

module UIComponents
{

export var Draggable =
{
  handleDragStart: function(e)
  {
    this.DOMNode.style.zIndex = this.props.incrementZIndex();

    if (!e.nativeEvent.dataTransfer) return;
    //this.DOMNode.classList.add("dragging");
    // browser overrides css cursor when dragging
    e.nativeEvent.dataTransfer.dropEffect = "move";


    this.offset =
    {
      x: e.nativeEvent.pageX - parseInt(this.DOMNode.style.left),
      y: e.nativeEvent.pageY - parseInt(this.DOMNode.style.top)
    };
  },
  handleDrag: function(e)
  {
    if (e.clientX === 0 && e.clientY === 0) return;

    this.DOMNode.style.left = (e.clientX - this.offset.x)+"px";
    this.DOMNode.style.top = (e.clientY - this.offset.y)+"px";
  },
  handleDragEnd: function(e)
  {
    //this.DOMNode.classList.remove("dragging");
  },

  componentDidMount: function() {
    this.DOMNode = this.getDOMNode();
  }

};

}