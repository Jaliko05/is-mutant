import { Component, input } from '@angular/core';
import { SequenceMatch, SequenceDirection } from '../../models';

/**
 * Componente para visualizar la matriz de ADN
 * Resalta las secuencias encontradas con colores diferentes según la dirección
 */
@Component({
    selector: 'app-dna-matrix',
    imports: [],
    templateUrl: './dna-matrix.component.html'
})
export class DnaMatrixComponent {
    /** Array de secuencias de ADN a visualizar */
    readonly dna = input.required<string[]>();

    /** Secuencias encontradas para resaltar */
    readonly sequences = input<SequenceMatch[]>([]);

    /**
     * Verifica si una celda es parte de alguna secuencia
     */
    protected isPartOfSequence(row: number, col: number): SequenceMatch | null {
        return this.sequences().find(seq => this.isCellInSequence(seq, row, col)) || null;
    }

    /**
     * Determina si una celda específica está en una secuencia
     */
    private isCellInSequence(sequence: SequenceMatch, row: number, col: number): boolean {
        const { startPosition, direction, length } = sequence;

        switch (direction) {
            case SequenceDirection.HORIZONTAL:
                return row === startPosition.row &&
                    col >= startPosition.col &&
                    col < startPosition.col + length;

            case SequenceDirection.VERTICAL:
                return col === startPosition.col &&
                    row >= startPosition.row &&
                    row < startPosition.row + length;

            case SequenceDirection.DIAGONAL_RIGHT:
                const offsetRight = row - startPosition.row;
                return offsetRight >= 0 &&
                    offsetRight < length &&
                    col === startPosition.col + offsetRight;

            case SequenceDirection.DIAGONAL_LEFT:
                const offsetLeft = row - startPosition.row;
                return offsetLeft >= 0 &&
                    offsetLeft < length &&
                    col === startPosition.col - offsetLeft;

            default:
                return false;
        }
    }

    /**
     * Obtiene las clases CSS para una celda según si es parte de una secuencia
     */
    protected getCellClasses(row: number, col: number): string {
        const sequence = this.isPartOfSequence(row, col);

        if (!sequence) {
            return 'bg-white border-2 border-gray-300 text-gray-800';
        }

        // Colores diferentes según la dirección de la secuencia
        const colorMap = {
            [SequenceDirection.HORIZONTAL]: 'bg-blue-500 border-blue-600 text-white font-bold shadow-lg scale-110',
            [SequenceDirection.VERTICAL]: 'bg-green-500 border-green-600 text-white font-bold shadow-lg scale-110',
            [SequenceDirection.DIAGONAL_RIGHT]: 'bg-purple-500 border-purple-600 text-white font-bold shadow-lg scale-110',
            [SequenceDirection.DIAGONAL_LEFT]: 'bg-orange-500 border-orange-600 text-white font-bold shadow-lg scale-110'
        };

        return colorMap[sequence.direction] || 'bg-gray-200 border-gray-300';
    }

    /**
     * Obtiene el carácter de ADN en una posición específica
     */
    protected getBase(row: number, col: number): string {
        return this.dna()[row]?.[col] || '';
    }
}
