import HeroCareerEditor from "./HeroCareerEditor.jsx";
import WhyJoinEditor from "./WhyJoinEditor.jsx";
import OpeningsEditor from "./OpeningsEditor.jsx";
import PerksEditor from "./PerksEditor.jsx";
import CtaBannerEditor from "./CtaBannerEditor.jsx";

export const CAREERS_SECTION_EDITORS = {
	hero: HeroCareerEditor,
	whyJoin: WhyJoinEditor,
	openings: OpeningsEditor,
	perks: PerksEditor,
	ctaBanner: CtaBannerEditor,
};

export const SECTION_LABELS = {
	hero: "Hero",
	whyJoin: "Why Join Us",
	openings: "Open Positions",
	perks: "Benefits & Perks",
	ctaBanner: "CTA Banner",
};

export const ALL_SECTION_KEYS = ["hero", "whyJoin", "openings", "perks", "ctaBanner"];
