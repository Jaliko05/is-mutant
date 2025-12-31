import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class DnaValidatorService {


    isMutant(dna: string[]): boolean {

        if (!this.isValidDna(dna)) {
            return false;
        }

        const n = dna.length;
        let sequencesFound = 0;
        const requiredSequences = 2;


        return sequencesFound >= requiredSequences;
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
