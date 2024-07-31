<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ItemRequest extends FormRequest
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
            'type' => ['required', 'string', Rule::in("MINIFIG", "PART", "SET", "BOOK", "GEAR", "CATALOG", "INSTRUCTION", "UNSORTED_LOT", "ORIGINAL_BOX")],
            'no' => ['required', 'string'],
            'color_id' => ['integer', 'nullable'],
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
            'type.required' => 'Type of item is required.',
            'type.string' => 'Type of item must be a string.',
            'type.in' => 'Type of item must be one of: MINIFIG, PART, SET, BOOK, GEAR, CATALOG, INSTRUCTION, UNSORTED_LOT, ORIGINAL_BOX.',
            'no.required' => 'Number of item is required.',
            'no.string' => 'Number of item must be a string.',
            'color_id.integer' => 'Color ID must be an integer.',
        ];
    }
}
