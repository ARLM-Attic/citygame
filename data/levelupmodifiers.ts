/// <reference path="js/playermodifiers.d.ts" />

module levelUpModifiers
{

  export var testModifier: playerModifiers.IPlayerModifier =
  {
    type: "testModifier",
    title: "testing",
    description: "test",
    effects:
    [
      {
        targets: ["global"],
        addedProfit: 50
      },
      {
        targets: ["fastfood"],
        multiplier: 4
      }
    ]
  }

  /////////////
  // LEVEL 5 //
  /////////////

  export var fundingBoost1: playerModifiers.IPlayerModifier =
  {
    type: "fundingBoost1",
    title: "Starting capital",
    description: "+200$",
    unlockConditions:
    [
      {
        type: "level",
        value: 5
      }
    ],
    onAdd:
    {
      oneTime: true,
      effect: function(player)
      {
        player.addMoney(200)
      }
    }
  }

  export var clicksPerParking1: playerModifiers.IPlayerModifier =
  {
    type: "clicksPerParking1",
    title: "Clicks per parking",
    description: "+0.2$ / click for every parking lot",
    unlockConditions:
    [
      {
        type: "level",
        value: 5
      }
    ],
    dynamicEffect:
    {
      "parkinglot": function(player)
      {
        player.addSpecialModifier(
        {
          type: "clicksPerParking1",
          title: "Clicks per parking",
          description: "+0.2$ / click for every parking lot",
          effects:
          [
            {
              targets: ["click"],
              addedProfit: player.amountBuiltPerType["parkinglot"] * 0.2
            }
          ]
        });
      }
    }
  }

  export var clicksPerLevel1: playerModifiers.IPlayerModifier =
  {
    type: "clicksPerLevel1",
    title: "Reverse carpal tunnel syndrome",
    description: "Clicking profit * 1.02 per level",
    unlockConditions:
    [
      {
        type: "level",
        value: 5
      }
    ],
    dynamicEffect:
    {
      "level": function(player)
      {
        player.addSpecialModifier(
        {
          type: "clicksPerLevel1",
          title: "Reverse carpal tunnel syndrome",
          description: "Clicks * 1.02 per level",
          effects:
          [
            {
              targets: ["click"],
              multiplier: 1 + (player.level * 0.02)
            }
          ]
        });
      }
    }
  }

  export var increasedLevelUpModifiers1: playerModifiers.IPlayerModifier =
  {
    type: "increasedLevelUpModifiers1",
    title: "Increased knowledge",
    description: ["Choose from one extra modifier", "(if available) on subsequent level ups"],
    unlockConditions:
    [
      {
        type: "level",
        value: 5
      }
    ],
    onAdd:
    {
      oneTime: false,
      effect: function(player)
      {
        player.levelUpModifiersPerLevelUp++;
      }
    }
  }

  export var shoppingCostReduction1: playerModifiers.IPlayerModifier =
  {
    type: "shoppingCostReduction1",
    title: "Supply chain",
    description: "Shopping buildings 20% cheaper to build",
    unlockConditions:
    [
      {
        type: "level",
        value: 5
      }
    ],
    effects:
    [
      {
        targets: ["shopping"],
        buildCost:
        {
          multiplier: 0.8
        }
      }
    ]
  }

  export var parkingCostReduction1: playerModifiers.IPlayerModifier =
  {
    type: "parkingCostReduction1",
    title: "Discount asphalt",
    description: "Parking lots 35% cheaper to build",
    unlockConditions:
    [
      {
        type: "level",
        value: 5
      }
    ],
    effects:
    [
      {
        targets: ["parking"],
        buildCost:
        {
          multiplier: 0.65
        }
      }
    ]
  }

  //////////////
  // LEVEL 10 //
  //////////////

  export var fundingBoost2: playerModifiers.IPlayerModifier =
  {
    type: "fundingBoost2",
    title: "More starting capital",
    description: "+1000$",
    unlockConditions:
    [
      {
        type: "level",
        value: 10
      }
    ],
    onAdd:
    {
      oneTime: true,
      effect: function(player)
      {
        player.addMoney(1000)
      }
    }
  }

  export var america1: playerModifiers.IPlayerModifier =
  {
    type: "america1",
    title: "The American way",
    description: ["Fast food profit * 1.1 per",
    "parking lot and vice versa"],
    unlockConditions:
    [
      {
        type: "level",
        value: 10
      }
    ],
    dynamicEffect:
    {
      "parkinglot": function(player)
      {
        player.addSpecialModifier(
        {
          type: "america1_a",
          title: "The American way A",
          description: "Fast food profit * 1.1 per parking",
          effects:
          [
            {
              targets: ["fastfood"],
              multiplier: 1 + player.amountBuiltPerType["parkinglot"] * 0.1
            }
          ]
        });
      },
      "fastfood": function(player)
      {
        player.addSpecialModifier(
        {
          type: "america1_b",
          title: "The American way B",
          description: "Parking lot profit * 1.1 per fast food restaurant",
          effects:
          [
            {
              targets: ["parking"],
              multiplier: 1 + player.amountBuiltPerType["fastfood"] * 0.1
            }
          ]
        });
      }
    }
  }

