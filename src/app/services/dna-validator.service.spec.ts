import { TestBed } from '@angular/core/testing';
import { DnaValidatorService } from './dna-validator.service';
import { SequenceDirection } from '../models';

describe('DnaValidatorService', () => {
    let service: DnaValidatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DnaValidatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('isMutant', () => {
        it('should return true for the example mutant case', () => {
            const dna = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
            expect(service.isMutant(dna)).toBe(true);
        });

        it('should return false for non-mutant DNA', () => {
            const dna = ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG'];
            expect(service.isMutant(dna)).toBe(false);
        });

        it('should return false for empty DNA array', () => {
            const dna: string[] = [];
            expect(service.isMutant(dna)).toBe(false);
        });

        it('should return false for invalid DNA with invalid characters', () => {
            const dna = ['ATGCGA', 'CAGTGC', 'TTATXT', 'AGACGG', 'GCGTCA', 'TCACTG'];
            expect(service.isMutant(dna)).toBe(false);
        });

        it('should return false for non-square matrix', () => {
            const dna = ['ATGCGA', 'CAGTGC', 'TTAT'];
            expect(service.isMutant(dna)).toBe(false);
        });

        it('should detect horizontal sequence', () => {
            const dna = ['AAAATG', 'CAGTGC', 'TTATGT', 'AGACGG', 'CCCCTA', 'TCACTG'];
            const result = service.validateDna(dna);
            expect(result.sequences.length).toBeGreaterThan(0);
            const hasHorizontal = result.sequences.some(
                (s) => s.direction === SequenceDirection.HORIZONTAL
            );
            expect(hasHorizontal).toBe(true);
        });

        it('should detect vertical sequence', () => {
            const dna = ['ATGCGA', 'ATGTGC', 'ATATGT', 'AGACGG', 'GCGTCA', 'TCACTG'];
            const result = service.validateDna(dna);
            expect(result.sequences.length).toBeGreaterThan(0);
            const hasVertical = result.sequences.some(
                (s) => s.direction === SequenceDirection.VERTICAL
            );
            expect(hasVertical).toBe(true);
        });

        it('should detect diagonal right sequence', () => {
            const dna = ['ATGCGA', 'CATGCC', 'TCATGT', 'AGACAG', 'GCGTCA', 'TCACTG'];
            const result = service.validateDna(dna);
            expect(result.sequences.length).toBeGreaterThan(0);
            const hasDiagonal = result.sequences.some(
                (s) => s.direction === SequenceDirection.DIAGONAL_RIGHT
            );
            expect(hasDiagonal).toBe(true);
        });

        it('should detect diagonal left sequence', () => {
            const dna = ['ATGCAA', 'CAGTAC', 'TTAAGT', 'AGACGG', 'GCGTCA', 'TCACTG'];
            const result = service.validateDna(dna);
            expect(result.sequences.length).toBeGreaterThan(0);
            const hasDiagonal = result.sequences.some(
                (s) => s.direction === SequenceDirection.DIAGONAL_LEFT
            );
            expect(hasDiagonal).toBe(true);
        });

        it('should return false when only one sequence is found', () => {
            const dna = ['AAAATG', 'CAGTGC', 'TTATGT', 'AGACGG', 'GCGTCA', 'TCACTG'];
            expect(service.isMutant(dna)).toBe(false);
        });

        it('should return true when exactly two sequences are found', () => {
            const dna = ['AAAATG', 'CAGTGC', 'TTATGT', 'AGACGG', 'CCCCTA', 'TCACTG'];
            expect(service.isMutant(dna)).toBe(true);
        });

        it('should handle minimum size matrix (4x4)', () => {
            const dna = ['AAAA', 'CCCC', 'TTTT', 'GGGG'];
            expect(service.isMutant(dna)).toBe(true);
        });

        it('should handle large matrix efficiently', () => {
            const dna = [
                'ATGCGAATGC',
                'CAGTGCAGTG',
                'TTATGTTTAT',
                'AGAAGGAGAA',
                'CCCCTACCCC',
                'TCACTGTCAC',
                'ATGCGAATGC',
                'CAGTGCAGTG',
                'TTATGTTTAT',
                'AGAAGGAGAA'
            ];
            const result = service.validateDna(dna);
            expect(result.isValid).toBe(true);
        });
    });

    describe('validateDna', () => {
        it('should return detailed validation result for mutant', () => {
            const dna = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
            const result = service.validateDna(dna);

            expect(result.isMutant).toBe(true);
            expect(result.isValid).toBe(true);
            expect(result.sequences.length).toBeGreaterThanOrEqual(2);
            expect(result.matrixSize).toBe(6);
            expect(result.errorMessage).toBeUndefined();
        });

        it('should return error for invalid DNA', () => {
            const dna = ['ATGC', 'CAGTGC'];
            const result = service.validateDna(dna);

            expect(result.isMutant).toBe(false);
            expect(result.isValid).toBe(false);
            expect(result.sequences.length).toBe(0);
            expect(result.errorMessage).toBeDefined();
        });

        it('should include sequence details with correct positions', () => {
            const dna = ['AAAATG', 'CAGTGC', 'TTATGT', 'AGACGG', 'CCCCTA', 'TCACTG'];
            const result = service.validateDna(dna);

            expect(result.sequences.length).toBeGreaterThan(0);
            const seq = result.sequences[0];
            expect(seq.base).toBeDefined();
            expect(seq.direction).toBeDefined();
            expect(seq.startPosition).toBeDefined();
            expect(seq.endPosition).toBeDefined();
            expect(seq.length).toBe(4);
        });

        it('should handle lowercase DNA input', () => {
            const dna = ['atgcga', 'cagtgc', 'ttatgt', 'agaagg', 'ccccta', 'tcactg'];
            const result = service.validateDna(dna);

            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
        });

        it('should validate matrix with special characters', () => {
            const dna = ['ATG!GA', 'CAGTGC', 'TTATGT', 'AGACGG', 'GCGTCA', 'TCACTG'];
            const result = service.validateDna(dna);

            expect(result.isValid).toBe(false);
            expect(result.isMutant).toBe(false);
        });
    });

    describe('edge cases', () => {
        it('should handle null DNA input', () => {
            const result = service.validateDna(null as any);
            expect(result.isValid).toBe(false);
        });

        it('should handle undefined DNA input', () => {
            const result = service.validateDna(undefined as any);
            expect(result.isValid).toBe(false);
        });

        it('should handle matrix with all same characters (multiple sequences)', () => {
            const dna = ['AAAA', 'AAAA', 'AAAA', 'AAAA'];
            expect(service.isMutant(dna)).toBe(true);
        });

        it('should handle matrix with no sequences', () => {
            const dna = ['ATCG', 'CGAT', 'ATCG', 'CGAT'];
            expect(service.isMutant(dna)).toBe(false);
        });

        it('should stop searching after finding enough sequences (optimization)', () => {
            const dna = ['AAAATG', 'CCCCGC', 'TTTTGT', 'GGGGGG', 'GCGTCA', 'TCACTG'];
            const result = service.validateDna(dna);
            // Should stop early, not find all possible sequences
            expect(result.isMutant).toBe(true);
            expect(result.sequences.length).toBeGreaterThanOrEqual(2);
        });
    });
});
