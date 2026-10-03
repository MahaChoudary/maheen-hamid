import { canonicalFor } from '@/lib/seo';
import { LabNav,PageIntro } from '@/components/Page';
import { AssistantPanel } from '@/features/assistant/AssistantPanel';
export const metadata={...canonicalFor('/lab/assistant'),title:'Mira',description:'Meet Mira: portfolio conversations and clear technical explanations.'};
export default function Assistant(){return <><div className="container"><PageIntro number="03.02" label="PLAYGROUND / MIRA" title="Meet Mira." accent="Start a conversation." description="Ask about my work, explore a technical idea or follow your curiosity."/><LabNav current="/lab/assistant"/></div><section className="section container lab-primary"><AssistantPanel/></section></>}
