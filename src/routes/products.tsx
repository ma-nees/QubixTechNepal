import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/products")({
  component: RedirectToPortfolio,
});

function RedirectToPortfolio() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/portfolio", replace: true });
  }, [navigate]);

  return null;
}
