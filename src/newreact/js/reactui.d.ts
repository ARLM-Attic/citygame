/// <reference path="../../../lib/react.d.ts" />
/// <reference path="../../../lib/pixi.d.ts" />
/// <reference path="../../js/player.d.ts" />
/// <reference path="../../js/actions.d.ts" />
/// <reference path="../../js/eventlistener.d.ts" />
/// <reference path="employeelist.d.ts" />
/// <reference path="employee.d.ts" />
/// <reference path="employeeaction.d.ts" />
/// <reference path="employeeactionpopup.d.ts" />
/// <reference path="actioninfo.d.ts" />
/// <reference path="stage.d.ts" />
declare class ReactUI {
    public idGenerator: number;
    public popups: {
        [id: number]: {
            type: string;
            props: any;
        };
    };
    public topZIndex: number;
    public stage: any;
    public player: Player;
    constructor(player: Player);
    public init(): void;
    public addEventListeners(): void;
    public makeEmployeeActionPopup(props: {
        employees?: {
            [key: string]: Employee;
        };
        player?: Player;
        text?: any;
        onOk?: any;
        okBtnText?: string;
        onClose?: any;
        closeBtnText?: string;
        relevantSkills?: string[];
        action?: any;
    }): void;
    public makeRecruitPopup(props: {
        player: Player;
    }): void;
    public makeRecruitCompletePopup(props: {
        recruitingEmployee?: Employee;
        employees: {
            [key: string]: Employee;
        };
        player: Player;
        text: any;
    }): void;
    public incrementZIndex(): number;
    public destroyPopup(key: any, callback: any): void;
    public updateReact(): void;
}
