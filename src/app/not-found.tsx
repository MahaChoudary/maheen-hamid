import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export default function NotFound(){return <section className="container not-found"><span className="eyebrow">404 / ROUTE NOT FOUND</span><h1>Wrong turn.<br/><em>Good direction.</em></h1><p>That page is not part of the published portfolio.</p><div><Link className="button button-primary" href="/">Return Home <ArrowUpRight size={17}/></Link><Link className="button button-secondary" href="/lab">Explore Lab →</Link></div></section>}
