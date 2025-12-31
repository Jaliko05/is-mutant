import { Injectable } from '@angular/core';
import {
    DnaValidationResult,
    SequenceMatch,
    DEFAULT_MUTANT_CONFIG,
    MutantDetectionConfig,
    SequenceDirection,
    DnaBase,
    Position
} from '../models';

/**
 * Servicio para validar secuencias de ADN y detectar mutantes
 * 
 * Un humano es mutante si se encuentran más de una secuencia
 * de cuatro letras iguales de forma horizontal, vertical o diagonal
 */
@Injectable({
    providedIn: 'root'
})
export class DnaValidatorService {
    private readonly config: MutantDetectionConfig = DEFAULT_MUTANT_CONFIG;


    isMutant(dna: string[]): boolean {
        const result = this.validateDna(dna);
        return result.isMutant;
    }


    validateDna(dna: string[]): DnaValidationResult {
        if (!this.isValidDna(dna)) {
            return {
                isMutant: false,
                sequences: [],
                matrixSize: dna?.length || 0,
                isValid: false,
                errorMessage: 'La matriz de ADN no es válida. Debe ser NxN y contener solo A, T, C, G'
            };
        }

        const sequences: SequenceMatch[] = [];
        const n = dna.length;

        // se detienae a al encontrar suficientes secuencias
        const findSequences = (): void => {
            // Buscar horizontales
            for (let row = 0; row < n && sequences.length < this.config.minSequences; row++) {
                this.findHorizontalSequences(dna, row, sequences);
            }

            // Buscar verticales
            for (let col = 0; col < n && sequences.length < this.config.minSequences; col++) {
                this.findVerticalSequences(dna, col, sequences);
            }

            // Buscar diagonales
            if (sequences.length < this.config.minSequences) {
                this.findDiagonalSequences(dna, sequences);
            }
        };

        findSequences();

        return {
            isMutant: sequences.length >= this.config.minSequences,
            sequences,
            matrixSize: n,
            isValid: true
        };
    }

    //horizontales
    private findHorizontalSequences(dna: string[], row: number, sequences: SequenceMatch[]): void {
        const n = dna.length;
        let count = 1;
        let currentBase = dna[row][0];

        for (let col = 1; col < n; col++) {
            if (dna[row][col] === currentBase) {
                count++;
                if (count === this.config.sequenceLength) {
                    sequences.push({
                        base: currentBase as DnaBase,
                        direction: SequenceDirection.HORIZONTAL,
                        startPosition: { row, col: col - this.config.sequenceLength + 1 },
                        endPosition: { row, col },
                        length: this.config.sequenceLength
                    });
                    return;
                }
            } else {
                currentBase = dna[row][col];
                count = 1;
            }
        }
    }

    //veticales
    private findVerticalSequences(dna: string[], col: number, sequences: SequenceMatch[]): void {
        const n = dna.length;
        let count = 1;
        let currentBase = dna[0][col];

        for (let row = 1; row < n; row++) {
            if (dna[row][col] === currentBase) {
                count++;
                if (count === this.config.sequenceLength) {
                    sequences.push({
                        base: currentBase as DnaBase,
                        direction: SequenceDirection.VERTICAL,
                        startPosition: { row: row - this.config.sequenceLength + 1, col },
                        endPosition: { row, col },
                        length: this.config.sequenceLength
                    });
                    return; // Una secuencia por columna es suficiente
                }
            } else {
                currentBase = dna[row][col];
                count = 1;
            }
        }
    }


    private findDiagonalSequences(dna: string[], sequences: SequenceMatch[]): void {
        const n = dna.length;

        // Diagonales hacia la derecha (\)
        for (let row = 0; row <= n - this.config.sequenceLength; row++) {
            for (let col = 0; col <= n - this.config.sequenceLength; col++) {
                if (this.checkDiagonalRight(dna, row, col)) {
                    sequences.push({
                        base: dna[row][col] as DnaBase,
                        direction: SequenceDirection.DIAGONAL_RIGHT,
                        startPosition: { row, col },
                        endPosition: { row: row + this.config.sequenceLength - 1, col: col + this.config.sequenceLength - 1 },
                        length: this.config.sequenceLength
                    });
                    if (sequences.length >= this.config.minSequences) return;
                }
            }
        }

        // Diagonales hacia la izquierda (/)
        for (let row = 0; row <= n - this.config.sequenceLength; row++) {
            for (let col = this.config.sequenceLength - 1; col < n; col++) {
                if (this.checkDiagonalLeft(dna, row, col)) {
                    sequences.push({
                        base: dna[row][col] as DnaBase,
                        direction: SequenceDirection.DIAGONAL_LEFT,
                        startPosition: { row, col },
                        endPosition: { row: row + this.config.sequenceLength - 1, col: col - this.config.sequenceLength + 1 },
                        length: this.config.sequenceLength
                    });
                    if (sequences.length >= this.config.minSequences) return;
                }
            }
        }
    }

    //diagonal derecha desde cualquier posición
    private checkDiagonalRight(dna: string[], startRow: number, startCol: number): boolean {
        const base = dna[startRow][startCol];
        for (let i = 1; i < this.config.sequenceLength; i++) {
            if (dna[startRow + i][startCol + i] !== base) {
                return false;
            }
        }
        return true;
    }

    //diagonal izquierda desde cualquier posición
    private checkDiagonalLeft(dna: string[], startRow: number, startCol: number): boolean {
        const base = dna[startRow][startCol];
        for (let i = 1; i < this.config.sequenceLength; i++) {
            if (dna[startRow + i][startCol - i] !== base) {
                return false;
            }
        }
        return true;
    }

    //validacion bvasica de la matriz sea nxn y solo tenga atcg
    private isValidDna(dna: string[]): boolean {
        if (!dna || dna.length === 0) {
            return false;
        }
        const n = dna.length;
        const validBases = /^[ATCG]+$/;

        return dna.every(row =>
            row.length === n && validBases.test(row)
        );
    }
}
