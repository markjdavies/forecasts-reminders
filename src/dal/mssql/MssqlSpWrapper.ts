import * as sql from 'mssql';

export type SupportedParamTypes = string | number | boolean;
export type ParameterList = Record<string, SupportedParamTypes>;

export interface IMssqlStoredProcWrapper {
    callProcedure: <T>(
        name: string,
        params?: ParameterList,
    ) => Promise<sql.IRecordSet<T>>;
}

export const storedProcWrapper = (
    getRequestCallback: () => Promise<sql.Request>,
): IMssqlStoredProcWrapper => {
    const callProcedure = async <T>(
        name: string,
        params?: ParameterList,
    ): Promise<sql.IRecordSet<T>> => {
        const request = await getRequestCallback();

        addInputParams(request, params);

        const result = await request.execute<T>(name);

        return result.recordset;
    };

    return { callProcedure };
};

const mapToSqlType = (
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

const addInputParams = (request: sql.Request, params?: ParameterList): void => {
    if (params) {
        Object.keys(params).map((k) => {
            const value = params[k];
            request.input(k, mapToSqlType(value), value);
        });
    }
};
