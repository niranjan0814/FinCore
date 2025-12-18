<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        // Product / Location Details
        'location',
        'product_type',
        'base_product',
        'pcsu_csu_code',
        
        // Customer Personal Details
        'code_type',
        'customer_code',
        'gender',
        'title',
        'full_name',
        'initials',
        'first_name',
        'last_name',
        'date_of_birth',
        'civil_status',
        'religion',
        'mobile_no_1',
        'mobile_no_2',
        'ccl_mobile_no',
        'spouse_name',
        'health_info',
        'family_members_count',
        'customer_profile_image',
        'monthly_income',
        
        // Customer Address Details
        'address_type',
        'address_line_1',
        'address_line_2',
        'address_line_3',
        'country',
        'province',
        'district',
        'city',
        'gs_division',
        'telephone',
        'preferred_address',
        
        // Business Details
        'ownership_type',
        'register_number',
        'business_name',
        'business_email',
        'business_duration',
        'business_place',
        'handled_by',
        'no_of_employees',
        'market_reputation',
        'sector',
        'sub_sector',
    ];

    protected $casts = [
        'health_info' => 'array',
        'date_of_birth' => 'date',
        'monthly_income' => 'decimal:2',
        'preferred_address' => 'boolean',
    ];
}
