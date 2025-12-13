import { useState } from "react";
import { ValidGuardForm } from "./components/ValidGuardForm";
import type { ValidGuardFormData, ValidGuardResponse } from "./types";
import { validateData } from "../../services/valid-guard";

/**
 * Container Component (Render Component)
 * Responsável por gerenciar o estado bruto (Raw Data), efeitos colaterais (API Calls)
 * e orquestração.
 */
export function ValidGuardRender() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [result, setResult] = useState<ValidGuardResponse | null>(null);

	const handleSubmit = async (data: ValidGuardFormData) => {
		setIsSubmitting(true);
		setResult(null);

		try {
			const resultData = await validateData(data);
			setResult(resultData);
		} catch (error) {
			setResult({
				success: false,
				message: "Erro ao validar dados. Tente novamente.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<header className="mb-8">
				<h1 className="text-3xl font-bold text-slate-800 mb-2">
					Valid Guard
				</h1>
				<p className="text-slate-600">
					Valide seus dados pessoais de forma rápida e segura
				</p>
			</header>

			<ValidGuardForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

			{result && (
				<div
					className={`mt-6 p-4 rounded-lg border ${
						result.success
							? "bg-green-50 border-green-200 text-green-800"
							: "bg-red-50 border-red-200 text-red-800"
					}`}
				>
					<p className="font-medium">{result.message}</p>
					{result.data && (
						<div className="mt-2 text-sm">
							<p>
								<strong>Nome:</strong> {result.data.nome}
							</p>
							<p>
								<strong>CPF:</strong> {result.data.cpf}
							</p>
							<p>
								<strong>Data de Nascimento:</strong> {result.data.dataNascimento}
							</p>
						</div>
					)}
				</div>
			)}
		</section>
	);
}

