import { GeneralFilter, PermissionModel } from "@gorenas/domain";
import { GeneralApiService } from "@gorenas/data-access-core";
import { PermissionModelView } from "@gorenas/domain";
import { AppUtil, URL_PERMISSION } from "@gorenas/application-core";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

@Injectable()
export class PermissionServiceAdapter extends GeneralApiService<PermissionModel, PermissionModelView> {
    constructor(
        http: HttpClient
    ) {
        super(http, URL_PERMISSION);
    }

    override create(data: PermissionModel): Observable<PermissionModel> {
        const toCreate: PermissionModel = new PermissionModel();

        toCreate.name = this.buildPermissionName((data as any));
        toCreate.roleId = data.roleId;

        return super.create(toCreate);
    }

    override modify(data: PermissionModel): Observable<PermissionModel> {
        const toModify: PermissionModel = new PermissionModel();

        toModify.id = data.id;
        toModify.name = this.buildPermissionName((data as any));
        toModify.roleId = data.roleId;

        return super.modify(toModify);
    }

    override getCanSee(params?: GeneralFilter): Observable<PermissionModelView[]> {
        return super.getCanSee(params).pipe(
            map(rawValues => {
                if (AppUtil.verifyEmpty(rawValues)) return [];

                const transformed = new Array<PermissionModelView>();
                rawValues.forEach(rawItem => {
                    transformed.push(this.buildPermissionMVFromRequest(rawItem));
                });

                return transformed;
            }));
    }

    override getById(id: number, options?: Map<string, string>): Observable<PermissionModelView> {
        let url = `${this.baseUrl}id?id=${id}`;

        if (!AppUtil.verifyEmpty(options)) {
            const isEdition: string = (options!.get('isEdition'))!;
            if (!AppUtil.verifyEmpty(isEdition) && isEdition === 'true') url += `&edition=true`;

        }
        return this.http.get<PermissionModelView>(url).pipe(
            map(rawItem => this.buildPermissionMVFromRequest(rawItem)));
    }

    private buildPermissionName(data: { module: string; component: string; action: string }): string {
        return `${data.module}:${data.component}:${data.action}`;
    }

    private buildPermissionMVFromRequest(data: PermissionModelView): PermissionModelView {
        const sections: Array<string> = (data as any as { name: string, role: string }).name.split(':');
        const itemView: PermissionModelView = new PermissionModelView();
        itemView.id = data.id;
        itemView.module = sections.length > 0 ? sections[0] : '';
        itemView.component = sections.length > 1 ? sections[1] : '';
        itemView.action = sections.length > 2 ? sections[2] : '';
        itemView.role = data.role;
        itemView.roleId = data.roleId;

        return itemView;
    }
}