import { Component, signal } from '@angular/core';
import { DnaInputComponent, DnaMatrixComponent, DnaResultComponent } from './components';
import { DnaValidatorService } from './services';
import { DnaValidationResult } from './models';


@Component({
  selector: 'app-root',
  imports: [DnaInputComponent, DnaMatrixComponent, DnaResultComponent],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('Detector de Mutantes');
  protected readonly currentDna = signal<string[]>([]);

  protected readonly validationResult = signal<DnaValidationResult | null>(null);

  protected readonly hasAnalyzed = signal<boolean>(false);

  constructor(private dnaValidator: DnaValidatorService) { }

  protected handleDnaSubmitted(dna: string[]): void {
    this.currentDna.set(dna);
    const result = this.dnaValidator.validateDna(dna);
    this.validationResult.set(result);
    this.hasAnalyzed.set(true);
  }
  protected handleNewAnalysis(): void {
    this.currentDna.set([]);
    this.validationResult.set(null);
    this.hasAnalyzed.set(false);
  }
}
