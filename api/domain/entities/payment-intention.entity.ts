import { IsNumber, IsString, IsNotEmpty, Min, IsArray, ValidateNested, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItem {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}

class OrderDetails {
  @IsBoolean()
  @IsOptional()
  delivery_needed: boolean = false;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items: OrderItem[];
}

class BillingDataOwner {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;
}

class BillingData {
  @ValidateNested()
  @Type(() => BillingDataOwner)
  owner: BillingDataOwner;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  building: string;

  @IsString()
  @IsNotEmpty()
  floor: string;

  @IsString()
  @IsNotEmpty()
  apartment: string;

  @IsString()
  @IsNotEmpty()
  state: string;
}

export class PaymentIntention {
  @ValidateNested()
  @Type(() => OrderDetails)
  orderDetails: OrderDetails;

  @ValidateNested()
  @Type(() => BillingData)
  billingData: BillingData;

  @IsString()
  @IsNotEmpty()
  redirection_url: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  payment_methods: string[];
} 