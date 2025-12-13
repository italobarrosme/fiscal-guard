import { useState, useId } from "react";
import type { ValidGuardFormData } from "../types";
import { validGuardSchema } from "../schemas/validGuardSchema";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { formatCPF, formatDate } from "../../../utils/formats";

type ValidGuardFormProps = {
	onSubmit: (data: ValidGuardFormData) => Promise<void>;
	isSubmitting: boolean;
};

type FormErrors = {
	nome?: string;
	cpf?: string;
	dataNascimento?: string;
};

export const ValidGuardForm = ({
	onSubmit,
	isSubmitting,
}: ValidGuardFormProps) => {
	// IDs únicos para cada campo (hooks devem ser chamados no topo)
	const nomeId = useId();
	const cpfId = useId();
	const dataNascimentoId = useId();

	// Estado do formulário
	const [formData, setFormData] = useState<ValidGuardFormData>({
		nome: "",
		cpf: "",
		dataNascimento: "",
	});

	// Estado de erros
	const [errors, setErrors] = useState<FormErrors>({});


	// Função para validar o formulário
	const validateForm = (): boolean => {
		try {
			validGuardSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof Error && "issues" in error) {
				const zodError = error as { issues: Array<{ path: string[]; message: string }> };
				const newErrors: FormErrors = {};
				
				zodError.issues.forEach((issue) => {
					const field = issue.path[0] as keyof FormErrors;
					if (field) {
						newErrors[field] = issue.message;
					}
				});
				
				setErrors(newErrors);
			}
			return false;
		}
	};

	// Função para validar campo individual
	const validateField = (field: keyof ValidGuardFormData, value: string) => {
		// Valida apenas o campo específico usando o schema parcial
		try {
			const fieldSchema = validGuardSchema.shape[field];
			if (fieldSchema) {
				fieldSchema.parse(value);
				setErrors((prev) => ({ ...prev, [field]: undefined }));
			}
		} catch (error) {
			if (error instanceof Error && "issues" in error) {
				const zodError = error as { issues: Array<{ message: string }> };
				setErrors((prev) => ({
					...prev,
					[field]: zodError.issues[0]?.message,
				}));
			}
		}
	};

	// Handlers de mudança
	const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setFormData((prev) => ({ ...prev, nome: value }));
		validateField("nome", value);
	};

	const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatCPF(e.target.value);
		setFormData((prev) => ({ ...prev, cpf: formatted }));
		validateField("cpf", formatted);
	};

	const handleDataNascimentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatDate(e.target.value);
		setFormData((prev) => ({ ...prev, dataNascimento: formatted }));
		validateField("dataNascimento", formatted);
	};

	// Handler de submit
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		if (validateForm()) {
			await onSubmit(formData);
		}
	};

	// Verifica se o formulário é válido
	const isValid = Object.keys(errors).length === 0 && 
		formData.nome.trim() !== "" && 
		formData.cpf.trim() !== "" && 
		formData.dataNascimento.trim() !== "";

	return (
		<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
			<h2 className="text-lg font-semibold text-slate-800 mb-6">
				Validação de Dados
			</h2>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Campo Nome */}
				<div>
					<label
						htmlFor={nomeId}
						className="block text-sm font-medium text-slate-700 mb-2"
					>
						Nome Completo
					</label>
					<div className="relative">
						<input
							id={nomeId}
							type="text"
							value={formData.nome}
							onChange={handleNomeChange}
							className={`w-full px-4 py-2 rounded-lg border ${
								errors.nome
									? "border-red-300 focus:ring-red-500 focus:border-red-500"
									: "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
							} focus:outline-none focus:ring-2 text-slate-700`}
							placeholder="Digite seu nome completo"
						/>
						{!errors.nome && formData.nome && (
							<CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
						)}
					</div>
					{errors.nome && (
						<p className="mt-1 text-sm text-red-600 flex items-center gap-1">
							<XCircle className="w-4 h-4" />
							{errors.nome}
						</p>
					)}
				</div>

				{/* Campo CPF */}
				<div>
					<label
						htmlFor={cpfId}
						className="block text-sm font-medium text-slate-700 mb-2"
					>
						CPF
					</label>
					<div className="relative">
						<input
							id={cpfId}
							type="text"
							value={formData.cpf}
							onChange={handleCpfChange}
							maxLength={14}
							className={`w-full px-4 py-2 rounded-lg border ${
								errors.cpf
									? "border-red-300 focus:ring-red-500 focus:border-red-500"
									: "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
							} focus:outline-none focus:ring-2 text-slate-700`}
							placeholder="000.000.000-00"
						/>
						{!errors.cpf && formData.cpf && (
							<CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
						)}
					</div>
					{errors.cpf && (
						<p className="mt-1 text-sm text-red-600 flex items-center gap-1">
							<XCircle className="w-4 h-4" />
							{errors.cpf}
						</p>
					)}
				</div>

				{/* Campo Data de Nascimento */}
				<div>
					<label
						htmlFor={dataNascimentoId}
						className="block text-sm font-medium text-slate-700 mb-2"
					>
						Data de Nascimento
					</label>
					<div className="relative">
						<input
							id={dataNascimentoId}
							type="text"
							value={formData.dataNascimento}
							onChange={handleDataNascimentoChange}
							maxLength={10}
							className={`w-full px-4 py-2 rounded-lg border ${
								errors.dataNascimento
									? "border-red-300 focus:ring-red-500 focus:border-red-500"
									: "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
							} focus:outline-none focus:ring-2 text-slate-700`}
							placeholder="DD/MM/AAAA"
						/>
						{!errors.dataNascimento && formData.dataNascimento && (
							<CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
						)}
					</div>
					{errors.dataNascimento && (
						<p className="mt-1 text-sm text-red-600 flex items-center gap-1">
							<XCircle className="w-4 h-4" />
							{errors.dataNascimento}
						</p>
					)}
				</div>

				{/* Botão de Submit */}
				<button
					type="submit"
					disabled={!isValid || isSubmitting}
					className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="w-5 h-5 animate-spin" />
							Validando...
						</>
					) : (
						"Validar Dados"
					)}
				</button>
			</form>
		</div>
	);
};
