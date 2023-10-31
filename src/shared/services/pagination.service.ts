// pagination.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/auth/dto';
import { PaginationResponseDto } from 'src/shared/interfaces/pagination-response.dto';
import { Repository } from 'typeorm';

@Injectable()
export class PaginationService {
  
  async paginate<EntityType>(
    repository: Repository<EntityType>,
    page: number,
    pageSize: number,
  ): Promise<PaginationResponseDto<EntityType>> {
    // Implementa la lógica de paginación aquí, similar a la función anterior.
    const results = await repository.find({
      skip: !page ? 0 : pageSize * (page - 1),
      take: pageSize,
    });

    const totalItems = await repository.count(),
      totalPages = Math.ceil(totalItems / pageSize);
    
    if (page > totalPages) throw new BadRequestException('The page you want to access does not exist');

    return {
      results,
      meta: {
        totalItems,
        itemCount: results.length,
        itemsPerPage: pageSize,
        totalPages,
        currentPage: !page ? 1 : page
      }
    }
  }
}
