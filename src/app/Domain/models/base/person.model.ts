import { GeneralModel } from "../general/general.model";

export class PersonModel extends GeneralModel {
    public static readonly TYPE_IDENTIFICATION_CC = 'C.C';
    public static readonly TYPE_IDENTIFICATION_CE = 'C.E';
    public static readonly TYPE_IDENTIFICATION_TI = 'T.I';
    public static readonly TYPES_IDENTIFICATION = new Array<string>();

    public static readonly RH_O_PLUS = 'O+';
    public static readonly RH_O_MINUS = 'O-';
    public static readonly RH_A_PLUS = 'A+';
    public static readonly RH_A_MINUS = 'A-';
    public static readonly RH_B_PLUS = 'B+';
    public static readonly RH_B_MINUS = 'B-';
    public static readonly RH_AB_PLUS = 'AB+';
    public static readonly RH_AB_MINUS = 'AB-';
    public static readonly RH_TYPES = new Array<string>();


    static {
        this.TYPES_IDENTIFICATION.push(this.TYPE_IDENTIFICATION_CC);
        this.TYPES_IDENTIFICATION.push(this.TYPE_IDENTIFICATION_CE);
        this.TYPES_IDENTIFICATION.push(this.TYPE_IDENTIFICATION_TI);
        this.RH_TYPES.push(this.RH_O_PLUS);
        this.RH_TYPES.push(this.RH_O_MINUS);
        this.RH_TYPES.push(this.RH_A_PLUS);
        this.RH_TYPES.push(this.RH_A_MINUS);
        this.RH_TYPES.push(this.RH_B_PLUS);
        this.RH_TYPES.push(this.RH_B_MINUS);
        this.RH_TYPES.push(this.RH_AB_PLUS);
        this.RH_TYPES.push(this.RH_AB_MINUS);
    }

    names?: string;
    surnames?: string;
    identification?: string;
    typeIdentification?: string;
    phoneNumber?: string;
    rh?: string;
    address?: string;
    born?: Date;
    created?: Date;
}