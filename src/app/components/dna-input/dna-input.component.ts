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
    protected readonly matrixSize = signal<number>(6);

    protected readonly currentInput = signal<string>('');

    protected readonly dnaSequences = signal<string[]>([]);

    protected readonly hasError = signal<boolean>(false);
    protected readonly errorMessage = signal<string>('');

    protected readonly isCurrentInputValid = signal<boolean>(true);

    protected readonly helpMessage = signal<string>('');

    protected readonly showHelp = signal<boolean>(false);

    readonly dnaSubmitted = output<string[]>();

    private readonly validBases = /^[ATCG]*$/;

    /**
     * Tamaños de matriz predefinidos disponibles
     */
    protected readonly availableSizes = [4, 5, 6, 7, 8, 9, 10];


    updateMatrixSize(size: number): void {
        this.matrixSize.set(size);
        this.clearAll();
    }

    validateCurrentInput(): void {
        const input = this.currentInput().trim();

        if (!input) {
            this.isCurrentInputValid.set(true);
            this.helpMessage.set('');
            return;
        }

        // Validar caracteres
        if (!this.validBases.test(input.toUpperCase())) {
            this.isCurrentInputValid.set(false);
            this.helpMessage.set('⚠️ Solo se permiten A, T, C, G');
            return;
        }

        // Validar longitud
        if (input.length < this.matrixSize()) {
            this.isCurrentInputValid.set(true);
            this.helpMessage.set(`✏️ Faltan ${this.matrixSize() - input.length} caracteres`);
        } else if (input.length === this.matrixSize()) {
            this.isCurrentInputValid.set(true);
            this.helpMessage.set('✅ Listo para agregar');
        } else {
            this.isCurrentInputValid.set(false);
            this.helpMessage.set(`⚠️ Demasiados caracteres (máximo ${this.matrixSize()})`);
        }
    }

    addSequence(): void {
        const sequence = this.currentInput().toUpperCase().trim();

        // Validar longitud
        if (sequence.length !== this.matrixSize()) {
            this.showError(
                `La secuencia debe tener exactamente ${this.matrixSize()} caracteres`
            );
            return;
        }

        // Validar caracteres
        if (!this.validBases.test(sequence)) {
            this.showError('Solo se permiten las bases nitrogenadas: A, T, C, G');
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
        this.helpMessage.set('');
    }

    removeSequence(index: number): void {
        this.dnaSequences.update((sequences) =>
            sequences.filter((_, i) => i !== index)
        );
    }



    clearAll(): void {
        this.dnaSequences.set([]);
        this.currentInput.set('');
        this.clearError();
        this.helpMessage.set('');
    }


    toggleHelp(): void {
        this.showHelp.update(show => !show);
    }


    protected getProgressPercentage(): number {
        return (this.dnaSequences().length / this.matrixSize()) * 100;
    }


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


    loadExample(): void {
        const example = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
        this.matrixSize.set(6);
        this.dnaSequences.set(example);
        this.currentInput.set('');
        this.clearError();
    }


    protected isMatrixComplete(): boolean {
        return this.dnaSequences().length === this.matrixSize();
    }


    protected getRemainingSequences(): number {
        return this.matrixSize() - this.dnaSequences().length;
    }

    private showError(message: string): void {
        this.errorMessage.set(message);
        this.hasError.set(true);
    }

    private clearError(): void {
        this.errorMessage.set('');
        this.hasError.set(false);
    }
}
