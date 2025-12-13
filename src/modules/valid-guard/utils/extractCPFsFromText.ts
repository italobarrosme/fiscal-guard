export const extractCPFsFromText = async (text: string): Promise<string[]> => {
	const cpfRegex = /\b\d{11}\b/g;
	const matches = text.match(cpfRegex);
	return matches || [];
};
