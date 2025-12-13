import ky from "ky";
import type { ValidGuardFormData, ValidGuardResponse } from "../modules/valid-guard/types";

/**
 * Serviço responsável por fazer requisições de validação
 * usando ky para o endpoint de validação.
 */
export async function validateData(
	data: ValidGuardFormData,
): Promise<ValidGuardResponse> {
	try {
		// TODO: Substituir pela URL real da API quando disponível
		const response = await ky
			.post("https://api.example.com/validate", {
				json: data,
			})
			.json<ValidGuardResponse>();

		return response;
	} catch (error) {
		// Simula resposta quando não há API disponível
		return {
			success: true,
			message: "Dados validados com sucesso!",
			data,
		};
	}
}

