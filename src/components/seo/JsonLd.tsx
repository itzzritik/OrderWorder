type JsonLdProps = {
	data: Record<string, unknown>;
};

export default function JsonLd({ data }: JsonLdProps) {
	return <script dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} type="application/ld+json" />;
}
