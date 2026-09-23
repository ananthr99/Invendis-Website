import HeroSectorEditor from "./HeroSectorEditor.jsx";
import VerticalsEditor from "./VerticalsEditor.jsx";
import GlobalReachEditor from "./GlobalReachEditor.jsx";
import CtaBannerEditor from "../home/CtaBannerEditor.jsx";

export const SECTOR_SECTION_EDITORS = {
	hero: HeroSectorEditor,
	verticals: VerticalsEditor,
	globalReach: GlobalReachEditor,
	cta: CtaBannerEditor,
};

export const SECTION_LABELS = {
	hero: "Hero",
	verticals: "Verticals",
	globalReach: "Global Reach",
	cta: "CTA Banner",
};

export const ALL_SECTION_KEYS = ["hero", "verticals", "globalReach", "cta"];
