import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateInvoiceDto,
  InvoiceQueryDto,
  UpdateInvoiceDto,
} from '../dto/invoice.dto';
import { InvoiceService } from './invoice.service';

@ApiTags('Invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Request() req) {
    return this.invoiceService.create(createInvoiceDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by customer name or invoice number',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'paid', 'expired', 'cancelled'],
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  findAll(@Query() queryDto: InvoiceQueryDto, @Request() req) {
    return this.invoiceService.findAll(queryDto, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.invoiceService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update invoice' })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Request() req,
  ) {
    return this.invoiceService.update(id, updateInvoiceDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete invoice' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @Request() req) {
    return this.invoiceService.remove(id, req.user.userId);
  }
}
