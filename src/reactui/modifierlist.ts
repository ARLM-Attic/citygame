/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
/// 
/// <reference path="js/list.d.ts" />

module UIComponents
{

  export var ModifierList = React.createClass({

    render: function()
    {
      var rows = [];
      for (var i = 0; i < this.props.modifiers.length; i++)
      {
        var modifier = this.props.modifiers[i];
        var item: any =
        {
          key: modifier.type,
          data:
          {
            title: modifier.title,
            description: modifier.description,

            modifier: modifier
          }
        };
        if (this.props.excludeCost !== true)
        {
          item.data.cost = modifier.cost || null;
          item.data.costString = modifier.cost !== undefined ? beautify(modifier.cost) + "$" : null;
        }

        rows.push(item);
      }
      var columns = [];
      columns.push(
      {
        label: "Title",
        key: "title"
      });

      if (this.props.excludeCost !== true)
      {
        columns.push(
        {
          label: "Cost",
          key: "costString",
          defaultOrder: "asc",
          propToSortBy: "cost"
        });
      }

      columns.push(
      {
        label: "Description",
        key: "description"
      });

      return(
        UIComponents.List(
        {
          // TODO fix declaration file and remove
          // typescript qq without these
          selected: null,
          columns: null,
          sortBy: null,
          initialColumn: columns[1],
          ref: "list",
          className: "modifier-list",
          rowStylingFN: this.props.rowStylingFN,

          listItems: rows,
          initialColumns: columns
        })
      );

    }
  });
}