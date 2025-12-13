import { z } from "zod";
import { validateCPF } from "../extractUserDataFromText";

/**
 * Schema de validação para o formulário ValidGuard usando Zod
 */
export const validGuardSchema = z.object({
	nome: z
		.string()
		.min(1, "Nome é obrigatório")
		.min(3, "Nome deve ter no mínimo 3 caracteres")
		.regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços")
		.trim(),
	cpf: z
		.string()
		.min(1, "CPF é obrigatório")
		.refine(
			(cpf) => validateCPF(cpf),
			"CPF inválido",
		),
	dataNascimento: z
		.string()
		.min(1, "Data de nascimento é obrigatória")
		.regex(
			/^(\d{2})\/(\d{2})\/(\d{4})$/,
			"Data deve estar no formato DD/MM/AAAA",
		)
		.refine(
			(dateStr) => {
				const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
				if (!match) return false;

				const [, day, month, year] = match;
				const date = new Date(
					parseInt(year, 10),
					parseInt(month, 10) - 1,
					parseInt(day, 10),
				);

				// Verifica se a data é válida
				const isValidDate =
					date.getFullYear() === parseInt(year, 10) &&
					date.getMonth() === parseInt(month, 10) - 1 &&
					date.getDate() === parseInt(day, 10);

				if (!isValidDate) return false;

				// Verifica idade mínima (18 anos) e máxima (120 anos)
				const today = new Date();
				const age = today.getFullYear() - date.getFullYear();
				const monthDiff = today.getMonth() - date.getMonth();
				const dayDiff = today.getDate() - date.getDate();

				const actualAge =
					age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);

				return actualAge >= 18 && actualAge <= 120;
			},
			(dateStr) => {
				const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
				if (!match) return { message: "Data inválida" };

				const [, , , year] = match;
				const date = new Date(
					parseInt(year, 10),
					parseInt(match[2], 10) - 1,
					parseInt(match[1], 10),
				);

				const today = new Date();
				const age = today.getFullYear() - date.getFullYear();
				const monthDiff = today.getMonth() - date.getMonth();
				const dayDiff = today.getDate() - date.getDate();

				const actualAge =
					age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);

				if (actualAge < 18) {
					return { message: "Idade mínima de 18 anos" };
				}
				if (actualAge > 120) {
					return { message: "Data de nascimento inválida" };
				}
				return { message: "Data inválida" };
			},
		),
});

export type ValidGuardSchemaType = z.infer<typeof validGuardSchema>;

