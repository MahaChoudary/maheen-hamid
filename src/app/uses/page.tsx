import { PageIntro } from '@/components/Page';
import { Ecosystem } from '@/features/ecosystem/Ecosystem';
import { canonicalFor } from '@/lib/seo';
export const metadata={...canonicalFor('/uses'),title:'Uses',description:'Tech Stack / Engineering Ecosystem: AI, product frameworks, data, infrastructure and developer tools.'};
export default function Uses(){return <><div className="container"><PageIntro number="ABOUT / TOOLS" label="TECH STACK" title="A stack with" accent="connections." description="Interfaces, retrieval, data and operations: the tools make more sense when you see how they work together."/></div><section className="section container"><Ecosystem/></section></>}
