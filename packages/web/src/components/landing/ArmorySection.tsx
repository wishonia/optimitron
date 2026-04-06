import { SectionContainer } from "@/components/ui/section-container";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { GameCTA } from "@/components/ui/game-cta";
import { NavItemCard, NavItemCardGrid } from "@/components/ui/nav-item-card";
import {
  wishocracyLink,
  referendumLink,
  dtreasuryLink,
  federalReserveLink,
  dirsLink,
  dssaLink,
  opgLink,
  obgLink,
  transparencyLink,
  dihLink,
  dfdaLink,
  departmentOfWarLink,
  prizeLink,
  scoreboardLink,
  alignmentLink,
  transmitLink,
  governmentsLink,
  iabLink,
  demoLink,
  toolsLink,
  type NavItem,
} from "@/lib/routes";
import type { BrutalCardBgColor } from "@/components/ui/brutal-card";

const agencies: { item: NavItem; bgColor: BrutalCardBgColor }[] = [
  { item: wishocracyLink, bgColor: "yellow" },
  { item: referendumLink, bgColor: "cyan" },
  { item: dtreasuryLink, bgColor: "pink" },
  { item: federalReserveLink, bgColor: "cyan" },
  { item: dirsLink, bgColor: "yellow" },
  { item: dssaLink, bgColor: "cyan" },
  { item: opgLink, bgColor: "cyan" },
  { item: obgLink, bgColor: "red" },
  { item: transparencyLink, bgColor: "cyan" },
  { item: dihLink, bgColor: "pink" },
  { item: dfdaLink, bgColor: "cyan" },
  { item: departmentOfWarLink, bgColor: "red" },
];

const tools: { item: NavItem; bgColor: BrutalCardBgColor }[] = [
  { item: prizeLink, bgColor: "pink" },
  { item: scoreboardLink, bgColor: "cyan" },
  { item: alignmentLink, bgColor: "yellow" },
  { item: transmitLink, bgColor: "cyan" },
  { item: governmentsLink, bgColor: "red" },
  { item: iabLink, bgColor: "yellow" },
  { item: demoLink, bgColor: "cyan" },
];

export function ArmorySection() {
  return (
    <>
      <SectionContainer bgColor="background" borderPosition="top" padding="lg">
        <Container>
          <SectionHeader
            title="Optimized Governance"
            subtitle="Every agency redesigned around one question: what does the data say actually works?"
            size="lg"
          />
          <NavItemCardGrid columns={3}>
            {agencies.map(({ item, bgColor }) => (
              <NavItemCard key={item.href} item={item} bgColor={bgColor} />
            ))}
          </NavItemCardGrid>
        </Container>
      </SectionContainer>

      <SectionContainer bgColor="yellow" borderPosition="top" padding="lg">
        <Container>
          <SectionHeader
            title="The Armory"
            subtitle="Your toolkit for fixing the mess described above. Browse. Equip. Try not to break anything."
            size="lg"
          />
          <NavItemCardGrid columns={3}>
            {tools.map(({ item, bgColor }) => (
              <NavItemCard key={item.href} item={item} bgColor={bgColor} />
            ))}
          </NavItemCardGrid>
          <div className="mt-8 text-center">
            <GameCTA href={toolsLink.href} variant="secondary">
              Full Armory &rarr;
            </GameCTA>
          </div>
        </Container>
      </SectionContainer>
    </>
  );
}
