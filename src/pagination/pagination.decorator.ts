import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationResponse } from './pagination-response';

export interface IApiPaginatedResponse {
  description?: string;
  type: Type<any>;
}
export const ApiPaginatedResponse = ({
  description,
  type,
}: IApiPaginatedResponse) => {
  return applyDecorators(
    ApiExtraModels(PaginationResponse),
    ApiExtraModels(type),
    ApiOkResponse({
      description: description || 'Successfully received model list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponse) },
          {
            properties: {
              rows: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
            },
          },
        ],
      },
    }),
  );
};
