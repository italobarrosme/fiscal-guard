import { createFileRoute } from "@tanstack/react-router";
import { ValidGuardRender } from "../modules/valid-guard/ValidGuardRender";

export const Route = createFileRoute("/valid-guard")({
	component: ValidGuardRender,
});
