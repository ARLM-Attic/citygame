/// <reference path="js/employee.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/spriteblinker.d.ts" />
/// 
module actions
{
  var blinkerTODO = new Blinker(600, 0x880055, -1, false);

  export function buyCell( player: Player, cell, employee: Employee )
  {
    employee.active = false;
    employee.currentAction = "buyCell";
    var blinkerIdTODO = blinkerTODO.idGenerator++;

    var actionTime = getActionTime([employee.skills["negotiation"]], 14);
    var price = getActionCost([employee.skills["negotiation"]], cell.landValue).actual;

    var buyCellConfirmFN = function()
    {
      blinkerTODO.removeCells(blinkerIdTODO);
      employee.active = true;
      employee.currentAction = undefined;
      employee.trainSkill("negotiation");
      if (player.money < price)
      {
        eventManager.dispatchEvent(
        {
          type: "makeInfoPopup",
          content:
          {
            text: [
            "Not enough funds",
            "",
            "Build some houses to get cash",
            "(They're free for now)"]
          }
        })
        return false;
      }

      else
      {
        player.addCell(cell);
        player.addMoney(-price);
        cell.sprite.tint = 0xFF0000;
        eventManager.dispatchEvent({type: "updateWorld", content: ""});

        return true
      }

    }.bind(this);

    var buyCellCancelFN = function()
    {
      blinkerTODO.removeCells(blinkerIdTODO);
      employee.active = true;
      employee.currentAction = undefined;
    }.bind(this);

    var onCompleteText = "Buy plot for " + price + "$?";

    var completeFN = function()
    {
      blinkerTODO.addCells([cell], blinkerIdTODO);
      blinkerTODO.start();
      eventManager.dispatchEvent(
      {
        type: "makeConfirmPopup",
        content:
        {
          text: onCompleteText,
          onOk: buyCellConfirmFN,
          onClose: buyCellCancelFN
        }
      })

    };

    eventManager.dispatchEvent({type: "updateWorld", content:""});
    eventManager.dispatchEvent({type: "delayedAction", content:
      {
        time: actionTime["actual"],
        onComplete: completeFN
      }
    });
  }
  export function recruitEmployee(player: Player, employee: Employee)
  {
    employee.active = false;
    employee.currentAction = "recruit";

    var actionTime = getActionTime([employee.skills["recruitment"]], 14);

    var employeeCount = getSkillAdjust(
      [employee.skills["recruitment"]],
      2,
      function employeeCountAdjustFN(avgSkill){return 1 / (1.5 / Math.log(avgSkill + 1))},
      0.33);

    var newEmployees = makeNewEmployees(employeeCount.actual, employee.skills["recruitment"]);

    var onConfirmFN = function()
    {
      employee.active = true;
      employee.currentAction = undefined;
      employee.trainSkill("recruitment");
    }

    var recruitCompleteFN = function()
    {
      eventManager.dispatchEvent(
      {
        type: "makeRecruitCompletePopup",
        content:
        {
          player: player,
          employees: newEmployees,
          text: [employee.name + " was able to scout the following people.",
          "Which one should we recruit?"],
          recruitingEmployee: employee
        }
      })
    }
    eventManager.dispatchEvent({type: "delayedAction", content:
      {
        time: actionTime["actual"],
        onComplete: recruitCompleteFN
      }
    });
  }
  function getSkillAdjust( skills: number[], base: number, adjustFN, variance: number)
  {
    var avgSkill = skills.reduce(function(a, b){return a+b}) / skills.length;
    var workRate = adjustFN ? adjustFN(avgSkill) : 2 / Math.log(avgSkill + 1);
    
    var approximate = Math.round(base * workRate);
    var actual = Math.round(approximate +
      randRange(-base * variance, base * variance) );

    return(
    {
      approximate: approximate,
      actual: actual < 1 ? 1 : actual
    });
  }
  export function getActionTime( skills: number[], base: number )
  {
    return getSkillAdjust(
      skills,
      base,
      function actionTimeAdjustFN(avgSkill){return 2 / Math.log(avgSkill + 1);},
      0.25
    );
  }

  export function getActionCost( skills: number[], base: number )
  {
    return getSkillAdjust(
      skills,
      base,
      function actionCostAdjustFN(avgSkill){return 2 / Math.log(avgSkill + 3);},
      0.25
    );
  }
}
