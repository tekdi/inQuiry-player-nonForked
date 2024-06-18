export interface MtfOption {
    label: string;
    value: number;
}

export interface MtfOptions {
    left: MtfOption[];
    right: MtfOption[];
}

export interface MtfValidation {
    required: string;
}

export interface MtfResponse {
    type: string;
    options: MtfOptions;
    validation: MtfValidation;
}

export interface MtfInteractions {
    response1: MtfResponse;
}
