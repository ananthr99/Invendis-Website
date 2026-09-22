import { useState } from "react";
import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";

// Second full worked example. Note the "additional fields" pattern: the
// CMS's Contact editor can add arbitrary extra text fields (see
// form.additionalFields in contact.json) without any code change here —
// they're rendered generically from the array.
export default function Contact() {
	const { data, loading } = useContent("pages/contact.json", { withLoading: true });
	const [fields, setFields] = useState({ name: "", email: "", message: "" });

	if (loading) return null;

	const additionalFields = data?.form?.additionalFields ?? [];

	function handleChange(key, value) {
		setFields((f) => ({ ...f, [key]: value }));
	}

	function handleSubmit(e) {
		e.preventDefault();
		const to = data?.contactEmail ?? "info@invendis.com";
		const subject = encodeURIComponent(`Website enquiry from ${fields.name || "a visitor"}`);
		const bodyLines = [
			`Name: ${fields.name}`,
			`Email: ${fields.email}`,
			...additionalFields.map((f) => `${f.label}: ${fields[f.label] ?? ""}`),
			"",
			fields.message,
		];
		window.location.href = `mailto:${to}?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
	}

	return (
		<>
			<PageSEO title="Contact" description={data?.hero?.subtitle} path="/contact" />

			<section className="bg-brand-dark px-6 py-20 text-white">
				<div className="mx-auto max-w-3xl text-center">
					<h1 className="font-heading text-3xl font-bold sm:text-4xl">{data?.hero?.title ?? "Get in touch"}</h1>
					<p className="mt-3 text-white/70">{data?.hero?.subtitle}</p>
				</div>
			</section>

			<section className="mx-auto max-w-xl px-6 py-16">
				<form onSubmit={handleSubmit} className="space-y-4">
					<Field
						label={data?.form?.nameLabel ?? "Name"}
						value={fields.name}
						onChange={(v) => handleChange("name", v)}
						required
					/>
					<Field
						label={data?.form?.emailLabel ?? "Email"}
						type="email"
						value={fields.email}
						onChange={(v) => handleChange("email", v)}
						required
					/>

					{additionalFields.map((f) => (
						<Field
							key={f.label}
							label={f.label}
							placeholder={f.placeholder}
							value={fields[f.label] ?? ""}
							onChange={(v) => handleChange(f.label, v)}
							required={f.required}
						/>
					))}

					<div>
						<label className="mb-1 block text-sm font-medium text-brand-text">
							{data?.form?.messageLabel ?? "Message"}
						</label>
						<textarea
							rows={5}
							required
							value={fields.message}
							onChange={(e) => handleChange("message", e.target.value)}
							className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
						/>
					</div>

					<button
						type="submit"
						className="w-full rounded-full bg-brand-blue py-3 font-medium text-white hover:bg-brand-blue/90"
					>
						{data?.form?.submitLabel ?? "Send message"}
					</button>
				</form>
			</section>
		</>
	);
}

function Field({ label, type = "text", value, onChange, required, placeholder }) {
	return (
		<div>
			<label className="mb-1 block text-sm font-medium text-brand-text">{label}</label>
			<input
				type={type}
				required={required}
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
			/>
		</div>
	);
}
