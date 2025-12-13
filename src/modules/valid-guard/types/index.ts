export type ValidGuardFormData = {
	nome: string;
	cpf: string;
	dataNascimento: string;
};

export type ValidGuardValidationResult = {
	isValid: boolean;
	errors: {
		nome?: string | undefined;
		cpf?: string | undefined;
		dataNascimento?: string | undefined;
	};
};

export type ValidGuardResponse = {
	success: boolean;
	message: string;
	data?: ValidGuardFormData;
};

export type CPFStatus =
	| "PENDING"
	| "REGULAR"
	| "SUSPENSO"
	| "CANCELADO"
	| "NULO"
	| "ERROR";

export type CPFData = {
	id: string;
	original: string;
	isValid: boolean;
	region: string | null;
	receitaStatus: CPFStatus;
	checkedAt: Date;
};

export type CpfSummary = {
	total: number;
	validCount: number;
	invalidCount: number;
	regularCount: number;
	validRate: string;
};

export type FormattedCPF = CPFData & {
	formatted: string;
	statusColor: string;
	statusLabel: string;
	receitaLabel: string;
	receitaColor: string;
};

export enum ValidationFilter {
	ALL = "ALL",
	VALID = "VALID",
	INVALID = "INVALID",
	REGULAR = "REGULAR",
}
