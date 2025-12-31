import { Component, input, output } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { DnaValidationResult, SequenceDirection } from '../../models';


@Component({
    selector: 'app-dna-result',
    imports: [KeyValuePipe],
    templateUrl: './dna-result.component.html'
})
export class DnaResultComponent {

    readonly result = input.required<DnaValidationResult>();

    readonly newAnalysis = output<void>();

    protected getDirectionIcon(direction: SequenceDirection): string {
        const icons = {
            [SequenceDirection.HORIZONTAL]: '→',
            [SequenceDirection.VERTICAL]: '↓',
            [SequenceDirection.DIAGONAL_RIGHT]: '↘',
            [SequenceDirection.DIAGONAL_LEFT]: '↙'
        };
        return icons[direction] || '';
    }
    protected getDirectionName(direction: SequenceDirection): string {
        const names = {
            [SequenceDirection.HORIZONTAL]: 'Horizontal',
            [SequenceDirection.VERTICAL]: 'Vertical',
            [SequenceDirection.DIAGONAL_RIGHT]: 'Diagonal ↘',
            [SequenceDirection.DIAGONAL_LEFT]: 'Diagonal ↙'
        };
        return names[direction] || direction;
    }
    protected getDirectionColor(direction: SequenceDirection): string {
        const colors = {
            [SequenceDirection.HORIZONTAL]: 'bg-blue-500',
            [SequenceDirection.VERTICAL]: 'bg-green-500',
            [SequenceDirection.DIAGONAL_RIGHT]: 'bg-purple-500',
            [SequenceDirection.DIAGONAL_LEFT]: 'bg-orange-500'
        };
        return colors[direction] || 'bg-gray-500';
    }

    protected getSequencesByDirection(): Map<SequenceDirection, number> {
        const map = new Map<SequenceDirection, number>();
        this.result().sequences.forEach(seq => {
            map.set(seq.direction, (map.get(seq.direction) || 0) + 1);
        });
        return map;
    }


    protected handleNewAnalysis(): void {
        this.newAnalysis.emit();
    }
}
