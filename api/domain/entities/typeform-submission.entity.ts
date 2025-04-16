import { IsString, IsObject, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Field {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  ref: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}

class Answer {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsObject()
  @IsNotEmpty()
  field: Field;
}

class Definition {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Field)
  fields: Field[];
}

class FormResponse {
  @IsString()
  @IsNotEmpty()
  form_id: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  landed_at: string;

  @IsString()
  @IsNotEmpty()
  submitted_at: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Definition)
  definition: Definition;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];
}

export class TypeformSubmission {
  @IsString()
  @IsNotEmpty()
  event_id: string;

  @IsString()
  @IsNotEmpty()
  event_type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => FormResponse)
  form_response: FormResponse;
} 