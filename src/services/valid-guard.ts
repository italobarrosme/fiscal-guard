import type { CPFData, CPFStatus } from "../modules/valid-guard/types";
import { validateCPF, getCPFRegion } from "../modules/valid-guard/extractUserDataFromText";

/**
 * Serviço responsável por validar uma lista de CPFs.
 * Valida cada CPF usando algoritmo de validação e retorna os resultados.
 * 
 * @param cpfs - Array de objetos com nome, cpf e dataNascimento para validar
 * @param isValidArray - Array opcional com valores de validação já calculados (evita validar duas vezes)
 */
export async function validateCPFs(
	cpfs: { name: string; cpf: string; dataNascimento: string }[],
	isValidArray?: boolean[]
): Promise<CPFData[]> {

	console.log("cpfs", cpfs);
	try {
		// TODO: Substituir pela URL real da API quando disponível
		// Por enquanto, valida localmente usando algoritmo de validação
		const results: CPFData[] = cpfs.map(({ name, cpf, dataNascimento }, index) => {
			// Usa o isValid já calculado se fornecido, senão valida novamente
			const isValid = isValidArray?.[index] ?? validateCPF(cpf);
			const region = isValid ? getCPFRegion(cpf) : null;
			
			// Se inválido, status negativo. Se válido, PENDING (aguardando validação da Receita)
			const receitaStatus: CPFStatus = isValid ? "PENDING" : "ERROR";

			return {
				id: `cpf-${index}-${Date.now()}`,
				name: name,
				cpf: cpf,
				dataNascimento: dataNascimento,
				isValid,
				region,
				receitaStatus,
				checkedAt: new Date(),
			};
		});

		return results;
	} catch (error) {
		console.error("Erro ao validar CPFs:", error);
		throw new Error("Erro ao validar CPFs. Tente novamente.");
	}
}

