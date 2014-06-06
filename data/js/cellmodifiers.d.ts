/// <reference path="../../src/js/arraylogic.d.ts" />
declare module cellModifiers {
    function niceEnviroment(range: number, strength?: number): {
        type: string;
        translate: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            multiplier: number;
        };
        landValue: {
            radius: number;
            multiplier: number;
            falloffFN: (distance: any, invertedDistance: any) => number;
        };
    };
    function crowded(range: number, strength?: number): {
        type: string;
        translate: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
            multiplier: number;
        };
    };
    function population(range: number, strength?: number): {
        type: string;
        translate: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
        };
        scaling: (strength: any) => any;
        landValue: {
            radius: number;
            multiplier: number;
        };
    };
    function fastfoodCompetition(range: number, strength?: number): {
        type: string;
        translate: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
            multiplier: number;
        };
    };
    function shoppingCompetition(range: number, strength?: number): {
        type: string;
        translate: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
            multiplier: number;
        };
    };
    function nearbyShopping(range: number, strength?: number): {
        type: string;
        translate: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
        };
    };
    function nearbyStation(range: number, strength?: number): {
        type: string;
        translate: string;
        range: number;
        strength: number;
        targets: string[];
        effect: {
            addedProfit: number;
            multiplier: number;
        };
        landValue: {
            radius: number;
            multiplier: number;
            falloffFN: (distance: any, invertedDistance: any) => number;
        };
    };
}
