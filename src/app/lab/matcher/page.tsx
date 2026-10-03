import { canonicalFor } from '@/lib/seo';
import { LabNav,PageIntro } from '@/components/Page';
import { MatcherPanel } from '@/features/matcher/MatcherPanel';
export const metadata={...canonicalFor('/lab/matcher'),title:'Resume–Job Matcher',description:'Connect a role with relevant skills and projects, and identify the areas to discuss.'};
export default function Matcher(){return <><div className="container"><PageIntro number="03.03" label="LAB / MATCHER" title="Compare the role." accent="Find the connection." description="A practical view of strong matches, partial matches and gaps, with next steps for a better application."/><LabNav current="/lab/matcher"/></div><section className="section container lab-primary"><MatcherPanel/></section></>}
