import { Injectable } from '@angular/core';
import {
    DnaValidationResult,
    SequenceMatch,
    DEFAULT_MUTANT_CONFIG,
    MutantDetectionConfig
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

    /**
     * Valida si una secuencia de ADN corresponde a un mutante
     * @param dna Array de strings que representan la matriz de ADN
     * @returns true si es mutante, false si no lo es
     */
    isMutant(dna: string[]): boolean {
        const result = this.validateDna(dna);
        return result.isMutant;
    }

    /**
     * Valida el ADN y retorna un resultado detallado
     * @param dna Array de strings que representan la matriz de ADN
     * @returns Resultado detallado de la validación
     */
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

        // TODO: Buscar secuencias en todas las direcciones

        return {
            isMutant: sequences.length >= this.config.minSequences,
            sequences,
            matrixSize: n,
            isValid: true
        };
    }

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
