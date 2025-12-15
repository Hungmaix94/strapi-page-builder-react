import { useEffect, useState } from 'react';

interface ValidationResult {
    isValid: boolean;
    token: string | null;
    error: string | null;
    loading: boolean;
}

/**
 * Hook to validate API key against Strapi backend
 * @param apiKey - The API key to validate
 * @param strapiUrl - The base URL of the Strapi instance
 * @returns Validation result with loading state
 */
export function useApiKeyValidation(apiKey?: string, strapiUrl?: string): ValidationResult {
    const [result, setResult] = useState<ValidationResult>({
        isValid: false,
        token: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!apiKey || !strapiUrl) {
            setResult({
                isValid: false,
                token: null,
                error: 'API key and Strapi URL are required',
                loading: false,
            });
            return;
        }

        const validateKey = async () => {
            try {
                const response = await fetch(`${strapiUrl}/api/page-builder/api/validate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ apiKey }),
                });

                if (!response.ok) {
                    throw new Error(`Validation failed: ${response.statusText}`);
                }

                const data = await response.json();

                setResult({
                    isValid: data.isValid,
                    token: data.token,
                    error: data.error,
                    loading: false,
                });
            } catch (error) {
                setResult({
                    isValid: false,
                    token: null,
                    error: (error as Error).message,
                    loading: false,
                });
            }
        };

        validateKey();
    }, [apiKey, strapiUrl]);

    return result;
}
