export interface ActionHead {
    id: number;
    author: string;
    createAtBlock: number;
}

export interface ActionBody {
    maxStake: number;
    maxRandomAccounts: number;
    whiteList: string[];
    action: string;
    consensus: string;
    verificationRule: string;
    verificationInfoGuide: string;
}

export interface ActionInfo {
    head: ActionHead;
    body: ActionBody;
}

export interface ActionSubmit {
    submitter: string;
    actionId: number;
}