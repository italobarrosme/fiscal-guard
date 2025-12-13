// Função para formatar data
export const formatDate = (value: string) => {
	const numbers = value.replace(/\D/g, "");
	if (numbers.length <= 8) {
		return numbers
			.replace(/(\d{2})(\d)/, "$1/$2")
			.replace(/(\d{2})(\d)/, "$1/$2")
			.replace(/(\d{4})(\d)/, "$1");
	}
	return value;
};
