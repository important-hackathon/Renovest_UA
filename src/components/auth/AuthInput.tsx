'use client';

import React from 'react';

interface AuthInputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

export function AuthInput({ type, placeholder, value, onChange, required = false }: AuthInputProps) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full border border-lime-400 rounded-full px-5 py-3 focus:outline-none"
        />
    );
}
