import { BadRequestException, Injectable } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { parse } from 'papaparse';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from 'src/auth/dto';

export interface ValidationErrorField {
  field: string;
  value: any;
  errors: string;
}

@Injectable()
export class UploadService {
  constructor(private authService: AuthService) {}

  async saveDataFromFile(file: Express.Multer.File) {
    const data = await this.parseCsv(file.buffer.toString());

    this.validateRequiredColumns(data.meta.fields);

    const result = await this.processData(data.data);

    return { result, total: result.length };
  }

  async parseCsv(csvData: string) {
    const { data, errors, meta } = parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transform: (value, field) => {
        if (field === 'age') {
          value = value.trim();
          if (value === '') return undefined;
          const num = parseInt(value);
          if (isNaN(num)) return value;
          return num;
        }
        value = value.trim();
        if (value === '') return undefined;
        return value;
      },
    });

    data.forEach((row) => {
      delete row['__parsed_extra'];
    });

    return { data, errors, meta };
  }

  validateRequiredColumns(fields: string[]) {
    const colsRequired = ['name', 'email', 'password'];
    for (const col of colsRequired) {
      if (!fields.includes(col)) {
        throw new BadRequestException(`Column ${col} not found`);
      }
    }
  }

  async processData(data: any[]) {
    const result = [];
    let step = 1;

    for (const row of data) {
      const validationResult = await this.validateRow(row);
      if (validationResult.errors.length > 0) {
        result.push({
          index: step,
          data: validationResult.data,
          errors: validationResult.errors,
        });
      } else {
        if (
          !(await this.authService.findUserByEmail(validationResult.data.email))
        ) {
          await this.authService.register(validationResult.data, false);
        } else {
          validationResult.errors.push({
            field: 'email',
            value: validationResult.data.email,
            errors: 'User already exist',
          });
          result.push({
            index: step,
            data: validationResult.data,
            errors: validationResult.errors,
          });
        }
      }
      step++;
    }

    return result;
  }

  async validateRow(row: any) {
    const userDto = new RegisterDto();
    Object.assign(userDto, row);
    const errors: ValidationError[] = await validate(userDto);

    const errorValidation: ValidationErrorField[] = [];
    if (errors.length > 0) {
      errors.forEach((e) => {
        const msgErrs: string[] = Object.values(e.constraints);
        errorValidation.push({
          field: e.property,
          value: e.value,
          errors: msgErrs.join(', '),
        });
      });
    }

    return { data: userDto, errors: errorValidation };
  }
}
