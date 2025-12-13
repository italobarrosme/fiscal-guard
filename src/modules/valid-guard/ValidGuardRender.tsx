import { useState } from "react";
import { InputArea } from "../../components/InputArea";
import { ResultsTable } from "../../components/ResultsTable";
import type { CPFData } from "./types";
import { ValidationFilter } from "./types";
import { validateCPFs } from "../../services/valid-guard";
import type { UserInputData } from "@/types";

/**
 * Container Component (Render Component)
 * Responsável por gerenciar o estado bruto (Raw Data), efeitos colaterais (API Calls)
 * e orquestração.
 */
export function ValidGuardRender() {
	const [isProcessing, setIsProcessing] = useState(false);
	const [cpfData, setCpfData] = useState<CPFData[]>([]);
	const [filter, setFilter] = useState<ValidationFilter>(ValidationFilter.ALL);

	const handleProcess = async (data: UserInputData[]) => {
		if (data.length === 0) return;

		setIsProcessing(true);
		try {
			// Usa o isValid já calculado na extração, evitando validar duas vezes
			const results = await validateCPFs(
				data,
				data.map(item => item.isValid ?? true) // Usa isValid da extração ou assume true se não existir
			);
			setCpfData(results);
		} catch (error) {
			console.error("Erro ao validar CPFs:", error);
			alert("Erro ao validar CPFs. Tente novamente.");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<header className="mb-8">
				<h1 className="text-3xl font-bold text-slate-800 mb-2">
					Valid Guard
				</h1>
				<p className="text-slate-600">
					Valide uma lista de CPFs de forma rápida e segura
				</p>
			</header>

			<InputArea onProcess={handleProcess} isProcessing={isProcessing} />

			{cpfData.length > 0 && (
				<ResultsTable data={cpfData} filter={filter} setFilter={setFilter} />
			)}
		</section>
	);
}