  export var betterSellPrice1: playerModifiers.IPlayerModifier =
  {
    type: "betterSellPrice1",
    title: "Real estate flipping",
    description: ["Get back an additional 15% of the cost",
    "when selling buildings and land"],
    unlockConditions:
    [
      {
        type: "level",
        value: 10
      }
    ],
    onAdd:
    {
      oneTime: false,
      effect: function(player)
      {
        player.modifierEffects.sellPrice += 0.15;
      }
    }
  }

  export var increasedRecruitQuality1: playerModifiers.IPlayerModifier =
  {
    type: "increasedRecruitQuality1",
    title: "Promising talent",
    description: ["Better new recruits"],
    unlockConditions:
    [
      {
        type: "level",
        value: 10
      }
    ],
    onAdd:
    {
      oneTime: false,
      effect: function(player)
      {
        player.modifierEffects.recruitQuality += 0.25;
      }
    }
  }

  //////////////
  // LEVEL 25 //
  //////////////

  export var fundingBoost3: playerModifiers.IPlayerModifier =
  {
    type: "fundingBoost3",
    title: "External investors",
    description: "+5000$",
    unlockConditions:
    [
      {
        type: "level",
        value: 25
      }
    ],
    onAdd:
    {
      oneTime: true,
      effect: function(player)
      {
        player.addMoney(5000)
      }
    }
  }

  export var buildRush1: playerModifiers.IPlayerModifier =
  {
    type: "buildRush1",
    title: "Construction boom",
    description: "All buildings 33% cheaper for 2 minutes",
    unlockConditions:
    [
      {
        type: "level",
        value: 25
      }
    ],
    onAdd:
    {
      oneTime: true,
      effect: function(player)
      {
        player.addTimedModifier(
        {
          type: "buildRush1",
          title: "Construction boom",
          description: "All buildings 33% cheaper for 2 minutes",
          lifeTime: 1000 * 120,
          effects:
          [
            {
              targets: ["global"],
              buildCost:
              {
                multiplier: 0.666
              }
            }
          ]
        })
      }
    }
  }

  export var buyRush1: playerModifiers.IPlayerModifier =
  {
    type: "buyRush1",
    title: "Land grab",
    description: "Buying plots 50% cheaper for 2 minutes",
    unlockConditions:
    [
      {
        type: "level",
        value: 25
      }
    ],
    onAdd:
    {
      oneTime: true,
      effect: function(player)
      {
        player.addTimedModifier(
        {
          type: "buildRush1",
          title: "Land grab",
          description: "Buying plots 50% cheaper for 2 minutes",
          lifeTime: 1000 * 120,
          effects:
          [
            {
              targets: ["global"],
              buyCost:
              {
                multiplier: 0.5
              }
            }
          ]
        })
      }
    }
  }

  //////////////
  // LEVEL 50 //
  //////////////
  
  export var increasedRecruitQuality2: playerModifiers.IPlayerModifier =
  {
    type: "increasedRecruitQuality2",
    title: "Talent scouts",
    description: "Significantly better recruits",
    unlockConditions:
    [
      {
        type: "level",
        value: 50
      }
    ],
    onAdd:
    {
      oneTime: false,
      effect: function(player)
      {
        player.modifierEffects.recruitQuality += 0.75;
      }
    }
  }

  export var modifiersByUnlock = (function()
  {
    var base: any = {};

    for (var _mod in levelUpModifiers)
    {
      var modifier = levelUpModifiers[_mod]
      if (modifier.unlockConditions)
      {
        for (var i = 0; i < modifier.unlockConditions.length; i++)
        {
          var condition = modifier.unlockConditions[i];

          if (condition === "default")
          {
            if (!base.default) base.default = [];
            base.default.push(modifier);
            continue;
          }

          if (!base[condition.type]) base[condition.type] = {};

          if (!base[condition.type][condition.value])
          {
            base[condition.type][condition.value] = [];
          }

          base[condition.type][condition.value].push(modifier);
        }
      }
    }
    return base;
  })();


  export var allModifiers = (function()
  {
    var all = [];
    for (var _mod in levelUpModifiers)
    {
      if (levelUpModifiers[_mod].type)
      {
        all.push(levelUpModifiers[_mod]);
      }
    }
    return all;
  })();
}