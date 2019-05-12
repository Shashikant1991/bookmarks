import {EntityChange} from '../../shared/networks/networks.types';

export class ChangesFailureAction {
    public static readonly type: string = '[Changes] failure';

    public constructor(public readonly error: 'fatal' | 'retry',
                       public readonly changes?: EntityChange[]) {

    }
}
