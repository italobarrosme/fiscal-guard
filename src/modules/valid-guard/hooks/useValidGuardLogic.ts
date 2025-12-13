import { useMemo } from "react";
import { validateCPF } from "../extractUserDataFromText";
import type { ValidGuardFormData, ValidGuardValidationResult } from "../types";

/**
 * Hook responsável por aplicar regras de negócio e validação
 * sobre os dados do formulário de validação.
 *
 * Este hook **não faz fetch de dados**, apenas valida informações
 * brutas e retorna resultados prontos para renderização.
 *
 * ---
 *
 * 🔹 Funções principais:
 * - Valida nome (mínimo 3 caracteres, apenas letras e espaços)
 * - Valida CPF usando algoritmo de validação
 * - Valida data de nascimento (formato DD/MM/AAAA e idade mínima)
 *
 * 🔹 Retorno:
 * - `validationResult`: resultado da validação com erros específicos
 *
 * ---
 *
 * @param {ValidGuardFormData} formData - Dados do formulário a serem validados
 * @returns {ValidGuardValidationResult}
 *
 * @example
 * ```tsx
 * const validation = useValidGuardLogic({ nome: "João", cpf: "12345678901", dataNascimento: "01/01/1990" })
 * validation.isValid // false
 * validation.errors.cpf // "CPF inválido"
 * ```
 */
export const useValidGuardLogic = (
	formData: ValidGuardFormData,
): ValidGuardValidationResult => {
	return useMemo(() => {
		const errors: ValidGuardValidationResult["errors"] = {};

		// Validação do Nome
		if (!formData.nome || formData.nome.trim().length < 3) {
			errors.nome = "Nome deve ter no mínimo 3 caracteres";
		} else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.nome.trim())) {
			errors.nome = "Nome deve conter apenas letras e espaços";
		}

		// Validação do CPF
		if (!formData.cpf || formData.cpf.trim().length === 0) {
			errors.cpf = "CPF é obrigatório";
		} else if (!validateCPF(formData.cpf)) {
			errors.cpf = "CPF inválido";
		}

		// Validação da Data de Nascimento
		if (!formData.dataNascimento || formData.dataNascimento.trim().length === 0) {
			errors.dataNascimento = "Data de nascimento é obrigatória";
		} else {
			const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
			const match = formData.dataNascimento.match(dateRegex);

			if (!match) {
				errors.dataNascimento = "Data deve estar no formato DD/MM/AAAA";
			} else {
				const [, day, month, year] = match;
				const date = new Date(
					parseInt(year, 10),
					parseInt(month, 10) - 1,
					parseInt(day, 10),
				);

				// Verifica se a data é válida
				if (
					date.getFullYear() !== parseInt(year, 10) ||
					date.getMonth() !== parseInt(month, 10) - 1 ||
					date.getDate() !== parseInt(day, 10)
				) {
					errors.dataNascimento = "Data inválida";
				} else {
					// Verifica idade mínima (18 anos)
					const today = new Date();
					const age = today.getFullYear() - date.getFullYear();
					const monthDiff = today.getMonth() - date.getMonth();
					const dayDiff = today.getDate() - date.getDate();

					const actualAge =
						age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);

					if (actualAge < 18) {
						errors.dataNascimento = "Idade mínima de 18 anos";
					} else if (actualAge > 120) {
						errors.dataNascimento = "Data de nascimento inválida";
					}
				}
			}
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors,
		};
	}, [formData]);
}

