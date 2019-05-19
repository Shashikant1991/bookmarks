import {LabelEntity} from '../../../shared/networks/entities/label.entity';

export class LabelsSetAction {
    public static readonly type: string = '[Labels] set';

    public constructor(public readonly labels: LabelEntity[]) {

    }
}
