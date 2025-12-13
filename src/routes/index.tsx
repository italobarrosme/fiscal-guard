import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const navigate = useNavigate();

	const handlerRouter = () => {
		navigate({ to: "/valid-guard" });
	};

	return (
		<div className="text-center min-h-screen flex items-center justify-center">
			<h1 className="text-4xl font-bold">Sistema de Validação de CPFs</h1>
			<button
				className="bg-blue-500 text-white px-4 py-2 rounded-md"
				type="button"
				onClick={handlerRouter}
			>
				Validar CPFs
			</button>
		</div>
	);
}
