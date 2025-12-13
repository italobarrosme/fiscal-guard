import { useForm } from "react-hook-form";
import type { ValidGuardFormData } from "../types";
import { useValidGuardLogic } from "../hooks/useValidGuardLogic";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useId } from "react";

type ValidGuardFormProps = {
	onSubmit: (data: ValidGuardFormData) => Promise<void>;
	isSubmitting: boolean;
};

export const ValidGuardForm = ({
	onSubmit,
	isSubmitting,
}: ValidGuardFormProps) => {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors: formErrors },
	} = useForm<ValidGuardFormData>({
		defaultValues: {
			nome: "",
			cpf: "",
			dataNascimento: "",
		},
	});

	const formData = watch();
	const { isValid, errors: validationErrors } = useValidGuardLogic(formData);

	// IDs únicos para cada campo (hooks devem ser chamados no topo)
	const nomeId = useId();
	const cpfId = useId();
	const dataNascimentoId = useId();

	const onSubmitForm = async (data: ValidGuardFormData) => {
		await onSubmit(data);
	};

	// Função para formatar CPF
	const formatCPF = (value: string) => {
		const numbers = value.replace(/\D/g, "");
		if (numbers.length <= 11) {
			return numbers
				.replace(/(\d{3})(\d)/, "$1.$2")
				.replace(/(\d{3})(\d)/, "$1.$2")
				.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
		}
		return value;
	};

	// Função para formatar data
	const formatDate = (value: string) => {
		const numbers = value.replace(/\D/g, "");
		if (numbers.length <= 8) {
			return numbers
				.replace(/(\d{2})(\d)/, "$1/$2")
				.replace(/(\d{2})(\d)/, "$1/$2")
				.replace(/(\d{4})(\d)/, "$1");
		}
		return value;
	};

	return (
		<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
			<h2 className="text-lg font-semibold text-slate-800 mb-6">
				Validação de Dados
			</h2>

			<form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
				{/* Campo Nome */}
				<div>
					<label
						htmlFor="nome"
						className="block text-sm font-medium text-slate-700 mb-2"
					>
						Nome Completo
					</label>
					<div className="relative">
						<input
							id={nomeId}
							type="text"
							{...register("nome", {
								required: "Nome é obrigatório",
								minLength: {
									value: 3,
									message: "Nome deve ter no mínimo 3 caracteres",
								},
								pattern: {
									value: /^[a-zA-ZÀ-ÿ\s]+$/,
									message: "Nome deve conter apenas letras e espaços",
								},
							})}
							className={`w-full px-4 py-2 rounded-lg border ${
								formErrors.nome || validationErrors.nome
									? "border-red-300 focus:ring-red-500 focus:border-red-500"
									: "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
							} focus:outline-none focus:ring-2 text-slate-700`}
							placeholder="Digite seu nome completo"
						/>
						{!formErrors.nome &&
							!validationErrors.nome &&
							formData.nome && (
								<CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
							)}
					</div>
					{(formErrors.nome || validationErrors.nome) && (
						<p className="mt-1 text-sm text-red-600 flex items-center gap-1">
							<XCircle className="w-4 h-4" />
							{formErrors.nome?.message || validationErrors.nome}
						</p>
					)}
				</div>

				{/* Campo CPF */}
				<div>
					<label
						htmlFor="cpf"
						className="block text-sm font-medium text-slate-700 mb-2"
					>
						CPF
					</label>
					<div className="relative">
						<input
							id={cpfId}
							type="text"
							{...register("cpf", {
								required: "CPF é obrigatório",
							})}
							onChange={(e) => {
								const formatted = formatCPF(e.target.value);
								setValue("cpf", formatted, { shouldValidate: true });
							}}
							maxLength={14}
							className={`w-full px-4 py-2 rounded-lg border ${
								formErrors.cpf || validationErrors.cpf
									? "border-red-300 focus:ring-red-500 focus:border-red-500"
									: "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
							} focus:outline-none focus:ring-2 text-slate-700`}
							placeholder="000.000.000-00"
							value={watch("cpf")}
						/>
						{!formErrors.cpf &&
							!validationErrors.cpf &&
							formData.cpf && (
								<CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
							)}
					</div>
					{(formErrors.cpf || validationErrors.cpf) && (
						<p className="mt-1 text-sm text-red-600 flex items-center gap-1">
							<XCircle className="w-4 h-4" />
							{formErrors.cpf?.message || validationErrors.cpf}
						</p>
					)}
				</div>

				{/* Campo Data de Nascimento */}
				<div>
					<label
						htmlFor="dataNascimento"
						className="block text-sm font-medium text-slate-700 mb-2"
					>
						Data de Nascimento
					</label>
					<div className="relative">
						<input
							id={dataNascimentoId}
							type="text"
							{...register("dataNascimento", {
								required: "Data de nascimento é obrigatória",
								pattern: {
									value: /^(\d{2})\/(\d{2})\/(\d{4})$/,
									message: "Data deve estar no formato DD/MM/AAAA",
								},
							})}
							onChange={(e) => {
								const formatted = formatDate(e.target.value);
								setValue("dataNascimento", formatted, { shouldValidate: true });
							}}
							maxLength={10}
							className={`w-full px-4 py-2 rounded-lg border ${
								formErrors.dataNascimento || validationErrors.dataNascimento
									? "border-red-300 focus:ring-red-500 focus:border-red-500"
									: "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
							} focus:outline-none focus:ring-2 text-slate-700`}
							placeholder="DD/MM/AAAA"
							value={watch("dataNascimento")}
						/>
						{!formErrors.dataNascimento &&
							!validationErrors.dataNascimento &&
							formData.dataNascimento && (
								<CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
							)}
					</div>
					{(formErrors.dataNascimento ||
						validationErrors.dataNascimento) && (
						<p className="mt-1 text-sm text-red-600 flex items-center gap-1">
							<XCircle className="w-4 h-4" />
							{formErrors.dataNascimento?.message ||
								validationErrors.dataNascimento}
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
}

