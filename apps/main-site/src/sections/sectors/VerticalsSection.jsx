import { useState, useEffect } from "react";
import SectorIcon from "./SectorIcon.jsx";

function CameraIcon({ className }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
			<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
		</svg>
	);
}

function SectorImage({ image, label, height = 140 }) {
	const images = Array.isArray(image) ? image : image ? [image] : [];
	const [active, setActive] = useState(0);

	useEffect(() => {
		if (images.length < 2) return;
		const id = setInterval(() => setActive((p) => (p + 1) % images.length), 7000);
		return () => clearInterval(id);
	}, [images.length]);

	if (images.length === 0) {
		return (
			<div
				className="flex items-center justify-center rounded-xl bg-brand-light"
				style={{ height, marginBottom: "1.5rem" }}
			>
				<div className="text-center">
					<CameraIcon className="mx-auto mb-1.5 h-6 w-6 text-brand-muted/40" />
					<p className="text-xs text-brand-muted/50">{label}</p>
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				position: "relative",
				height,
				marginBottom: "1.5rem",
				borderRadius: "0.75rem",
				overflow: "hidden",
			}}
		>
			{images.map((src, i) => (
				<img
					key={src}
					src={src}
					alt={label}
					style={{
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						objectFit: "cover",
						opacity: i === active ? 1 : 0,
						transition: "opacity 0.6s ease-in-out",
					}}
				/>
			))}

			{images.length > 1 && (
				<div style={{
					position: "absolute",
					bottom: 8,
					left: "50%",
					transform: "translateX(-50%)",
					display: "flex",
					gap: 4,
					zIndex: 1,
				}}>
					{images.map((_, i) => (
						<button
							key={i}
							onClick={() => setActive(i)}
							style={{
								width: i === active ? 16 : 6,
								height: 6,
								borderRadius: 3,
								background: i === active ? "white" : "rgba(255,255,255,0.5)",
								border: "none",
								padding: 0,
								cursor: "pointer",
								transition: "all 0.3s",
							}}
							aria-label={`Image ${i + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function Tags({ tags }) {
	return (
		<div className="mt-4 flex flex-wrap gap-2">
			{tags.map((tag) => (
				<span
					key={tag}
					className="rounded-full px-3 py-1 text-xs font-medium text-white"
					style={{ background: "#1B2A6B" }}
				>
					{tag}
				</span>
			))}
		</div>
	);
}

function Clients({ clients }) {
	if (!clients?.length) return null;
	return (
		<div className="mt-4">
			<p className="mb-2 text-[10px] font-semibold tracking-widest text-brand-red uppercase">Key Clients</p>
			<div className="flex flex-wrap gap-2">
				{clients.map((c) => (
					<span
						key={c}
						className="rounded-full border px-3 py-1 text-xs font-medium"
						style={{ borderColor: "rgba(27,42,107,0.2)", background: "rgba(27,42,107,0.06)", color: "#1B2A6B" }}
					>
						{c}
					</span>
				))}
			</div>
		</div>
	);
}

function getColCount(n) {
	if (n <= 3) return n;
	if (n === 4) return 2;
	return 3;
}

export default function VerticalsSection({ data }) {
	const { eyebrow, title, titleHighlight, subtitle, items = [] } = data ?? {};

	const restCount = items.length - 1;
	const cols = restCount > 0 ? getColCount(restCount) : 1;
	const lastRowItems = restCount % cols || cols;
	const isLastAlone = restCount > 0 && lastRowItems === 1;

	return (
		<section className="bg-brand-light px-4 py-20 sm:px-8">
			<div className="mx-auto max-w-screen-2xl">

				<div className="mb-12 text-center">
					<p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>
					<h2 className="font-heading text-3xl font-bold text-brand-text sm:text-4xl">
						{title}
						<span className="text-brand-blue-light">{titleHighlight}</span>
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-brand-muted">{subtitle}</p>
				</div>

				<div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "1.5rem" }}>
					{items.map((item, i) => {
						const isFirst = i === 0;
						const isLast = i === items.length - 1;
						const spanFull = isFirst || (isLast && isLastAlone);

						return (
							<div
								key={item.key}
								className="rounded-2xl border border-black/5 bg-white"
								style={{
									gridColumn: spanFull ? "1 / -1" : undefined,
									padding: isFirst ? "2rem 2.5rem" : "1.5rem",
								}}
							>
								<SectorImage
									label={`[Photo: ${item.photo ?? item.name}]`}
									image={item.image}
									height={isFirst ? 240 : 180}
								/>
								<div
									className="mb-3 flex items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue"
									style={{ width: isFirst ? 40 : 36, height: isFirst ? 40 : 36 }}
								>
									<SectorIcon sectorKey={item.key} className={isFirst ? "h-5 w-5" : "h-4 w-4"} />
								</div>
								<h3
									className="font-heading font-bold text-brand-text"
									style={{ fontSize: isFirst ? "1.5rem" : "1rem" }}
								>
									{item.name}
								</h3>
								<p
									className="mt-2 leading-relaxed text-brand-muted"
									style={{ fontSize: isFirst ? 15 : 14 }}
								>
									{item.description}
								</p>
								<Tags tags={item.tags} />
								{item.clients?.length > 0 && (
									<div className="mt-4 border-t border-black/5 pt-4">
										<Clients clients={item.clients} />
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
