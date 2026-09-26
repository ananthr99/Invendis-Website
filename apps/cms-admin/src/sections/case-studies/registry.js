import HeroCaseStudiesEditor from "./HeroCaseStudiesEditor.jsx";
import CaseStudiesEditor from "./CaseStudiesEditor.jsx";
import WhitePapersEditor from "./WhitePapersEditor.jsx";
import CtaBannerEditor from "../home/CtaBannerEditor.jsx";

export const CASE_STUDIES_SECTION_EDITORS = {
	hero: HeroCaseStudiesEditor,
	caseStudies: CaseStudiesEditor,
	whitePapers: WhitePapersEditor,
	ctaBanner: CtaBannerEditor,
};

export const SECTION_LABELS = {
	hero: "Hero",
	caseStudies: "Case Studies",
	whitePapers: "White Papers",
	ctaBanner: "CTA Banner",
};

export const ALL_SECTION_KEYS = ["hero", "caseStudies", "whitePapers", "ctaBanner"];
