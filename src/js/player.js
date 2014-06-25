/// <reference path="../lib/pixi.d.ts" />
/// <reference path="js/employee.d.ts" />
/// <reference path="../data/js/cg.d.ts" />
/// <reference path="../data/js/playermodifiers.d.ts" />
/// <reference path="../data/js/levelupmodifiers.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/utility.d.ts" />
var Player = (function () {
    function Player(id, color) {
        if (typeof color === "undefined") { color = 0xFF0000; }
        this.money = 0;
        this.clicks = 0;
        this.level = 1;
        this.experience = 0;
        this.experienceForCurrentLevel = 0;
        this.experienceToNextLevel = 0;
        this.ownedContent = {};
        this.amountBuiltPerType = {};
        this.ownedCells = {};
        this.employees = {};
        this.usedInitialRecruit = false;
        this.incomePerDate = {};
        this.incomePerType = {};
        this.modifiers = {};
        this.dynamicModifiers = {};
        this.timedModifiers = {};
        this.levelUpModifiers = {};
        this.specialModifiers = {};
        this.modifierEffects = {
            profit: {},
            buildCost: {},
            buyCost: {},
            recruitQuality: 1,
            sellPrice: 0.5
        };
        this.unlockedModifiers = [];
        this.lockedModifiers = [];
        this.unlockedLevelUpModifiers = {};
        this.levelUpModifiersPerLevelUp = 4;
        this.levelsAlreadyPicked = {};
        this.recentlyCheckedUnlockConditions = {};
        this.maxCheckFrequency = 1000;
        this.indexedProfits = {};
        this.id = id;
        this.color = color;
        this.init();
        this.updateElements();
    }
    Player.prototype.updateElements = function () {
        var beautified = beautify(this.money) + "$";
        var expBeautifyIndex = this.experienceToNextLevel > 999999 ? 2 : 0;

        eventManager.dispatchEvent({ type: "updatePlayerMoney", content: beautified });
        eventManager.dispatchEvent({
            type: "updatePlayerExp",
            content: {
                experience: beautify(this.experience, expBeautifyIndex),
                nextLevel: beautify(this.experienceToNextLevel, expBeautifyIndex),
                level: this.level,
                percentage: this.getExperiencePercentage()
            }
        });
    };
    Player.prototype.init = function () {
        for (var building in cg.content.buildings) {
            var type = cg.content.buildings[building];

            if (!this.ownedContent[type.categoryType]) {
                this.ownedContent[type.categoryType] = [];
            }
            if (this.amountBuiltPerType[type.type] === undefined) {
                this.amountBuiltPerType[type.type] = 0;
            }
            if (this.incomePerType[type.categoryType] === undefined) {
                this.incomePerType[type.categoryType] = 0;
            }

            this.modifierEffects.profit[type.categoryType] = {
                addedProfit: 0,
                multiplier: 1
            };
            this.modifierEffects.buildCost[type.categoryType] = {
                addedCost: 0,
                multiplier: 1
            };
        }
        this.modifierEffects.profit["global"] = {
            addedProfit: 0,
            multiplier: 1
        };
        this.modifierEffects.buildCost["global"] = {
            addedCost: 0,
            multiplier: 1
        };
        this.modifierEffects.buyCost["global"] = {
            addedCost: 0,
            multiplier: 1
        };
        this.modifierEffects.profit["click"] = {
            addedProfit: 1,
            multiplier: 1
        };

        this.setExperienceToNextLevel();
        this.setInitialAvailableModifiers();
    };
    Player.prototype.addEventListeners = function () {
    };

    Player.prototype.addEmployee = function (employee) {
        this.employees[employee.id] = employee;
        employee.player = this;
    };
    Player.prototype.getEmployees = function () {
        var employees = [];
        for (var employee in this.employees) {
            employees.push(this.employees[employee]);
        }
        ;

        return employees;
    };
    Player.prototype.getActiveEmployees = function () {
        var active = [];
        for (var employee in this.employees) {
            if (employee.active !== false)
                active.push(this.employees[employee]);
        }
        ;

        return active;
    };

    Player.prototype.addCell = function (cell) {
        if (!this.ownedCells[cell.gridPos]) {
            this.ownedCells[cell.gridPos] = cell;

            cell.player = this;
            cell.addOverlay(this.color);
        }
    };
    Player.prototype.removeCell = function (cell) {
        if (this.ownedCells[cell.gridPos]) {
            if (cell.overlay)
                cell.removeOverlay();

            delete this.ownedCells[cell.gridPos];
            cell.player = null;
        }
    };
    Player.prototype.sellCell = function (cell) {
        var value = this.getCellBuyCost(cell.landValue) * this.modifierEffects.sellPrice;

        this.addMoney(value, "sell");
        this.removeCell(cell);
    };
    Player.prototype.addContent = function (content) {
        // for trees etc.
        if (!this.ownedContent[content.categoryType])
            return;

        this.ownedContent[content.categoryType].push(content);
        this.amountBuiltPerType[content.type.type]++;
        this.checkLockedModifiers(content.type.type);
        content.player = this;

        this.updateDynamicModifiers(content.type.type);
    };
    Player.prototype.removeContent = function (content) {
        this.ownedContent[content.categoryType] = this.ownedContent[content.categoryType].filter(function (building) {
            return building.id !== content.id;
        });

        this.amountBuiltPerType[content.type.type]--;

        this.updateDynamicModifiers(content.type.type);
    };
    Player.prototype.sellContent = function (content) {
        var type = content.type;
        if (!type.cost)
            return;
        if (!content.player || content.player.id !== this.id)
            return;

        var value = this.getBuildCost(type) * this.modifierEffects.sellPrice;

        this.addMoney(value, "sell");
    };
    Player.prototype.addMoney = function (initialAmount, incomeType, daysPerTick, date) {
        var amount = this.getIndexedProfit(incomeType, initialAmount);

        if (amount > 0 && incomeType !== "sell" && incomeType !== "initial") {
            if (daysPerTick)
                amount *= daysPerTick;

            this.addExperience(amount);
        }

        if (incomeType) {
            if (this.incomePerType[incomeType] === undefined) {
                this.incomePerType[incomeType] = 0;
            }

            this.incomePerType[incomeType] += amount;
        }
        if (date) {
            this.incomePerDate[date.year] = this.incomePerDate[date.year] || { total: 0 };
            var _y = this.incomePerDate[date.year];
            _y.total += amount;

            _y[date.month] = _y[date.month] || { total: 0 };
            var _m = _y[date.month];
            _m.total += amount;

            _m[date.day] ? _m[date.day] += amount : _m[date.day] = amount;
        }

        if (!isFinite(amount))
            throw new Error("Infinite amount of money added");
        this.money += amount;
        this.checkLockedModifiers("money");
        this.updateElements();

        return amount;
    };
    Player.prototype.addModifier = function (modifier, collection, firstTime) {
        if (typeof collection === "undefined") { collection = "modifiers"; }
        if (typeof firstTime === "undefined") { firstTime = true; }
        if (this[collection][modifier.type])
            return;
        if (firstTime) {
            if (modifier.cost && modifier.cost > this.money)
                return;

            if (modifier.cost) {
                this.addMoney(-modifier.cost);
            }
        }

        var index = this.unlockedModifiers.indexOf(modifier);
         {
            if (index > -1) {
                this.unlockedModifiers.splice(index, 1);
            }
        }
        this[collection][modifier.type] = Object.create(modifier);

        if (modifier.effects) {
            this.applyModifier(modifier);
        }
        if (modifier.onAdd) {
            if (!modifier.onAdd.oneTime || firstTime === true) {
                modifier.onAdd.effect.call(null, this);
            }
        }
        if (modifier.dynamicEffect) {
            this.addDynamicModifier(modifier);
        }
    };
    Player.prototype.addSpecialModifier = function (modifier) {
        if (this.specialModifiers[modifier.type]) {
            this.removeModifier(this.specialModifiers[modifier.type], "specialModifiers");
        }
        this.addModifier(modifier, "specialModifiers");
    };
    Player.prototype.addTimedModifier = function (modifier) {
        if (!modifier.lifeTime) {
            throw new Error("Timed modifier" + modifier.type + "has no life time set");
        }
        if (this.timedModifiers[modifier.type]) {
            window.clearTimeout(this.timedModifiers[modifier.type]);
        }

        var removeTimedModifierFN = function () {
            this.removeModifier(this.specialModifiers[modifier.type], "specialModifiers");
            window.clearTimeout(this.timedModifiers[modifier.type]);
        }.bind(this);

        this.timedModifiers[modifier.type] = window.setTimeout(removeTimedModifierFN, modifier.lifeTime);

        this.addSpecialModifier(modifier);
    };
    Player.prototype.addDynamicModifier = function (sourceModifier) {
        for (var condition in sourceModifier.dynamicEffect) {
            var modifier = sourceModifier.dynamicEffect[condition];

            if (!this.dynamicModifiers[condition]) {
                this.dynamicModifiers[condition] = {};
            }

            this.dynamicModifiers[condition][sourceModifier.type] = modifier;

            this.updateDynamicModifiers(condition);
        }
    };
    Player.prototype.applyModifier = function (modifier) {
        for (var ii = 0; ii < modifier.effects.length; ii++) {
            var effect = modifier.effects[ii];

            for (var jj = 0; jj < effect.targets.length; jj++) {
                var type = effect.targets[jj];

                if (effect.addedProfit) {
                    this.modifierEffects.profit[type].addedProfit += effect.addedProfit;
                }
                if (effect.multiplier) {
                    this.modifierEffects.profit[type].multiplier *= effect.multiplier;
                }
                if (effect.buildCost) {
                    if (effect.buildCost.addedProfit) {
                        this.modifierEffects.buildCost[type].addedCost += effect.buildCost.addedCost;
                    }
                    if (effect.buildCost.multiplier) {
                        this.modifierEffects.buildCost[type].multiplier *= effect.buildCost.multiplier;
                    }
                }
                if (effect.buyCost) {
                    if (effect.buyCost.addedProfit) {
                        this.modifierEffects.buyCost.addedCost += effect.buyCost.addedCost;
                    }
                    if (effect.buyCost.multiplier) {
                        this.modifierEffects.buyCost.multiplier *= effect.buyCost.multiplier;
                    }
                }
                this.clearIndexedProfits();
            }
        }
    };
    Player.prototype.applyAllModifiers = function () {
        for (var _modifier in this.modifiers) {
            this.applyModifier(this.modifiers[_modifier]);
        }
        ;
    };
    Player.prototype.removeModifier = function (modifier, collection) {
        if (typeof collection === "undefined") { collection = "modifiers"; }
        if (!this[collection][modifier.type]) {
            console.warn("Modifier ", modifier, " does not exist on player ", this);
            return;
        }

        for (var ii = 0; ii < modifier.effects.length; ii++) {
            var effect = modifier.effects[ii];

            for (var jj = 0; jj < effect.targets.length; jj++) {
                var type = effect.targets[jj];

                if (effect.addedProfit) {
                    this.modifierEffects.profit[type].addedProfit -= effect.addedProfit;
                }
                if (effect.multiplier) {
                    this.modifierEffects.profit[type].multiplier *= (1 / effect.multiplier);
                }
                if (effect.buildCost) {
                    if (effect.buildCost.addedProfit) {
                        this.modifierEffects.buildCost[type].addedCost -= effect.buildCost.addedCost;
                    }
                    if (effect.buildCost.multiplier) {
                        this.modifierEffects.buildCost[type].multiplier *= (1 / effect.buildCost.multiplier);
                    }
                }
                if (effect.buycost) {
                    if (effect.buycost.addedProfit) {
                        this.modifierEffects.buyCost.addedCost -= effect.buycost.addedCost;
                    }
                    if (effect.buycost.multiplier) {
                        this.modifierEffects.buyCost.multiplier *= (1 / effect.buycost.multiplier);
                    }
                }
                this.clearIndexedProfits();
            }
        }

        this[collection][modifier.type] = null;
        delete this.modifiers[modifier.type];
    };
    Player.prototype.getBuildCost = function (type) {
        var cost = type.cost;
        var alreadyBuilt = this.amountBuiltPerType[type.type];

        cost += this.modifierEffects.buildCost[type.categoryType].addedCost;
        cost += this.modifierEffects.buildCost["global"].addedCost;

        cost *= this.modifierEffects.buildCost[type.categoryType].multiplier;
        cost *= this.modifierEffects.buildCost["global"].multiplier;

        cost *= Math.pow(1.5, alreadyBuilt);

        return Math.round(cost);
    };
    Player.prototype.getCellBuyCost = function (baseCost) {
        var adjusted = baseCost * Math.pow(1.15, Object.keys(this.ownedCells).length);

        adjusted += this.modifierEffects.buyCost["global"].addedCost;
        adjusted *= this.modifierEffects.buyCost["global"].multiplier;

        return adjusted;
    };
    Player.prototype.addExperience = function (amount) {
        this.experience += amount;

        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    };
    Player.prototype.levelUp = function (callSize) {
        if (typeof callSize === "undefined") { callSize = 0; }
        this.level++;
        this.setExperienceToNextLevel();
        this.unlockLevelUpModifiers(this.level);
        this.updateDynamicModifiers("level");

        if (this.experience >= this.experienceToNextLevel) {
            if (callSize > 101) {
                throw new Error();
                return;
            }
            this.levelUp(callSize++);
        }
    };
    Player.prototype.getExperienceForLevel = function (level) {
        if (level <= 0)
            return 0;
        else {
            return Math.round(100 * Math.pow(1.1, level - 1));
        }
    };
    Player.prototype.setExperienceToNextLevel = function () {
        this.experienceForCurrentLevel = this.experienceToNextLevel;
        this.experienceToNextLevel += this.getExperienceForLevel(this.level);
    };
    Player.prototype.getExperiencePercentage = function () {
        var current = this.experience - this.experienceForCurrentLevel;

        return Math.floor(100 * (current / this.getExperienceForLevel(this.level)));
    };
    Player.prototype.getModifiedProfit = function (initialAmount, type) {
        var amount = initialAmount;

        amount += this.modifierEffects.profit["global"].addedProfit;

        if (type) {
            if (this.modifierEffects.profit[type]) {
                amount += this.modifierEffects.profit[type].addedProfit;
                amount *= this.modifierEffects.profit[type].multiplier;
            }
        }
        amount *= this.modifierEffects.profit["global"].multiplier;

        if (initialAmount > 0 && amount < 0)
            amount = 0;

        return amount;
    };
    Player.prototype.getIndexedProfit = function (type, amount) {
        if (!this.indexedProfits[type])
            this.indexedProfits[type] = {};

        if (!this.indexedProfits[type][amount]) {
            this.indexedProfits[type][amount] = this.getModifiedProfit(amount, type);
        }

        return this.indexedProfits[type][amount];
    };
    Player.prototype.clearIndexedProfits = function () {
        this.indexedProfits = {};
    };
    Player.prototype.getUnlockConditionVariable = function (conditionType) {
        if (["clicks", "money", "level"].indexOf(conditionType) !== -1) {
            return this[conditionType];
        } else if (this.amountBuiltPerType[conditionType] !== undefined) {
            return this.amountBuiltPerType[conditionType];
        }
    };
    Player.prototype.checkIfUnlocked = function (modifier) {
        if (!modifier.unlockConditions)
            return false;

        var unlocked = true;

        for (var i = 0; i < modifier.unlockConditions.length; i++) {
            var condition = modifier.unlockConditions[i];

            var toCheckAgainst = this.getUnlockConditionVariable(condition.type);

            if (toCheckAgainst < condition.value)
                unlocked = false;
        }
        return unlocked;
    };
    Player.prototype.setInitialAvailableModifiers = function () {
        var allModifiers = playerModifiers.allModifiers;
        this.lockedModifiers = allModifiers.slice(0);
        this.unlockedModifiers = [];

        for (var i = 0; i < this.lockedModifiers.length; i++) {
            var mod = this.lockedModifiers[i];

            if (this.checkIfUnlocked(mod)) {
                this.unlockModifier(mod);
            }
        }
    };
    Player.prototype.checkLockedModifiers = function (conditionType) {
        var unlocks = playerModifiers.modifiersByUnlock[conditionType];
        if (!unlocks)
            return;

        if (this.recentlyCheckedUnlockConditions[conditionType]) {
            return;
        } else {
            this.recentlyCheckedUnlockConditions[conditionType] = true;
            window.setTimeout(function () {
                this.recentlyCheckedUnlockConditions[conditionType] = false;
            }.bind(this), this.maxCheckFrequency);
        }

        var unlockValues = Object.keys(unlocks);

        for (var i = 0; i < unlockValues.length; i++) {
            var toCheckAgainst = this.getUnlockConditionVariable(conditionType);

            if (toCheckAgainst >= parseInt(unlockValues[i])) {
                var modifiers = unlocks[unlockValues[i]];
                for (var j = 0; j < modifiers.length; j++) {
                    if (this.modifiers[modifiers[j].type])
                        continue;
                    else if (this.unlockedModifiers.indexOf(modifiers[j]) > -1)
                        continue;

                    var unlocked = this.checkIfUnlocked(modifiers[j]);

                    if (unlocked) {
                        this.unlockModifier(modifiers[j]);
                    }
                }
            }
        }
    };
    Player.prototype.unlockModifier = function (modifier) {
        if (!this.modifiers[modifier.type] && this.unlockedModifiers.indexOf(modifier) <= -1) {
            this.unlockedModifiers.push(modifier);
        }

        var index = this.lockedModifiers.indexOf(modifier);
        if (index > -1)
            this.lockedModifiers.splice(index, 1);
    };
    Player.prototype.updateDynamicModifiers = function (conditionType) {
        for (var _mod in this.dynamicModifiers[conditionType]) {
            var dynamicEffect = this.dynamicModifiers[conditionType][_mod];
            dynamicEffect.call(null, this);
        }
    };
    Player.prototype.addClicks = function (amount) {
        this.clicks += amount;
        this.checkLockedModifiers("clicks");
    };
    Player.prototype.unlockLevelUpModifiers = function (level) {
        if (!levelUpModifiers.modifiersByUnlock.level[level])
            return;

        var modifiersForThisLevel = levelUpModifiers.modifiersByUnlock.level[level].slice(0);

        if (this.unlockedLevelUpModifiers[level])
            return;
        else if (this.levelsAlreadyPicked[level])
            return;

        if (this.levelUpModifiers[level]) {
            modifiersForThisLevel = modifiersForThisLevel.filter(function (mod) {
                return this.levelUpModifiers[level].indexOf(modifiersForThisLevel) > -1;
            });
        }

        var toUnlock = [];

        if (modifiersForThisLevel.length <= this.levelUpModifiersPerLevelUp) {
            for (var _mod in modifiersForThisLevel) {
                toUnlock.push(modifiersForThisLevel[_mod]);
            }
        } else {
            for (var i = 0; i < this.levelUpModifiersPerLevelUp; i++) {
                if (modifiersForThisLevel.length < 1)
                    break;

                var indexToAdd = randInt(0, modifiersForThisLevel.length - 1);
                var toAdd = modifiersForThisLevel.splice(indexToAdd, 1);

                toUnlock.push(toAdd[0]);
            }
        }

        this.unlockedLevelUpModifiers[level] = toUnlock;
    };
    Player.prototype.addLevelUpModifier = function (modifier, preventMultiplePerLevel, firstTime) {
        if (typeof preventMultiplePerLevel === "undefined") { preventMultiplePerLevel = true; }
        if (typeof firstTime === "undefined") { firstTime = true; }
        var level = modifier.unlockConditions[0].value;

        if (preventMultiplePerLevel && this.levelsAlreadyPicked[level])
            return false;

        this.addModifier(modifier, "levelUpModifiers", firstTime);

        this.unlockedLevelUpModifiers[level] = null;
        delete this.unlockedLevelUpModifiers[level];

        this.levelsAlreadyPicked[level] = true;
    };
    return Player;
})();
//# sourceMappingURL=player.js.map
