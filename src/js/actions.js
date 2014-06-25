/// <reference path="js/employee.d.ts" />
/// <reference path="js/player.d.ts" />
/// <reference path="js/utility.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/spriteblinker.d.ts" />
///
var actions;
(function (actions) {
    var blinkerTODO = new Blinker(600, 0x880055, -1, false);

    function buyCell(props) {
        // TODO circular reference
        var _ = window;
        var game = _.game;

        var cell = game.getCell(props);
        var player = game.players[props.playerId];

        if (!cell || !player)
            throw new Error();

        var employee = player.employees[props.employeeId];
        var data = Object.create(props);

        if (data.finishedOn === undefined) {
            data.time = getActionTime([employee.skills["negotiation"]], 14).approximate;
        }

        var price = player.getCellBuyCost(cell);
        price = getActionCost([employee.skills["negotiation"]], price).actual;

        var onStartFN = function () {
            player.ownedCellsAmount++;
            employee.active = false;
            employee.currAction = "buyCell";
            player.addMoney(-price);
        };
        var onCompleteFN = function () {
            player.ownedCellsAmount--;
            employee.active = true;
            employee.currAction = undefined;
            employee.trainSkill("negotiation");
            player.addCell(cell);

            eventManager.dispatchEvent({ type: "updateWorld", content: "" });
            return true;
        };

        onStartFN.call(null);

        eventManager.dispatchEvent({
            type: "delayedAction",
            content: {
                type: "buyCell",
                data: data,
                onComplete: onCompleteFN
            }
        });
    }
    actions.buyCell = buyCell;
    ;

    function recruitEmployee(player, employee) {
        employee.active = false;
        employee.currentAction = "recruit";

        var actionTime = getActionTime([employee.skills["recruitment"]], 14);

        var employeeCount = getSkillAdjust([employee.skills["recruitment"]], 4, function employeeCountAdjustFN(avgSkill) {
            return 1 / (1.5 / Math.log(avgSkill + 1));
        }, 0.33);

        if (!employee.player)
            throw new Error("No player on employee");
        var adjustedSkill = employee.skills["recruitment"] * employee.player.modifierEffects.recruitQuality;

        var newEmployees = makeNewEmployees(employeeCount.actual, adjustedSkill);

        var recruitCompleteFN = function () {
            eventManager.dispatchEvent({
                type: "makeRecruitCompletePopup",
                content: {
                    player: player,
                    employees: newEmployees,
                    text: [
                        employee.name + " was able to scout the following people.",
                        "Which one should we recruit?"],
                    recruitingEmployee: employee
                }
            });
        };
        eventManager.dispatchEvent({
            type: "delayedAction", content: {
                time: actionTime["actual"],
                onComplete: recruitCompleteFN
            }
        });
    }
    actions.recruitEmployee = recruitEmployee;

    function constructBuilding(props) {
        var player = props.player;
        var cell = props.cell;
        var building = props.building;
        var employee = props.employee;

        var baseCost = player.getBuildCost(building);
        var adjustedCost = getActionCost([employee.skills["construction"]], baseCost).actual;

        if (player.money < adjustedCost)
            return;

        var size = building.size || [1, 1];
        var endX = cell.gridPos[0] + size[0] - 1;
        var endY = cell.gridPos[1] + size[1] - 1;

        var buildArea = cell.board.getCells(rectSelect(cell.gridPos, [endX, endY]));

        player.addMoney(-adjustedCost, "buildingCost");

        employee.active = false;
        employee.currentAction = "constructBuilding";
        var blinkerId = blinkerTODO.idGenerator++;

        var actionTime = getActionTime([employee.skills["construction"]], building.buildTime);

        for (var i = 0; i < buildArea.length; i++) {
            buildArea[i].changeContent(cg.content.underConstruction, true);
        }
        eventManager.dispatchEvent({ type: "updateWorld", content: "" });

        var constructBuildingConfirmFN = function () {
            blinkerTODO.removeCells(blinkerId);
            employee.trainSkill("construction");

            cell.changeContent(building, true, player);
            eventManager.dispatchEvent({ type: "updateLandValueMapmode", content: "" });
            eventManager.dispatchEvent({ type: "updateWorld", content: "" });
        };
        var constructBuildingCompleteFN = function () {
            blinkerTODO.addCells(buildArea, blinkerId);
            blinkerTODO.start();

            employee.active = true;
            employee.currentAction = undefined;

            window.setTimeout(constructBuildingConfirmFN, 1000);
        };

        eventManager.dispatchEvent({
            type: "delayedAction", content: {
                time: actionTime["actual"],
                onComplete: constructBuildingCompleteFN
            }
        });
    }
    actions.constructBuilding = constructBuilding;

    function getSkillAdjust(skills, base, adjustFN, variance) {
        var avgSkill = skills.reduce(function (a, b) {
            return a + b;
        }) / skills.length;
        var workRate = adjustFN ? adjustFN(avgSkill) : Math.pow(1 - 0.166904 * Math.log(avgSkill), 1 / 2.5);

        var approximate = Math.round(base * workRate);
        var actual = Math.round(approximate + randRange(-base * variance, base * variance));

        return ({
            approximate: approximate,
            actual: actual < 1 ? 1 : actual
        });
    }
    function getActionTime(skills, base) {
        return getSkillAdjust(skills, base, null, 0.25);
    }
    actions.getActionTime = getActionTime;

    function getActionCost(skills, base) {
        return getSkillAdjust(skills, base, null, 0);
    }
    actions.getActionCost = getActionCost;
})(actions || (actions = {}));
//# sourceMappingURL=actions.js.map
