import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="text-center min-h-screen flex items-center justify-center">
			<img src="./public/logo512.png" alt="Fiscal Guard" className="w-12 h-12" />
			<Link
				to="/valid-guard"
				className="hover:text-indigo-500 transition-colors duration-300 hover:underline flex flex-row items-center gap-4 justify-center"
			>
				<h1 className="text-4xl font-bold">Fiscal Guard</h1>
				<ArrowRight className="size-12 animate-bounce" />
			</Link>
		</div>
	);
}
