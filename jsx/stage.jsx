/** @jsx React.DOM */
/*jshint ignore:start */

var UIComponents = UIComponents || {};

UIComponents.Stage = React.createClass(
{
  getDefaultProps: function()
  {
    return
    {
      popupIdGenerator: 0
    }
  },

  newEmployeePopup: function(employees)
  {
    var el = <UIComponents.EmployeeList employees={employees}/>;
    var popup = <UIComponents.Popup content={el} key={this.props.popupIdGenerator++} />;
    this.props.popups.push(popup);
  },

  render: function()
  {
    var popups = [];
    var self = this;
    this.props.popups.forEach(function(popup)
    {
      popups.push(popup);
    });
    return(
      <div id="react-container">
        {popups}
      </div>
    );
  }
});



var EMPLOYEES =
[
  {
    id: "employee1",
    name: "UNDEFINED",
    skills:
    {
      neg: -1,
      man: -1,
      rec: -1,
      con: -1
    }
  },
  {
    id: "employee2",
    name: "UNDEFINED",
    skills:
    {
      neg: -1,
      man: -1,
      rec: -1,
      con: -1
    }
  }
];

document.getElementById("popupBtn").addEventListener('click',
  function()
  {
    newPopup(EMPLOYEES);
  });


var popuplist = [];
var popupIdGenerator = 0;


function newPopup(_employees)
{
  var el = UIComponents.EmployeeList({employees: _employees});
  var popup = Popup (
    {
      content: el,
      okText: "ok",
      closeText: "close",
      key: popupIdGenerator++,

    });
  popuplist.push(popup);
  updateReact();
}

function destroyPopup(key)
{
  popuplist = popuplist.filter(function(popup)
  {
    return popup.props.key !== key;
  });

  updateReact();
}

function updateReact()
{
  React.renderComponent(
    <UIComponents.Stage popups={popuplist}/>,
    document.getElementById("pixi-container")
  );
}

updateReact();