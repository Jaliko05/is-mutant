import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Componente para ingresar secuencias de ADN
 * Permite ingresar cada fila de la matriz de forma individual
 */
@Component({
    selector: 'app-dna-input',
    imports: [FormsModule],
    templateUrl: './dna-input.component.html'
})
export class DnaInputComponent {
    /** Tamaño actual de la matriz NxN */
    protected readonly matrixSize = signal<number>(6);

    /** Entrada actual del usuario (texto por fila) */
    protected readonly currentInput = signal<string>('');

    /** Array de secuencias de ADN ingresadas */
    protected readonly dnaSequences = signal<string[]>([]);

    /** Indica si hay un error de validación */
    protected readonly hasError = signal<boolean>(false);

    /** Mensaje de error para mostrar al usuario */
    protected readonly errorMessage = signal<string>('');

    /** Evento emitido cuando las secuencias están listas para validar */
    readonly dnaSubmitted = output<string[]>();

    /** Caracteres válidos para ADN */
    private readonly validBases = /^[ATCG]*$/;

    /**
     * Tamaños de matriz predefinidos disponibles
     */
    protected readonly availableSizes = [4, 5, 6, 7, 8, 9, 10];

    /**
     * Maneja el cambio de tamaño de matriz
     */
    updateMatrixSize(size: number): void {
        this.matrixSize.set(size);
        this.clearAll();
    }

    /**
     * Valida y agrega una fila a la matriz
     */
    addSequence(): void {
        const sequence = this.currentInput().toUpperCase().trim();

        // Validar longitud
        if (sequence.length !== this.matrixSize()) {
            this.showError(
                `La secuencia debe tener ${this.matrixSize()} caracteres`
            );
            return;
        }

        // Validar caracteres
        if (!this.validBases.test(sequence)) {
            this.showError('Solo se permiten los caracteres A, T, C, G');
            return;
        }

        // Verificar que no se exceda el tamaño de la matriz
        if (this.dnaSequences().length >= this.matrixSize()) {
            this.showError('Ya se completó la matriz');
            return;
        }

        // Agregar secuencia
        this.dnaSequences.update((sequences) => [...sequences, sequence]);
        this.currentInput.set('');
        this.clearError();
    }

    /**
     * Elimina una secuencia específica
     */
    removeSequence(index: number): void {
        this.dnaSequences.update((sequences) =>
            sequences.filter((_, i) => i !== index)
        );
    }

    /**
     * Limpia todas las secuencias ingresadas
     */
    clearAll(): void {
        this.dnaSequences.set([]);
        this.currentInput.set('');
        this.clearError();
    }

    /**
     * Envía las secuencias para validación
     */
    submitDna(): void {
        if (this.dnaSequences().length !== this.matrixSize()) {
            this.showError(
                `Debes ingresar ${this.matrixSize()} secuencias para completar la matriz ${this.matrixSize()}x${this.matrixSize()}`
            );
            return;
        }

        this.dnaSubmitted.emit(this.dnaSequences());
        this.clearError();
    }

    /**
     * Carga el ejemplo de ADN mutante
     */
    loadExample(): void {
        const example = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
        this.matrixSize.set(6);
        this.dnaSequences.set(example);
        this.currentInput.set('');
        this.clearError();
    }

    /**
     * Verifica si la matriz está completa
     */
    protected isMatrixComplete(): boolean {
        return this.dnaSequences().length === this.matrixSize();
    }

    /**
     * Obtiene el número de secuencias faltantes
     */
    protected getRemainingSequences(): number {
        return this.matrixSize() - this.dnaSequences().length;
    }

    /**
     * Muestra un mensaje de error
     */
    private showError(message: string): void {
        this.errorMessage.set(message);
        this.hasError.set(true);
    }

    /**
     * Limpia el estado de error
     */
    private clearError(): void {
        this.errorMessage.set('');
        this.hasError.set(false);
    }
}
