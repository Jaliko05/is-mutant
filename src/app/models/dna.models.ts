export type DnaBase = 'A' | 'T' | 'C' | 'G';


export enum SequenceDirection {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
    DIAGONAL_RIGHT = 'diagonal_right',
    DIAGONAL_LEFT = 'diagonal_left'
}


export interface Position {
    row: number;
    col: number;
}


export interface SequenceMatch {

    base: DnaBase;
    direction: SequenceDirection;
    startPosition: Position;
    endPosition: Position;
    length: number;
}

export interface DnaValidationResult {
    isMutant: boolean;
    sequences: SequenceMatch[];
    matrixSize: number;
    isValid: boolean;
    errorMessage?: string;
}

export interface MutantDetectionConfig {
    sequenceLength: number;
    minSequences: number;
}

export const DEFAULT_MUTANT_CONFIG: MutantDetectionConfig = {
    sequenceLength: 4,
    minSequences: 2
};
