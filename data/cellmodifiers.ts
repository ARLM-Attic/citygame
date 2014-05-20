/// <reference path="../src/js/arraylogic.d.ts" />

module cellModifiers
{
  export function niceEnviroment(range: number = 1, strength: number = 1)
  {
    return(
    {
      type: "niceEnviroment",
      translate: "Nice enviroment",
      range: range,
      strength: strength,
      targets: ["apartment"],
      effect:
      {
        multiplier: 0.25
      }
    });
  }

  export function crowded(range: number = 1, strength: number = 1)
  {
    return(
    {
      type: "crowded",
      translate: "Crowded",
      range: range,
      strength: strength,
      targets: ["apartment"],
      effect:
      {
        addedProfit: -0.1,
        multiplier: -0.15
      }
    });
  }

  export function population(range: number = 1, strength: number = 1)
  {
    return(
    {
      type: "population",
      translate: "Nearby customers",
      range: range,
      strength: strength,
      targets: ["fastfood"],
      effect:
      {
        addedProfit: 0.1,
      },
      scaling: function(strength)
      {
        return strength;
      }
    });
  }

  export function fastfoodCompetition(range: number = 1, strength: number = 1)
  {
    return(
    {
      type: "fastfoodCompetition",
      translate: "Competing restaurants",
      range: range,
      strength: strength,
      targets: ["fastfood"],
      effect:
      {
        addedProfit: -0.2,
        multiplier: -0.35,
      }
    });
  }
}