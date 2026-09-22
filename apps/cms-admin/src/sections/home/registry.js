import TopBarEditor from "./TopBarEditor.jsx";
import HeroEditor from "./HeroEditor.jsx";
import StatsEditor from "./StatsEditor.jsx";
import TrustedByEditor from "./TrustedByEditor.jsx";
import WhatWeDoEditor from "./WhatWeDoEditor.jsx";
import TestimonialsEditor from "./TestimonialsEditor.jsx";
import CtaBannerEditor from "./CtaBannerEditor.jsx";

export const HOME_SECTION_EDITORS = {
	topBar: TopBarEditor,
	hero: HeroEditor,
	stats: StatsEditor,
	trustedBy: TrustedByEditor,
	whatWeDo: WhatWeDoEditor,
	testimonials: TestimonialsEditor,
	cta: CtaBannerEditor,
};

export const SECTION_LABELS = {
	topBar: "Top Bar",
	hero: "Hero",
	stats: "Stats",
	trustedBy: "Trusted By",
	whatWeDo: "What We Do",
	testimonials: "Testimonials",
	cta: "CTA Banner",
};

export const ALL_SECTION_KEYS = ["topBar", "hero", "stats", "trustedBy", "whatWeDo", "testimonials", "cta"];
