import * as sql from 'mssql';

export type SupportedParamTypes = string | number | boolean;

export const mapToSqlType = (
    param: SupportedParamTypes,
): (() => sql.ISqlType) | sql.ISqlType => {
    if (param === undefined || param === null) {
        throw new Error('Cannot map empty value');
    }

    const paramType = typeof param;
    switch (paramType) {
        case 'string':
            return sql.NVarChar;
        case 'number':
            return sql.Int;
        case 'boolean':
            return sql.Bit;
        default:
            throw `Mapping of type '${paramType}' is not supported`;
    }
};

export interface ISpParam {
    name: string;
    value: SupportedParamTypes;
}

export const storedProcWrapper = (
    getRequestCallback: () => Promise<sql.Request>,
): (<T>(name: string, inputs: ISpParam[]) => Promise<T>) => {
    const callProcedure = async <T>(
        name: string,
        inputs: ISpParam[],
    ): Promise<T> => {
        const request = await getRequestCallback();
        inputs.map((i) => {
            request.input(i.name, mapToSqlType(i.value), i.value);
        });
        const result = await request.execute<T>(name);
        return result.recordset[0][0];
    };

    return callProcedure;
};
