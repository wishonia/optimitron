import { DeclarationStepper } from "@/components/declaration/DeclarationStepper";
import { getRouteMetadata } from "@/lib/metadata";
import { declarationLink } from "@/lib/routes";

export const metadata = getRouteMetadata(declarationLink);

export default function DeclarationPage() {
  return (
    <div className="min-h-screen bg-background">
      <DeclarationStepper />
    </div>
  );
}
