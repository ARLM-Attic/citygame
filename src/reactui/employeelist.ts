/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../js/eventlistener.d.ts" />
/// <reference path="../js/utility.d.ts" />
/// 
/// <reference path="js/list.d.ts" />

module UIComponents
{

  export var EmployeeList = React.createClass({

    applyRowStyle: function(item, rowProps)
    {
      if (item.data.employee.active !== true)
      {
        rowProps.className = "inactive";
        rowProps.onClick = rowProps.onTouchStart = null;
      }
      return rowProps;
    },
    applyColStyle: function(column, colProps)
    {
      if (this.props.relevantSkills && this.props.relevantSkills.length > 0)
      {
        if (this.props.relevantSkills.indexOf(column.key) > -1)
        {
          colProps["className"] = "relevant-col";
        }
      }
      colProps.title = colProps.key;

      return colProps;
    },
    applyCellStyle: function(item, column, cellProps)
    {
      if (this.props.relevantSkills && this.props.relevantSkills.length > 0)
      {
        if (this.props.relevantSkills.indexOf(column.key) < 0 && column.key !== "name")
        {
          cellProps["className"] = "irrelevant-cell";
        }
      }

      return cellProps;
    },

    sortEmployees: function(a, b)
    {
      var employeeA = a.data.employee;
      var employeeB = b.data.employee;

      if (!employeeA.active && employeeB.active) return -1;
      else if (!employeeB.active && employeeA.active) return 1;
      else return 0;
    },

    render: function()
    {
      var stopBubble = function(e){e.stopPropagation();};
      var hasDeleteButton = false;

      var rows = [];
      for (var _emp in this.props.employees)
      {
        var employee = this.props.employees[_emp];

        var data: any =
        {
          name: employee.name,
          negotiation: employee.skills.negotiation,
          recruitment: employee.skills.recruitment,
          construction: employee.skills.construction,

          employee: employee
        }

        if (employee.player)
        {
          hasDeleteButton = true;
          data.del = React.DOM.a(
          {
            href: "#",
            onClick: function(player, employee)
            {
              eventManager.dispatchEvent(
              {
                type: "makeConfirmPopup",
                content:
                {
                  text: "Are you sure you want to fire " + employee.name + "?",
                  onOk: function()
                  {
                    player.employees[employee.id] = null;
                    delete player.employees[employee.id];
                  }
                }
              });
            }.bind(null, employee.player, employee)
          }, "X")
        }

        rows.push(
        {
          key: employee.id,
          data: data
        });
      }
      var columns: any =
      [
        {
          label: "Name",
          key: "name",
          sortingFunction: this.sortEmployees
        },
        {
          label: "neg",
          key: "negotiation",
          sortingFunction: this.sortEmployees,
          defaultOrder: "desc"
        },
        {
          label: "rec",
          key: "recruitment",
          sortingFunction: this.sortEmployees,
          defaultOrder: "desc"
        },
        {
          label: "con",
          key: "construction",
          sortingFunction: this.sortEmployees,
          defaultOrder: "desc"
        }
      ];

      var initialColumnIndex = 0;
      if (this.props.relevantSkills && this.props.relevantSkills.length > 0)
      {
        for (var i = 0; i < columns.length; i++)
        {
          if (columns[i].key === this.props.relevantSkills[0])
          {
            initialColumnIndex = i;
          }
        }
      }

      if (hasDeleteButton)
      {
        columns.push(
        {
          label: "fire",
          key: "del",
          notSortable: true
        })
      }

      return(

        
        UIComponents.List(
        {
          // TODO fix declaration file and remove
          // typescript qq without these
          selected: null,
          columns: null,
          sortBy: null,
          initialColumn: columns[initialColumnIndex],
          ref: "list",
          rowStylingFN: this.applyRowStyle,
          colStylingFN: this.applyColStyle,
          cellStylingFN: this.applyCellStyle,
          onRowChange: this.props.onRowChange || null, 

          listItems: rows,
          initialColumns: columns
        })
      
      );

    }
  });
}