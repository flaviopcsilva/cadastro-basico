import { AbstractControl, ValidatorFn } from '@angular/forms';

export function cpfValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const cpf = control.value;
        if (!cpf) {
            return null; // Se o CPF não está preenchido, não há erro
        }

        // Remove caracteres não numéricos
        const cleanedCpf = cpf.replace(/\D/g, '');

        if (cleanedCpf.length !== 11 || !isValidCPF(cleanedCpf)) {
            return { invalidCpf: true };
        }

        return null;
    };
}

function isValidCPF(cpf: string): boolean {
    let sum = 0;
    let remainder;

    // Valida CPF com todos os dígitos iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Valida o primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    // Valida o segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
}
