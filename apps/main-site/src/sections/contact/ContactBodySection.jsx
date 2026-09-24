import { useState } from "react";

function BuildingIcon({ className }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
		</svg>
	);
}

function PhoneIcon({ className }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
		</svg>
	);
}

function EnvelopeIcon({ className }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
		</svg>
	);
}

function GlobeIcon({ className }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3.284 14.253A8.959 8.959 0 013 12c0-1.016.135-2 .386-2.918" />
		</svg>
	);
}

function SendIcon() {
	return (
		<svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
		</svg>
	);
}

function InfoCard({ icon: Icon, iconBg, label, children }) {
	return (
		<div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
			<div style={{ width: 40, height: 40, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
				<Icon className="h-5 w-5 text-white" />
			</div>
			<div>
				<p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</p>
				{children}
			</div>
		</div>
	);
}

function FormField({ label, type = "text", value, onChange, required, placeholder }) {
	return (
		<div>
			<label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#111827" }}>
				{label}{required && <span style={{ color: "#E63946", marginLeft: 2 }}>*</span>}
			</label>
			<input
				type={type}
				required={required}
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb", padding: "9px 13px", fontSize: 14, outline: "none", fontFamily: "inherit", background: "white", boxSizing: "border-box" }}
			/>
		</div>
	);
}

export default function ContactBodySection({ data }) {
	const { info = {}, quickFacts = [], form = {} } = data ?? {};
	const [fields, setFields] = useState({ name: "", company: "", email: "", message: "" });
	const additionalFields = form.additionalFields ?? [];

	function handleChange(key, value) {
		setFields((f) => ({ ...f, [key]: value }));
	}

	function handleSubmit(e) {
		e.preventDefault();
		const to = info?.email ?? "sales@invendis.com";
		const subject = encodeURIComponent(`Website enquiry from ${fields.name || "a visitor"}`);
		const bodyLines = [
			`Name: ${fields.name}`,
			`Company: ${fields.company}`,
			`Email: ${fields.email}`,
			...additionalFields.map((f) => `${f.label}: ${fields[f.label] ?? ""}`),
			"",
			fields.message,
		];
		window.location.href = `mailto:${to}?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
	}

	return (
		<section className="bg-white px-4 py-20 sm:px-8">
			<div style={{ maxWidth: 920, margin: "0 auto", display: "flex", gap: "4rem", alignItems: "flex-start" }}>

				{/* Left — contact info */}
				<div style={{ flex: "0 0 300px" }}>
					<h2 className="font-heading text-2xl font-bold text-brand-text" style={{ marginBottom: "2rem" }}>Get In Touch</h2>

					{info?.headquarters && (
						<InfoCard icon={BuildingIcon} iconBg="#1B2A6B" label="Headquarters">
							<p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.65 }}>{info.headquarters}</p>
						</InfoCard>
					)}
					{info?.phone && (
						<InfoCard icon={PhoneIcon} iconBg="#059669" label="Phone">
							<a href={`tel:${info.phone}`} className="text-brand-blue" style={{ fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{info.phone}</a>
						</InfoCard>
					)}
					{info?.email && (
						<InfoCard icon={EnvelopeIcon} iconBg="#E63946" label="Email">
							<a href={`mailto:${info.email}`} className="text-brand-blue" style={{ fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{info.email}</a>
						</InfoCard>
					)}
					{info?.foreignOffice && (
						<InfoCard icon={GlobeIcon} iconBg="#EA580C" label="Foreign Office">
							<p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.65 }}>{info.foreignOffice}</p>
						</InfoCard>
					)}

					{quickFacts.length > 0 && (
						<div style={{ marginTop: "0.5rem", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", padding: "1rem 1.25rem" }}>
							<p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "0.75rem" }}>Quick Facts</p>
							<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
								{quickFacts.map((fact, i) => (
									<span key={i} style={{ fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(27,42,107,0.15)", color: "#1B2A6B", background: "rgba(27,42,107,0.04)" }}>
										{fact}
									</span>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Right — form */}
				<div style={{ flex: 1 }}>
					{form?.title && (
						<h2 className="font-heading text-2xl font-bold text-brand-text" style={{ marginBottom: "1.25rem" }}>{form.title}</h2>
					)}
					<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
							<FormField label={form?.nameLabel ?? "Your Name"} placeholder={form?.namePlaceholder} value={fields.name} onChange={(v) => handleChange("name", v)} required />
							<FormField label={form?.companyLabel ?? "Company"} placeholder={form?.companyPlaceholder} value={fields.company} onChange={(v) => handleChange("company", v)} />
						</div>

						<FormField label={form?.emailLabel ?? "Email Address"} type="email" placeholder={form?.emailPlaceholder} value={fields.email} onChange={(v) => handleChange("email", v)} required />

						{additionalFields.map((f) => (
							<FormField key={f.label} label={f.label} placeholder={f.placeholder} value={fields[f.label] ?? ""} onChange={(v) => handleChange(f.label, v)} required={f.required} />
						))}

						<div>
							<label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#111827" }}>
								{form?.messageLabel ?? "Message"}<span style={{ color: "#E63946", marginLeft: 2 }}>*</span>
							</label>
							<textarea
								rows={4}
								required
								placeholder={form?.messagePlaceholder ?? "Tell us about your project or requirements…"}
								value={fields.message}
								onChange={(e) => handleChange("message", e.target.value)}
								style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb", padding: "9px 13px", fontSize: 14, outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
							/>
						</div>

						<div style={{ paddingTop: "0.25rem" }}>
							<button
								type="submit"
								style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 28px", borderRadius: 8, border: "none", background: "#1B2A6B", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
							>
								{form?.submitLabel ?? "Send Message"}
								<SendIcon />
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}
