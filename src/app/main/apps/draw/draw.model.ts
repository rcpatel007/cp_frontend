import { FuseUtils } from '@fuse/utils';

export class DrawData
{
    id: string;
    CPTypeId: string;
    formId: Number;
    vesselId: string;
    ownerId: Number;
    chartererId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
    cpTime: Number;
    cpCity: string;
    cpSubject: Number;
    cpLiftDate: string;
    cpLiftTime: string;
    cpLiftCity: string;
    createdBy: Number;
    createdAt: string;
    updatedBy: Number;
    updatedAt: string;
    isActive: string;
    isDelete: string;

    /**
     * Constructor
     *
     * @param DrawData
     */
    constructor(DrawData)
    {
        {
            this.id = DrawData.id || FuseUtils.generateGUID();
            this.CPTypeId = DrawData.CPTypeId || '';
            this.formId = DrawData.formId || '';
            this.vesselId = DrawData.vesselId || '';
            this.ownerId = DrawData.ownerId || '';
            this.chartererId = DrawData.chartererId || '';
            this.chartererBrokerId = DrawData.chartererBrokerId || '';
            this.ownerBrokerId = DrawData.ownerBrokerId || '';
            this.cpDate = DrawData.cpDate || '';
            this.cpTime = DrawData.cpTime || '';
            this.cpCity = DrawData.cpCity || '';
            this.cpSubject = DrawData.cpSubject || '';
            this.cpLiftDate = DrawData.cpLiftDate || '';
            this.cpLiftTime = DrawData.cpLiftTime || '';
            this.createdBy = DrawData.createdBy || '';
            this.createdAt = DrawData.createdAt || '';
            this.updatedBy = DrawData.updatedBy || '';
            this.updatedAt = DrawData.updatedAt || '';
            this.isActive = DrawData.isActive || '';
            this.isDelete = DrawData.isDelete || '';
        }
    }
}