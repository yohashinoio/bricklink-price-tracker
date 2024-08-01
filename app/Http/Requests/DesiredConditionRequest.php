<?php

namespace App\Http\Requests;

use App\Models\WatchedItem;
use Illuminate\Foundation\Http\FormRequest;

class DesiredConditionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'unit_price' => ['required', 'numeric'],
            'quantity' => ['required', 'numeric'],
            'shipping_available' => ['required', 'boolean'],
            'include_used' => ['required', 'boolean'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'unit_price.required' => 'Unit price is required.',
            'unit_price.numeric' => 'Unit price must be a numeric.',
            'quantity.required' => 'Quantity is required.',
            'quantity.numeric' => 'Quantity must be a numeric.',
            'shipping_available.required' => 'Shipping available is required.',
            'shipping_available.boolean' => 'Shipping available must be a boolean.',
            'include_used.required' => 'Include used is required.',
        ];
    }
}
